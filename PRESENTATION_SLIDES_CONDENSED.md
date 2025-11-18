# AI Personal Safety Guardian
## Condensed Presentation (7-8 Slides)

---

## Slide 1: Title & Overview
# AI Personal Safety Guardian
### Multi-Modal AI-Powered Safety Analysis Platform

**Powered by Google Gemini 2.5 Flash AI**

## Five Core Modules:
1. 📝 **Text Analysis** - Written safety concerns
2. 🖼️ **Image Analysis** - Visual threat detection  
3. 🎥 **Video Analysis** - Temporal behavior analysis
4. 🎤 **Audio Analysis** - Acoustic threat detection
5. 📍 **Location Analysis** - Safe route guidance

**Tech Stack:** Next.js + Node.js + Express + Google Gemini AI

---

## Slide 2: Text Analysis Module - How It Works
# 📝 Text Analysis Module

## Workflow:
```
User Input → Validation → Gemini AI → Threat Detection → Results
```

## Example:

**Input:**
```
"I'm walking home late at night and noticed someone 
following me for the past three blocks. I'm near 
a dark alley and feeling very unsafe."
```

**AI Processing:**
- Analyzes emotional cues (fear, anxiety, urgency)
- Detects danger indicators (being followed, dark location)
- Assesses threat probability
- Generates actionable recommendations

**Output:**
```json
{
  "threat_level": "high",
  "emotional_cues": ["fear", "anxiety", "urgency"],
  "danger_probability": 0.85,
  "detected_risks": [
    "Being followed",
    "Dark, isolated location",
    "Late night vulnerability"
  ],
  "recommended_actions": [
    "Immediately head to a well-lit public area",
    "Call someone and stay on the phone",
    "Do not go home directly",
    "Consider calling emergency services"
  ],
  "urgent_help_needed": true
}
```

**Display:** Threat level badge (🔴 High) + Risk list + Actionable steps

---

## Slide 3: Image Analysis Module - How It Works
# 🖼️ Image Analysis Module

## Workflow:
```
Image Upload → File Validation → Base64 Encoding → 
Gemini Vision API → Visual Analysis → Results
```

## Example:

**Input:**
- User uploads image of dark alley (JPEG, PNG, GIF, WebP, max 10MB)
- Optional text note: "This is the alley I need to walk through"

**AI Processing:**
- Analyzes visual elements (lighting, people, objects, environment)
- Detects suspicious individuals or behavior
- Identifies environmental hazards (poor lighting, isolation)
- Assesses immediate danger signs

**Output:**
```json
{
  "threat_level": "medium",
  "detected_objects": [
    "Poor street lighting",
    "Isolated alleyway",
    "No visible people",
    "Dark corners"
  ],
  "explanation": "The image shows a poorly lit alley 
  with limited visibility and no visible public presence.",
  "recommended_actions": [
    "Avoid this route if possible",
    "Use well-lit alternative path",
    "Share location with trusted contact",
    "Keep phone accessible"
  ],
  "confidence_score": 0.78
}
```

**Display:** Image preview + Threat indicator + Detected objects + Safety recommendations

---

## Slide 4: Video Analysis Module - How It Works
# 🎥 Video Analysis Module

## Workflow:
```
Video Upload → Format Validation → Base64 Encoding → 
Gemini Video API → Temporal Analysis → Pattern Recognition → Results
```

## Example:

**Input:**
- User uploads 30-second video clip (MP4, WebM, MOV, AVI, max 50MB)
- Video shows person walking through park at night

**AI Processing:**
- Tracks behavior patterns over time
- Detects following or stalking behavior
- Analyzes movement patterns and approaching individuals
- Monitors environmental changes (lighting, isolation)

**Output:**
```json
{
  "threat_level": "high",
  "hazards_seen": [
    "Dark park with limited lighting",
    "Person following at consistent distance",
    "Isolated path with no other people"
  ],
  "people_detected": [
    "Individual approximately 20 meters behind, 
     matching user's pace and direction"
  ],
  "movement_patterns": [
    "Following behavior detected",
    "Subject maintains consistent distance",
    "No attempt to pass or change direction"
  ],
  "summary": "Video shows clear following behavior 
  in an isolated, poorly lit environment.",
  "actions": [
    "Immediately change direction",
    "Head to nearest well-lit public area",
    "Call emergency services",
    "Do not go to isolated location"
  ],
  "confidence": 0.92
}
```

**Display:** Video playback + Threat timeline + Movement patterns + Urgent actions

---

## Slide 5: Audio Analysis Module - How It Works
# 🎤 Audio Analysis Module

## Workflow:
```
Audio Record/Upload → Format Validation → Base64 Encoding → 
Gemini Audio API → Acoustic Analysis → Sound Event Detection → Results
```

## Example:

**Input:**
- User records 30-second audio clip (MP3, WAV, WebM, OGG, M4A, max 10MB)
- Audio contains distressed voices and concerning sounds

**AI Processing:**
- Detects distressed voices, screams, cries for help
- Identifies aggressive or threatening language
- Recognizes background danger sounds (breaking glass, alarms, shouting)
- Analyzes panic or fear indicators in voices
- Monitors approaching footsteps or suspicious conversations

**Output:**
```json
{
  "threat_level": "critical",
  "sound_events": [
    "Distressed female voice",
    "Aggressive male voice with threats",
    "Breaking glass sound",
    "Rapid footsteps approaching",
    "Background shouting"
  ],
  "risk_reasoning": "Audio contains clear signs of 
  immediate danger: distressed voice, aggressive language 
  with threats, breaking sounds suggesting violence, 
  and approaching footsteps.",
  "actions": [
    "Call emergency services immediately (911/112)",
    "If safe to do so, record more audio as evidence",
    "Move to secure location if possible",
    "Share location with trusted contacts"
  ],
  "detected_risks": [
    "Active threat situation",
    "Physical violence occurring",
    "Immediate danger present"
  ],
  "confidence": 0.95
}
```

**Display:** Audio waveform + Sound events timeline + Critical alert + Emergency actions

---

## Slide 6: Location Analysis Module - How It Works
# 📍 Location Analysis & Safe Route Module

## Workflow:
```
Location Share → GPS Capture → Coordinate Validation → 
Gemini AI → Location Analysis → Route Planning → Map Integration → Results
```

## Example:

**Input:**
- User clicks location icon → Browser requests GPS permission
- Captures coordinates: `{ lat: 40.7128, lng: -74.0060 }`

**AI Processing:**
- Analyzes current location context (neighborhood, time of day)
- Finds safest nearby destinations (police stations, hospitals, public areas)
- Plans route considering lighting, public presence, traffic
- Identifies safe areas, unsafe zones, and caution areas

**Output:**
```json
{
  "threat_level": "medium",
  "route_description": "Head north on Main Street for 
  200 meters to the well-lit intersection, then turn 
  east toward the 24-hour police substation.",
  "route_steps": [
    "Walk north on Main Street (200m)",
    "Turn right at the well-lit intersection",
    "Continue east for 150m",
    "Destination: Police Substation on your left"
  ],
  "safe_destination": "24-Hour Police Substation on Market Avenue",
  "safe_areas": [
    "Main Street (well-lit, public presence)",
    "Market Avenue intersection (high visibility)",
    "Police substation vicinity (24/7 security)"
  ],
  "unsafe_areas": [
    "Dark alley west of current location",
    "Isolated park path to the south",
    "Underpass beneath highway"
  ],
  "recommended_actions": [
    "Stay on well-lit main streets",
    "Keep phone accessible",
    "Share live location with trusted contact",
    "Walk confidently and stay alert"
  ],
  "estimated_walk_time_minutes": 5,
  "route_link": "https://www.google.com/maps/dir/..."
}
```

**Display:** Interactive map + Step-by-step navigation + Safe/unsafe area indicators (🟢/🔴) + Google Maps link

---

## Slide 7: System Architecture & Integration
# System Architecture

## Complete Flow:

```
┌─────────────┐
│   Frontend  │  Next.js + React + TypeScript
│  (User UI)  │
└──────┬──────┘
       │ HTTP Requests
       ↓
┌─────────────┐
│   Backend   │  Node.js + Express.js
│  (API)      │
└──────┬──────┘
       │
       ├─→ Text Controller → Gemini AI
       ├─→ Image Controller → Gemini Vision API
       ├─→ Video Controller → Gemini Video API
       ├─→ Audio Controller → Gemini Audio API
       └─→ Route Controller → Gemini AI (Location)
```

## Key Features:
- **Multi-Key Rotation**: Automatic API key rotation on rate limits
- **Retry Logic**: Exponential backoff with intelligent retry
- **Error Handling**: Graceful degradation with user-friendly messages
- **File Management**: Automatic cleanup after processing
- **Response Parsing**: Robust JSON extraction and normalization

## Unified Output Format:
All modules return standardized threat assessment:
- `threat_level`: low | medium | high | critical
- `detected_risks`: Array of identified risks
- `recommended_actions`: Actionable safety steps
- `confidence`: 0.0 - 1.0 score
- Module-specific fields (objects, sounds, routes, etc.)

---

## Slide 8: Summary & Key Highlights
# Summary & Key Highlights

## All Modules Working Together:

| Module | Input | AI Analysis | Output |
|--------|-------|-------------|--------|
| **Text** | Written description | Language & emotion analysis | Threat level + Actions |
| **Image** | Photo file | Visual threat detection | Objects + Risks + Recommendations |
| **Video** | Video file | Temporal behavior tracking | Patterns + Hazards + Urgent actions |
| **Audio** | Audio file | Acoustic threat detection | Sound events + Risk reasoning + Emergency steps |
| **Location** | GPS coordinates | Spatial safety analysis | Safe route + Areas to avoid + Navigation |

## Key Achievements:
✅ **Real-Time Analysis**: Instant threat assessment across all modalities  
✅ **AI-Powered Intelligence**: Google Gemini 2.5 Flash for accurate detection  
✅ **Actionable Output**: Specific, practical safety recommendations  
✅ **User-Friendly**: Intuitive interface designed for emergency use  
✅ **Production-Ready**: Robust error handling, security, and scalability  

## Impact:
**Empowers users with AI-driven safety insights to make informed decisions in potentially dangerous situations.**

---

*End of Presentation*



