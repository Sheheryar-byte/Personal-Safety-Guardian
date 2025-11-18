# AI Personal Safety Guardian
## Presentation Slides

---

## Slide 1: Title Slide
# AI Personal Safety Guardian
### Multi-Modal AI-Powered Safety Analysis Platform

**Powered by Google Gemini AI**

---

## Slide 2: Project Overview
# What is AI Personal Safety Guardian?

- **Full-stack web application** for personal safety assessment
- **AI-powered threat detection** across multiple input types
- **Real-time safety analysis** with actionable recommendations
- **Location-based route guidance** to safe destinations
- **User-friendly interface** designed for emergency situations

**Technology Stack:**
- Frontend: Next.js, React, TypeScript, TailwindCSS
- Backend: Node.js, Express.js
- AI: Google Gemini 2.5 Flash API

---

## Slide 3: Core Modules Overview
# Five Core Analysis Modules

1. **📝 Text Analysis** - Analyze written safety concerns
2. **🖼️ Image Analysis** - Visual threat detection
3. **🎥 Video Analysis** - Temporal behavior analysis
4. **🎤 Audio Analysis** - Acoustic threat detection
5. **📍 Location Analysis** - Safe route guidance

Each module uses specialized AI prompts optimized for its input type.

---

## Slide 4: Module 1 - Text Analysis
# 📝 Text Analysis Module

## How It Works:

1. **User Input**: User types or pastes text describing a situation
2. **Validation**: System validates text length (max 10,000 characters)
3. **AI Processing**: Text sent to Gemini AI with specialized safety analysis prompt
4. **Analysis**: AI detects:
   - Threats or intimidation
   - Emotional distress indicators
   - Location-based risks
   - Urgent help requests
   - Suspicious behavior descriptions
5. **Output**: Structured JSON response with threat assessment

## Output Format:
- Threat Level: Low | Medium | High | Critical
- Emotional Cues: Array of detected emotions
- Danger Probability: 0.0 - 1.0 score
- Recommended Actions: Specific safety steps
- Detailed Explanation: Context-aware reasoning

---

## Slide 5: Text Analysis - Example Flow
# Text Analysis: Example Workflow

### Step 1: User Input
```
"I'm walking home late at night and noticed someone 
following me for the past three blocks. I'm near 
a dark alley and feeling very unsafe."
```

### Step 2: AI Analysis Process
```
Text → Gemini AI → Safety Analysis Prompt → 
Threat Detection → Risk Assessment → Recommendations
```

### Step 3: AI Response
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

### Step 4: User Interface Display
- Threat level badge with emoji indicator (🔴 High)
- List of detected risks
- Actionable recommendations
- Confidence score display

---

## Slide 6: Module 2 - Image Analysis
# 🖼️ Image Analysis Module

## How It Works:

1. **File Upload**: User uploads image (JPEG, PNG, GIF, WebP, max 10MB)
2. **File Validation**: System checks file type, size, and format
3. **Image Processing**: Image converted to base64 encoding
4. **AI Analysis**: Gemini AI analyzes image for:
   - Suspicious individuals or behavior
   - Dangerous situations (weapons, violence)
   - Environmental hazards (poor lighting, isolation)
   - Immediate danger signs
   - Objects and people visible
5. **Context Enhancement**: Optional text note can provide additional context
6. **Output**: Comprehensive visual threat assessment

## Technical Details:
- Uses Gemini 2.5 Flash vision capabilities
- Supports inline image data transmission
- Automatic file cleanup after processing
- MIME type validation

---

## Slide 7: Image Analysis - Example Flow
# Image Analysis: Example Workflow

### Step 1: User Upload
- User clicks "Upload Image" button
- Selects image file from device
- Optionally adds text note: "This is the alley I need to walk through"

### Step 2: Backend Processing
```
Image File → Multer Upload → File Validation → 
Base64 Encoding → Gemini API → Vision Analysis
```

### Step 3: AI Vision Analysis
The AI examines:
- **People**: Number, positions, body language
- **Environment**: Lighting conditions, isolation level
- **Objects**: Potential weapons, barriers, escape routes
- **Context**: Time of day indicators, weather conditions

### Step 4: AI Response
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
  with limited visibility and no visible public presence. 
  This creates a vulnerable environment.",
  "recommended_actions": [
    "Avoid this route if possible",
    "Use well-lit alternative path",
    "Share location with trusted contact",
    "Keep phone accessible"
  ],
  "confidence_score": 0.78
}
```

### Step 5: Visual Display
- Uploaded image preview
- Threat level indicator
- Detected objects list
- Safety recommendations
- Confidence visualization

---

## Slide 8: Module 3 - Video Analysis
# 🎥 Video Analysis Module

## How It Works:

1. **Video Upload**: User uploads video (MP4, WebM, MOV, AVI, max 50MB)
2. **File Validation**: Checks format, size, and codec compatibility
3. **Video Processing**: Video converted to base64 for AI analysis
4. **Temporal Analysis**: Gemini AI analyzes video frames for:
   - Suspicious behavior patterns over time
   - Following or stalking behavior
   - Aggressive movements or postures
   - Environmental changes
   - Movement patterns
   - Approaching individuals
   - Weapons or threatening objects
5. **Output**: Time-based threat assessment with movement analysis

## Key Capabilities:
- Temporal pattern recognition
- Behavior tracking across frames
- Movement analysis
- Dynamic threat escalation detection

---

## Slide 9: Video Analysis - Example Flow
# Video Analysis: Example Workflow

### Step 1: User Upload
- User records or uploads video
- Example: 30-second clip of walking through a park at night

### Step 2: Video Processing Pipeline
```
Video File → Upload Handler → Format Validation → 
Base64 Encoding → Gemini Video API → 
Frame-by-Frame Analysis → Pattern Recognition
```

### Step 3: AI Temporal Analysis
The AI tracks:
- **People Movement**: Direction, speed, following patterns
- **Behavior Changes**: Escalating aggression, approaching
- **Environmental Shifts**: Lighting changes, isolation increases
- **Threat Progression**: How situation develops over time

### Step 4: AI Response
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
  in an isolated, poorly lit environment. The 
  individual maintains consistent distance suggesting 
  intentional tracking.",
  "actions": [
    "Immediately change direction",
    "Head to nearest well-lit public area",
    "Call emergency services",
    "Do not go to isolated location"
  ],
  "confidence": 0.92
}
```

### Step 5: Result Display
- Video playback with threat indicators
- Timeline showing threat progression
- Movement pattern visualization
- Urgent action recommendations

---

## Slide 10: Module 4 - Audio Analysis
# 🎤 Audio Analysis Module

## How It Works:

1. **Audio Recording/Upload**: User records or uploads audio (MP3, WAV, WebM, OGG, M4A, max 10MB)
2. **File Validation**: Checks audio format and quality
3. **Audio Processing**: Audio converted to base64 encoding
4. **Acoustic Analysis**: Gemini AI analyzes audio for:
   - Distressed voices, screams, cries for help
   - Aggressive or threatening language
   - Background danger sounds (breaking glass, alarms)
   - Signs of conflict or physical altercation
   - Panic or fear indicators in voices
   - Approaching footsteps
   - Suspicious background conversations
5. **Output**: Acoustic threat assessment with sound event detection

## Advanced Features:
- Voice emotion recognition
- Background sound analysis
- Temporal audio pattern detection
- Multi-speaker detection

---

## Slide 11: Audio Analysis - Example Flow
# Audio Analysis: Example Workflow

### Step 1: Audio Capture
- User clicks "Record Audio" button
- Records 30-second audio clip using browser microphone
- Or uploads pre-recorded audio file

### Step 2: Audio Processing
```
Audio File → Format Validation → Base64 Encoding → 
Gemini Audio API → Acoustic Analysis → 
Sound Event Detection → Threat Assessment
```

### Step 3: AI Acoustic Analysis
The AI listens for:
- **Voice Characteristics**: Tone, emotion, distress level
- **Language Content**: Threats, aggression, commands
- **Background Sounds**: Breaking, alarms, shouting, violence
- **Movement Sounds**: Footsteps, approaching, running
- **Environmental Audio**: Location context clues

### Step 4: AI Response
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
  immediate danger: distressed voice indicating fear, 
  aggressive language with threats, breaking sounds 
  suggesting violence, and approaching footsteps 
  indicating escalating situation.",
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

### Step 5: Audio Result Display
- Audio waveform visualization
- Sound events timeline
- Threat level with critical alert
- Immediate action recommendations
- Emergency contact quick access

---

## Slide 12: Module 5 - Location Analysis (Safe Route)
# 📍 Location Analysis & Safe Route Module

## How It Works:

1. **Location Sharing**: User clicks location button to share GPS coordinates
2. **Geolocation API**: Browser requests user's current location
3. **Coordinate Validation**: System validates latitude/longitude
4. **AI Route Analysis**: Gemini AI analyzes location and suggests:
   - Safest nearby destinations (police stations, hospitals, public areas)
   - Step-by-step route instructions
   - Safe areas to travel through
   - Areas to avoid (unsafe zones)
   - Caution areas requiring vigilance
5. **Map Integration**: Generates Google Maps link for navigation
6. **Output**: Comprehensive route guidance with safety assessment

## Destination Types:
- Police stations
- Hospitals
- Public squares
- Transit hubs
- 24-hour businesses
- Well-lit public areas

---

## Slide 13: Location Analysis - Example Flow
# Location Analysis: Example Workflow

### Step 1: Location Sharing
- User clicks 📍 location icon in chat interface
- Browser requests geolocation permission
- User grants permission
- System captures: `{ lat: 40.7128, lng: -74.0060 }`

### Step 2: Location Processing
```
GPS Coordinates → Validation → Gemini AI → 
Location Context Analysis → Safe Destination Search → 
Route Planning → Safety Zone Mapping
```

### Step 3: AI Location Analysis
The AI considers:
- **Current Location Context**: Neighborhood safety, time of day
- **Nearby Safe Destinations**: Distance, accessibility, safety level
- **Route Safety**: Well-lit paths, public presence, traffic
- **Avoidance Zones**: Known unsafe areas, dark alleys, isolated paths
- **Environmental Factors**: Lighting, foot traffic, public facilities

### Step 4: AI Response
```json
{
  "threat_level": "medium",
  "route_description": "Head north on Main Street for 
  200 meters to the well-lit intersection, then turn 
  east toward the 24-hour police substation. Avoid the 
  dark alley to your west.",
  "route_steps": [
    "Walk north on Main Street (200m)",
    "Turn right at the well-lit intersection",
    "Continue east for 150m",
    "Destination: Police Substation on your left"
  ],
  "safe_destination": "24-Hour Police Substation on Market Avenue",
  "safe_destination_type": "police_station",
  "safe_destination_coordinates": {
    "lat": 40.7145,
    "lng": -74.0045
  },
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
  "caution_areas": [
    "Side street between Main and Market (moderate lighting)"
  ],
  "recommended_actions": [
    "Stay on well-lit main streets",
    "Keep phone accessible",
    "Share live location with trusted contact",
    "Walk confidently and stay alert"
  ],
  "estimated_walk_time_minutes": 5,
  "route_link": "https://www.google.com/maps/dir/40.7128,-74.0060/40.7145,-74.0045",
  "reasoning": "Police substation is closest safe destination 
  with 24/7 presence, well-lit route, and high public visibility."
}
```

### Step 5: Route Modal Display
- Interactive map showing route
- Step-by-step navigation instructions
- Safe/unsafe area indicators (🟢/🔴)
- Walking time estimate
- Google Maps link for navigation
- Recommended actions list
- Threat level for current location

---

## Slide 14: System Architecture
# System Architecture Overview

## Frontend (Next.js)
```
User Interface
    ↓
React Components
    ↓
API Routes (/api/*)
    ↓
HTTP Requests
```

## Backend (Node.js/Express)
```
API Endpoints
    ↓
Controllers (Validation & Processing)
    ↓
Gemini Client (AI Integration)
    ↓
Google Gemini 2.5 Flash API
```

## Data Flow
1. **User Input** → Frontend validation
2. **API Request** → Backend endpoint
3. **File Processing** → Multer upload handler
4. **AI Analysis** → Gemini Client with retry logic
5. **Response Parsing** → JSON normalization
6. **Result Display** → Frontend components

---

## Slide 15: AI Integration Details
# Gemini AI Integration

## GeminiClient Features:

### Multi-Key Rotation
- Supports multiple API keys for load balancing
- Automatic key rotation on rate limits
- Quota management and tracking

### Retry Logic
- Exponential backoff on failures
- Automatic retry with next available key
- Graceful error handling

### Specialized Prompts
- Each module has optimized prompt template
- Context-aware analysis instructions
- Structured JSON response requirements

### Response Parsing
- Extracts JSON from AI responses
- Normalizes field names across modules
- Handles malformed responses gracefully

## Error Handling:
- Rate limit detection (503, 429)
- Quota exceeded management
- Invalid key detection
- Service overload handling

---

## Slide 16: User Interface Features
# User Interface Components

## Main Features:

### 1. Chat Interface
- Real-time message display
- User/assistant message differentiation
- Loading states and animations
- Auto-scroll to latest message

### 2. File Upload Buttons
- Image upload with preview
- Video upload with player
- Audio recording/upload
- Text input area

### 3. Location Sharing
- One-click GPS location
- Permission handling
- Loading indicators

### 4. Emergency Quick Guide
- Always-visible safety tips
- Quick reference information
- Emergency contact access

### 5. Modal Overlays
- Safe route modal with map
- Threat result display
- Non-intrusive pop-ups

### 6. Threat Visualization
- Color-coded threat levels
- Emoji indicators (🟢🟡🟠🔴)
- Confidence scores
- Actionable recommendations

---

## Slide 17: Security & Safety Features
# Security & Safety Measures

## File Security:
- ✅ File type validation (whitelist approach)
- ✅ File size limits (10MB images/audio, 50MB video)
- ✅ MIME type verification
- ✅ Automatic file cleanup after processing
- ✅ Temporary storage only

## API Security:
- ✅ Environment variable API key management
- ✅ CORS protection
- ✅ Input sanitization
- ✅ Error message sanitization
- ✅ Rate limiting protection

## User Privacy:
- ✅ Location data used only for route analysis
- ✅ Files deleted immediately after processing
- ✅ No persistent storage of user data
- ✅ Secure HTTPS communication

## Error Handling:
- ✅ Graceful degradation
- ✅ User-friendly error messages
- ✅ Retry mechanisms
- ✅ Service availability checks

---

## Slide 18: Use Case Scenarios
# Real-World Use Cases

## Scenario 1: Late Night Commute
- **Input**: Image of dark street user needs to walk through
- **Analysis**: Image analysis detects poor lighting, isolation
- **Output**: High threat level, recommends alternative route
- **Action**: User uses location feature to find safe path

## Scenario 2: Suspicious Following
- **Input**: Text description of being followed
- **Analysis**: Text analysis detects high danger probability
- **Output**: Critical threat level, urgent actions
- **Action**: User shares location, gets route to police station

## Scenario 3: Distress Audio
- **Input**: Audio recording of concerning sounds
- **Analysis**: Audio analysis detects distress, threats, violence
- **Output**: Critical threat level, immediate help needed
- **Action**: System recommends calling emergency services

## Scenario 4: Video Evidence
- **Input**: Video of suspicious behavior
- **Analysis**: Video analysis tracks following pattern
- **Output**: High threat with movement analysis
- **Action**: User gets safe route and evidence documentation

---

## Slide 19: Technical Highlights
# Technical Implementation Highlights

## Frontend:
- **Next.js App Router**: Modern React framework
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling
- **Zustand**: Lightweight state management
- **Responsive Design**: Mobile-first approach

## Backend:
- **Express.js**: RESTful API architecture
- **Multer**: Efficient file upload handling
- **Error Middleware**: Centralized error handling
- **CORS Configuration**: Secure cross-origin requests

## AI Integration:
- **Gemini 2.5 Flash**: Latest multimodal AI model
- **Base64 Encoding**: Efficient media transmission
- **JSON Parsing**: Robust response extraction
- **Prompt Engineering**: Optimized for safety analysis

## Deployment:
- **Cloud-Ready**: Designed for Railway, Vercel, etc.
- **Environment Variables**: Secure configuration
- **Health Checks**: System monitoring endpoints
- **Scalable Architecture**: Stateless design

---

## Slide 20: Module Comparison
# Module Comparison Matrix

| Feature | Text | Image | Video | Audio | Location |
|---------|------|-------|-------|-------|----------|
| **Input Type** | String | File | File | File | GPS |
| **Max Size** | 10K chars | 10MB | 50MB | 10MB | N/A |
| **AI Model** | Gemini 2.5 | Gemini 2.5 | Gemini 2.5 | Gemini 2.5 | Gemini 2.5 |
| **Analysis Focus** | Language | Visual | Temporal | Acoustic | Spatial |
| **Threat Detection** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Real-time** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Context Aware** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Actionable Output** | ✅ | ✅ | ✅ | ✅ | ✅ |

**All modules provide:**
- Threat level assessment
- Detected risks
- Recommended actions
- Confidence scores
- Detailed explanations

---

## Slide 21: Response Format Standardization
# Unified Response Format

## Common Fields (All Modules):
```json
{
  "threat_level": "low|medium|high|critical",
  "detected_risks": ["risk1", "risk2"],
  "recommended_actions": ["action1", "action2"],
  "confidence": 0.0-1.0,
  "extra_info": {}
}
```

## Module-Specific Fields:

### Text:
- `emotional_cues`
- `danger_probability`
- `urgent_help_needed`

### Image:
- `detected_objects`
- `explanation`

### Video:
- `hazards_seen`
- `people_detected`
- `movement_patterns`
- `summary`

### Audio:
- `sound_events`
- `risk_reasoning`

### Location:
- `route_description`
- `route_steps`
- `safe_areas`
- `unsafe_areas`
- `route_link`

---

## Slide 22: Error Handling & Resilience
# Error Handling Strategy

## Rate Limit Management:
```
Request → Check Available Keys → 
Try Key 1 → Rate Limited? → 
Try Key 2 → Rate Limited? → 
Try Key 3 → All Exhausted? → 
Return Graceful Error
```

## Error Types Handled:
1. **503 Overload**: Temporary, retry after 5 minutes
2. **429 Quota**: Daily limit, skip for 24 hours
3. **400 Invalid Key**: Mark key as invalid
4. **Network Errors**: Retry with exponential backoff
5. **File Errors**: Validation and cleanup

## User Experience:
- Clear error messages
- Retry suggestions
- Service status indicators
- Graceful degradation

---

## Slide 23: Future Enhancements
# Potential Future Features

## Planned Improvements:
- 🔄 **Real-time Video Streaming**: Live camera feed analysis
- 📊 **Historical Data**: Location safety score database
- 🚨 **Emergency Integration**: Direct API connection to 911/112
- 🌍 **Multi-language**: Support for multiple languages
- 📱 **Mobile App**: Native iOS/Android applications
- 🔔 **Push Notifications**: Alerts for high-threat situations
- 👥 **Community Data**: User-reported safety information
- 🗺️ **Offline Mode**: Cached safety data for offline use
- 📈 **Analytics Dashboard**: Safety trend visualization
- 🤝 **Social Features**: Share safe routes with contacts

---

## Slide 24: Key Takeaways
# Key Takeaways

## What Makes This Project Unique:

1. **Multi-Modal Analysis**: First safety app with comprehensive text, image, video, audio, and location analysis

2. **AI-Powered Intelligence**: Uses cutting-edge Gemini 2.5 Flash for accurate threat detection

3. **Real-Time Processing**: Instant analysis and recommendations when seconds matter

4. **User-Centric Design**: Intuitive interface designed for emergency situations

5. **Robust Architecture**: Production-ready with error handling, security, and scalability

6. **Practical Application**: Solves real-world safety concerns with actionable solutions

## Impact:
- Empowers users with AI-driven safety insights
- Provides immediate threat assessment
- Offers practical safety recommendations
- Enhances personal safety awareness

---

## Slide 25: Demo Flow
# Complete Demo Flow

## Step-by-Step Demonstration:

1. **Homepage**: Show main interface with chat and action buttons
2. **Text Analysis**: Type safety concern → Show analysis result
3. **Image Analysis**: Upload image → Show visual threat assessment
4. **Video Analysis**: Upload video → Show temporal analysis
5. **Audio Analysis**: Record audio → Show acoustic threat detection
6. **Location Sharing**: Click location → Show safe route modal
7. **Chat Interaction**: Demonstrate conversational AI
8. **Emergency Guide**: Show quick reference panel

## Live Demo Highlights:
- Real-time AI processing
- Instant threat level updates
- Interactive route visualization
- Multi-modal input handling

---

## Slide 26: Conclusion
# AI Personal Safety Guardian

## Summary:

✅ **Five Analysis Modules**: Text, Image, Video, Audio, Location  
✅ **AI-Powered**: Google Gemini 2.5 Flash integration  
✅ **Real-Time**: Instant threat assessment and recommendations  
✅ **User-Friendly**: Intuitive interface for emergency use  
✅ **Production-Ready**: Robust error handling and security  

## Mission:
**Empower users with AI-driven safety insights to make informed decisions in potentially dangerous situations.**

---

## Slide 27: Questions & Discussion
# Questions & Discussion

## Thank You!

**Project Repository**: Available on GitHub  
**Documentation**: Complete setup and deployment guides  
**Live Demo**: [Deployment URL]  

### Contact & Support:
- Technical documentation in repository
- Setup guides for local development
- Deployment instructions for cloud platforms

---

## Slide 28: Appendix - Code Architecture
# Code Structure Overview

```
AI-Personal-Safety-Guardian/
├── Frontend/
│   ├── app/
│   │   ├── api/          # Next.js API routes
│   │   ├── mode/          # Analysis mode pages
│   │   └── page.tsx       # Main homepage
│   ├── components/        # React components
│   │   ├── TextInput.tsx
│   │   ├── FileUploader.tsx
│   │   ├── AudioRecorder.tsx
│   │   ├── VideoUploader.tsx
│   │   ├── SafeRouteModal.tsx
│   │   └── ThreatResult.tsx
│   └── lib/
│       ├── api.ts         # API client functions
│       └── store.ts       # State management
│
└── backend/
    ├── controllers/       # Business logic
    │   ├── textController.js
    │   ├── imageController.js
    │   ├── videoController.js
    │   ├── audioController.js
    │   └── safeRouteController.js
    ├── routes/            # Express routes
    ├── utils/
    │   └── geminiClient.js  # AI integration
    └── server.js          # Express server
```

---

## Slide 29: Appendix - API Endpoints
# API Endpoints Reference

## Analysis Endpoints:
- `POST /api/analyze-text` - Text threat analysis
- `POST /api/analyze-image` - Image threat analysis  
- `POST /api/analyze-video` - Video threat analysis
- `POST /api/analyze-audio` - Audio threat analysis
- `POST /api/safe-route` - Location-based route guidance

## Utility Endpoints:
- `POST /api/chat` - Conversational AI interface
- `GET /api/health` - System health check
- `GET /api/test-keys` - API key validation

## Request/Response Format:
- All endpoints accept JSON (except file uploads)
- Consistent error response format
- Standardized threat assessment output

---

## Slide 30: Final Slide
# Thank You!

## AI Personal Safety Guardian
### Multi-Modal AI-Powered Safety Analysis

**Questions?**  
**Ready to explore the codebase!**

---

*End of Presentation*



