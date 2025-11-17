const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

class GeminiClient {
  constructor() {
    console.log('🔧 GeminiClient constructor called');
    
    // Method 1: Try individual environment variables (GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.)
    // This works better with Railway's UI
    const individualKeys = [];
    for (let i = 1; i <= 20; i++) { // Support up to 20 keys
      const key = process.env[`GEMINI_API_KEY_${i}`];
      if (key && key.trim().length > 0) {
        individualKeys.push(key.trim());
      }
    }
    
    // Method 2: Try comma-separated in GEMINI_API_KEY (for local .env files)
    const apiKeysEnv = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS;
    const commaSeparatedKeys = apiKeysEnv 
      ? apiKeysEnv.split(',').map(key => key.trim()).filter(key => key.length > 0)
      : [];
    
    // Combine both methods (individual keys take priority, then add comma-separated)
    // Remove duplicates
    const allKeys = [...individualKeys];
    commaSeparatedKeys.forEach(key => {
      if (!allKeys.includes(key)) {
        allKeys.push(key);
      }
    });
    
    console.log(`   Individual keys (GEMINI_API_KEY_1, _2, etc.): ${individualKeys.length}`);
    console.log(`   Comma-separated keys (GEMINI_API_KEY): ${commaSeparatedKeys.length}`);
    console.log(`   Total unique keys: ${allKeys.length}`);
    
    if (allKeys.length === 0) {
      console.error('❌ No API keys found!');
      console.error('   Please set either:');
      console.error('   - GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc. (for Railway)');
      console.error('   - OR GEMINI_API_KEY with comma-separated values (for local)');
      throw new Error('No API keys found. Set GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc. or GEMINI_API_KEY with comma-separated values');
    }
    
    this.apiKeys = allKeys;
    
    // Debug: Log key info (masked for security)
    console.log(`✅ Initialized GeminiClient with ${this.apiKeys.length} API key(s)`);
    this.apiKeys.forEach((key, index) => {
      const masked = key.length > 10 ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : '***';
      console.log(`   Key ${index + 1}: ${masked} (length: ${key.length})`);
      
      // Validate key format (should start with AIza and be ~39 chars)
      if (!key.startsWith('AIza')) {
        console.warn(`   ⚠️ Key ${index + 1} doesn't start with 'AIza' - might be invalid`);
      }
      if (key.length < 30 || key.length > 50) {
        console.warn(`   ⚠️ Key ${index + 1} has unusual length (${key.length}) - expected ~39`);
      }
    });
    
    this.currentKeyIndex = 0;
    this.rateLimitedKeys = new Map(); // Track rate-limited keys with timestamp
    this.quotaExceededKeys = new Set(); // Track keys with quota exceeded (429) - these need daily reset
    this.rateLimitCooldown = 5 * 60 * 1000; // 5 minutes cooldown for 503 overload errors
    this.quotaCooldown = 24 * 60 * 60 * 1000; // 24 hours cooldown for 429 quota errors
  }

  /**
   * Get the next available API key, rotating if needed
   */
  getAvailableKey() {
    const now = Date.now();
    const availableKeys = [];
    
    // Check all keys and find available ones
    for (let i = 0; i < this.apiKeys.length; i++) {
      const keyIndex = (this.currentKeyIndex + i) % this.apiKeys.length;
      const key = this.apiKeys[keyIndex];
      
      // Skip keys with quota exceeded (429) - these need daily reset
      if (this.quotaExceededKeys.has(keyIndex)) {
        continue; // Skip this key entirely
      }
      
      const rateLimitTime = this.rateLimitedKeys.get(keyIndex);
      
      if (!rateLimitTime || (now - rateLimitTime) > this.rateLimitCooldown) {
        // Key is available (not rate-limited or cooldown expired)
        if (rateLimitTime) {
          this.rateLimitedKeys.delete(keyIndex); // Remove from blacklist
          console.log(`🔄 Key ${keyIndex + 1} is now available again`);
        }
        availableKeys.push({ key, index: keyIndex });
      }
    }
    
    if (availableKeys.length === 0) {
      // All keys are rate-limited or quota-exceeded
      const quotaExceededCount = this.quotaExceededKeys.size;
      const rateLimitedCount = this.rateLimitedKeys.size;
      console.warn(`⚠️ All keys unavailable: ${quotaExceededCount} quota-exceeded, ${rateLimitedCount} rate-limited`);
      
      // If we have keys that are just rate-limited (not quota-exceeded), try one anyway
      if (rateLimitedCount > 0) {
        console.warn('⚠️ Attempting a rate-limited key anyway (might work if overload is temporary)');
        const key = this.apiKeys[this.currentKeyIndex];
        return { key, index: this.currentKeyIndex };
      }
      
      // All keys have quota exceeded - this is a bigger problem
      throw new Error('All API keys have exceeded their quota. Please wait for daily quota reset or add more API keys.');
    }
    
    // Use the first available key
    const selected = availableKeys[0];
    this.currentKeyIndex = selected.index;
    return selected;
  }

  /**
   * Mark a key as rate-limited (503 overload) or quota-exceeded (429)
   */
  markKeyRateLimited(keyIndex, isQuotaExceeded = false) {
    if (isQuotaExceeded) {
      // 429 quota exceeded - mark as unavailable for 24 hours
      this.quotaExceededKeys.add(keyIndex);
      console.log(`🚫 Key ${keyIndex + 1} marked as QUOTA EXCEEDED (429) - will skip until daily reset`);
    } else {
      // 503 overload - temporary, retry after 5 minutes
      this.rateLimitedKeys.set(keyIndex, Date.now());
      console.log(`⏸️ Key ${keyIndex + 1} marked as rate-limited (503), will retry after ${this.rateLimitCooldown / 1000 / 60} minutes`);
    }
    
    // Rotate to next key
    this.currentKeyIndex = (keyIndex + 1) % this.apiKeys.length;
  }

  /**
   * Check if error is a rate limit error (503 or 429)
   */
  isRateLimitError(error) {
    if (!error || !error.status) return false;
    return error.status === 503 || error.status === 429;
  }

  /**
   * Execute a Gemini API call with automatic key rotation and retry
   */
  async executeWithRetry(apiCall, maxRetries = null) {
    if (maxRetries === null) {
      maxRetries = this.apiKeys.length; // Try all keys once
    }
    
    let lastError = null;
    const attemptedKeys = new Set();
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const { key, index } = this.getAvailableKey();
      
      // Prevent infinite loops if we've tried all keys
      if (attemptedKeys.has(index) && attemptedKeys.size >= this.apiKeys.length) {
        break;
      }
      attemptedKeys.add(index);
      
      try {
        // Debug: Log which key is being used (masked)
        const maskedKey = key.length > 10 ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : '***';
        console.log(`🔑 Attempting with key ${index + 1}/${this.apiKeys.length}: ${maskedKey}`);
        
        const genAI = new GoogleGenerativeAI(key);
        const result = await apiCall(genAI);
        
        // Success - reset rate limit tracking for this key if it was previously limited
        if (this.rateLimitedKeys.has(index)) {
          this.rateLimitedKeys.delete(index);
          console.log(`✅ Key ${index + 1} is working again`);
        }
        
        console.log(`✅ Request succeeded with key ${index + 1}`);
        return result;
      } catch (error) {
        lastError = error;
        
        // Log error details for debugging
        const errorStatus = error.status || 'unknown';
        const errorMessage = error.message || 'Unknown error';
        console.error(`❌ Key ${index + 1} failed: Status ${errorStatus} - ${errorMessage.substring(0, 100)}`);
        
        // Check if it's a rate limit error
        if (this.isRateLimitError(error)) {
          const isQuotaExceeded = error.status === 429 || error.message.includes('quota') || error.message.includes('429');
          
          if (isQuotaExceeded) {
            console.warn(`🚫 Quota exceeded on key ${index + 1} (attempt ${attempt + 1}/${maxRetries}): ${error.message}`);
            this.markKeyRateLimited(index, true); // Mark as quota-exceeded
          } else {
            console.warn(`⚠️ Rate limit hit on key ${index + 1} (attempt ${attempt + 1}/${maxRetries}): ${error.message}`);
            this.markKeyRateLimited(index, false); // Mark as temporarily rate-limited
          }
          
          // Wait a bit before retrying with next key (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          continue; // Try next key
        } else if (error.status === 400 && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
          // Invalid API key - mark this key as invalid and try next
          console.error(`🚫 Key ${index + 1} is INVALID (400 Bad Request) - API key not valid. Trying next key...`);
          this.quotaExceededKeys.add(index); // Mark as unusable
          
          // If this is the last key, throw error
          if (attempt >= maxRetries - 1) {
            throw new Error(`All API keys are invalid. Please check your GEMINI_API_KEY environment variable in Railway.`);
          }
          
          // Wait a bit before trying next key
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; // Try next key
        } else {
          // Non-rate-limit error (auth, invalid request, etc.) - don't retry
          console.error(`❌ Non-rate-limit error on key ${index + 1}: ${error.message}`);
          throw error;
        }
      }
    }
    
    // All keys exhausted
    throw new Error(`All API keys exhausted. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Analyze image for safety threats
   */
  async analyzeImage(imagePath, mimeType = 'image/jpeg', textNote = '') {
    try {
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');

      const prompt = `Analyze this image for personal safety threats. ${textNote ? `Additional context: ${textNote}. ` : ''}Look for:
- Suspicious individuals or behavior
- Dangerous situations (weapons, violence, etc.)
- Environmental hazards (poor lighting, isolated areas, etc.)
- Any signs of immediate danger
- Objects and people visible in the image

Respond in JSON format with:
{
  "threat_level": "low" | "medium" | "high" | "critical",
  "detected_objects": ["object1", "object2", "object3"],
  "explanation": "Detailed explanation of the threat assessment",
  "recommended_actions": ["action1", "action2", "action3"],
  "confidence_score": 0.0-1.0,
  "detected_risks": ["risk1", "risk2"],
  "extra_info": {}
}

Be specific about what you see in the image. The detected_objects should list actual things visible (people, vehicles, lighting conditions, etc.). The explanation should relate directly to what is shown in the image.`;

      return await this.executeWithRetry(async (genAI) => {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          }
        ]);
        const response = await result.response;
        const text = response.text();
        return this.parseGeminiResponse(text);
      });
    } catch (error) {
      console.error('Gemini image analysis error:', error);
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze video for safety threats
   */
  async analyzeVideo(videoPath, mimeType = 'video/mp4') {
    try {
      // Note: Gemini may have limitations with video
      // For production, consider extracting frames or using video-specific models
      // For now, we'll use a text-based analysis approach
      // Use gemini-2.5-flash which supports video
      const videoData = fs.readFileSync(videoPath);
      const base64Video = videoData.toString('base64');

      const prompt = `Analyze this video for personal safety threats. Look for:
- Suspicious individuals or behavior patterns
- Following behavior or stalking
- Aggressive movements or postures
- Dangerous situations developing over time
- Environmental hazards (poor lighting, isolated areas, dark alleys)
- People approaching or following
- Weapons or threatening objects
- Escalating threats or conflicts
- Running or fleeing behavior
- Suspicious movement patterns

Respond in JSON format with:
{
  "threat_level": "low" | "medium" | "high" | "critical",
  "hazards_seen": ["hazard1", "hazard2"],
  "people_detected": ["person1 description", "person2 description"],
  "movement_patterns": ["pattern1", "pattern2"],
  "summary": "Detailed explanation of the threat assessment based on what was seen",
  "actions": ["action1", "action2", "action3"],
  "detected_risks": ["risk1", "risk2"],
  "confidence": 0.0-1.0,
  "extra_info": {}
}

Be specific about what you see in the video. The hazards_seen should list actual environmental dangers. The people_detected should describe individuals visible. The movement_patterns should describe how people are moving. The summary should relate directly to the video content.`;

      return await this.executeWithRetry(async (genAI) => {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Video,
              mimeType: mimeType
            }
          }
        ]);
        const response = await result.response;
        const text = response.text();
        return this.parseGeminiResponse(text);
      });
    } catch (error) {
      console.error('Gemini video analysis error:', error);
      throw new Error(`Video analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze audio for safety threats
   */
  async analyzeAudio(audioPath, mimeType = 'audio/webm') {
    try {
      // Use gemini-2.5-flash for audio analysis
      const audioData = fs.readFileSync(audioPath);
      const base64Audio = audioData.toString('base64');

      const prompt = `Analyze this audio for personal safety threats. Listen for:
- Distressed voices, screams, or cries for help
- Aggressive or threatening language
- Background sounds indicating danger (breaking glass, alarms, shouting, violence)
- Signs of conflict or physical altercation
- Panic or fear in the speaker's voice
- Footsteps approaching or following
- Suspicious background conversations
- Environmental sounds suggesting unsafe locations

Respond in JSON format with:
{
  "threat_level": "low" | "medium" | "high" | "critical",
  "sound_events": ["event1", "event2", "event3"],
  "risk_reasoning": "Detailed explanation of what was heard and why it's concerning",
  "actions": ["action1", "action2", "action3"],
  "detected_risks": ["risk1", "risk2"],
  "confidence": 0.0-1.0,
  "extra_info": {}
}

Be specific about what you heard in the audio. The sound_events should list actual sounds detected. The risk_reasoning should relate directly to the audio content.`;

      return await this.executeWithRetry(async (genAI) => {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Audio,
              mimeType: mimeType
            }
          }
        ]);
        const response = await result.response;
        const text = response.text();
        return this.parseGeminiResponse(text);
      });
    } catch (error) {
      console.error('Gemini audio analysis error:', error);
      throw new Error(`Audio analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze text for safety threats
   */
  async analyzeText(text) {
    try {
      const prompt = `Analyze this text for personal safety threats and emotional cues. Look for:
- Threats or intimidation
- Signs of danger or violence
- Suspicious behavior descriptions
- Emergency situations
- Location-based risks
- Emotional distress indicators (fear, panic, anxiety)
- Urgent help requests

Text to analyze:
"${text}"

Respond in JSON format with:
{
  "threat_level": "low" | "medium" | "high" | "critical",
  "emotional_cues": ["cue1", "cue2"],
  "danger_probability": 0.0-1.0,
  "suggestions": ["suggestion1", "suggestion2"],
  "urgent_help_needed": true/false,
  "detected_risks": ["risk1", "risk2"],
  "explanation": "Detailed explanation of the threat assessment",
  "confidence_score": 0.0-1.0,
  "recommended_actions": ["action1", "action2"],
  "confidence": 0.0-1.0,
  "extra_info": {}
}

Be specific about what you found in the text. The emotional_cues should list actual emotional indicators found. The detected_risks should list specific safety concerns mentioned. The explanation should relate directly to the content of the provided text.`;

      return await this.executeWithRetry(async (genAI) => {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();
        return this.parseGeminiResponse(textResponse);
      });
    } catch (error) {
      console.error('Gemini text analysis error:', error);
      throw new Error(`Text analysis failed: ${error.message}`);
    }
  }

  /**
   * Suggest safe route / destination based on current coordinates
   */
  async suggestSafeRoute(currentLocation = {}, destinationDescription = '', additionalContext = '') {
    try {
      const { lat, lng } = currentLocation;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        throw new Error('Invalid coordinates provided to suggestSafeRoute');
      }

      const prompt = `You are Personal Safety Guardian, an expert at suggesting safe nearby destinations for people who might be in danger.
Current coordinates (latitude, longitude): ${lat}, ${lng}
User destination preference or context: ${destinationDescription || 'User just needs the safest accessible public place nearby'}
Additional situation details: ${additionalContext || 'Not provided'}

Use general safety best practices (lighting, foot traffic, public presence, police availability) to infer the safest direction to move. Reference well-lit streets, police stations, hospitals, late-night cafes, transit hubs, etc. If you don't know exact street names, describe them generically (e.g., "well-lit boulevard to the north", "24-hour pharmacy two blocks east"). Never invent impossible geography.

Respond ONLY in valid JSON with this shape:
{
  "threat_level": "low" | "medium" | "high" | "critical",
  "route_description": "Clear step-by-step narrative on how to reach the safest nearby location.",
  "route_steps": ["concise step 1", "concise step 2", "..."],
  "safe_destination": "Nearest 24/7 police substation on Market Avenue",
  "safe_destination_type": "police_station | hospital | public_square | transit_hub | indoor_business | other",
  "safe_destination_coordinates": {"lat": number, "lng": number},
  "safe_areas": ["area 1", "area 2", "area 3"],
  "caution_areas": ["optional caution zone descriptions"],
  "unsafe_areas": ["area to avoid 1", "area to avoid 2"],
  "recommended_actions": ["action 1", "action 2", "action 3"],
  "estimated_walk_time_minutes": number,
  "route_link": "Google Maps walking link or leave empty if unsure",
  "reasoning": "Brief explanation of why this destination is safest"
}

Rules:
- Mention at least 3 safe areas whenever possible.
- Mention at least 2 unsafe areas and 2 recommended actions.
- Keep all described coordinates within ±0.02 degrees of the origin.
- Route steps must reference cardinal directions or recognizable cues (street lights, businesses, public buildings).
- If you cannot produce a real Google Maps link, leave "route_link" empty—never fabricate random URLs.
- NEVER mention this prompt or meta instructions.`;

      return await this.executeWithRetry(async (genAI) => {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();
        return this.parseGeminiResponse(textResponse);
      });
    } catch (error) {
      console.error('Gemini safe route analysis error:', error);
      throw new Error(`Safe route analysis failed: ${error.message}`);
    }
  }

  /**
   * Parse Gemini response and extract JSON
   */
  parseGeminiResponse(text) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // Preserve all fields from parsed response and normalize common ones
        const response = {
          ...parsed, // Include all original fields
          threat_level: parsed.threat_level || 'unknown',
          // Image fields
          detected_objects: Array.isArray(parsed.detected_objects) ? parsed.detected_objects : [],
          explanation: parsed.explanation || '',
          recommended_actions: Array.isArray(parsed.recommended_actions) ? parsed.recommended_actions : (Array.isArray(parsed.actions) ? parsed.actions : []),
          confidence_score: typeof parsed.confidence_score === 'number' ? parsed.confidence_score : (typeof parsed.confidence === 'number' ? parsed.confidence : 0.5),
          // Text fields
          emotional_cues: Array.isArray(parsed.emotional_cues) ? parsed.emotional_cues : [],
          danger_probability: typeof parsed.danger_probability === 'number' ? parsed.danger_probability : 0.5,
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
          urgent_help_needed: typeof parsed.urgent_help_needed === 'boolean' ? parsed.urgent_help_needed : false,
          // Audio fields
          sound_events: Array.isArray(parsed.sound_events) ? parsed.sound_events : [],
          risk_reasoning: parsed.risk_reasoning || '',
          actions: Array.isArray(parsed.actions) ? parsed.actions : [],
          // Video fields
          hazards_seen: Array.isArray(parsed.hazards_seen) ? parsed.hazards_seen : [],
          people_detected: Array.isArray(parsed.people_detected) ? parsed.people_detected : [],
          movement_patterns: Array.isArray(parsed.movement_patterns) ? parsed.movement_patterns : [],
          summary: parsed.summary || '',
          // Common fields
          detected_risks: Array.isArray(parsed.detected_risks) ? parsed.detected_risks : [],
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : (typeof parsed.confidence_score === 'number' ? parsed.confidence_score : 0.5),
          extra_info: parsed.extra_info || {}
        };
        
        return response;
      }
      
      // Fallback if no JSON found
      return {
        threat_level: 'unknown',
        detected_objects: [],
        explanation: 'Unable to parse AI response',
        recommended_actions: ['Please try again'],
        confidence_score: 0,
        detected_risks: ['Unable to parse AI response'],
        confidence: 0,
        extra_info: { raw_response: text }
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return {
        threat_level: 'unknown',
        detected_objects: [],
        explanation: 'Response parsing error',
        recommended_actions: ['Please try again'],
        confidence_score: 0,
        detected_risks: ['Response parsing error'],
        confidence: 0,
        extra_info: { error: error.message, raw_response: text }
      };
    }
  }
}

module.exports = new GeminiClient();

