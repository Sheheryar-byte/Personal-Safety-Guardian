const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Verify critical environment variables
console.log('🔍 Checking environment variables...');
console.log(`   PORT: ${process.env.PORT || '8080 (default)'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);

const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS;
if (geminiKey) {
  const keyCount = geminiKey.split(',').filter(k => k.trim().length > 0).length;
  console.log(`   GEMINI_API_KEY: Found (${keyCount} key(s))`);
  // Mask the keys for security
  const masked = geminiKey.length > 20 ? `${geminiKey.substring(0, 10)}...${geminiKey.substring(geminiKey.length - 10)}` : '***';
  console.log(`   GEMINI_API_KEY value: ${masked}`);
} else {
  console.error('   ❌ GEMINI_API_KEY: NOT SET! This will cause errors.');
}

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://ai-personal-safety-guardian.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - These will trigger GeminiClient initialization
console.log('📦 Loading routes (this will initialize GeminiClient)...');
const analyzeImageRoute = require('./routes/analyzeImage');
const analyzeVideoRoute = require('./routes/analyzeVideo');
const analyzeAudioRoute = require('./routes/analyzeAudio');
const textAnalysisRoute = require('./routes/textAnalysis');
const safeRouteRoute = require('./routes/safeRoute');
console.log('✅ Routes loaded');

app.use('/api/analyze-image', analyzeImageRoute);
app.use('/api/analyze-video', analyzeVideoRoute);
app.use('/api/analyze-audio', analyzeAudioRoute);
app.use('/api/text-analysis', textAnalysisRoute);
app.use('/api/safe-route', safeRouteRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS;
  const keyCount = geminiKey ? geminiKey.split(',').filter(k => k.trim().length > 0).length : 0;
  
  res.json({ 
    status: 'ok', 
    message: 'AI Personal Safety Guardian API is running',
    environment: {
      port: PORT,
      nodeEnv: process.env.NODE_ENV || 'development',
      geminiKeysConfigured: keyCount,
      geminiKeySet: !!geminiKey
    }
  });
});

// Test endpoint to verify API keys
app.get('/api/test-keys', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS;
    
    if (!geminiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY not set',
        keysFound: 0
      });
    }
    
    const keys = geminiKey.split(',').map(k => k.trim()).filter(k => k.length > 0);
    const results = [];
    
    for (let i = 0; i < Math.min(keys.length, 6); i++) {
      const key = keys[i];
      const masked = key.length > 10 ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : '***';
      
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent('Say "test"');
        const response = await result.response;
        const text = response.text();
        
        results.push({
          keyIndex: i + 1,
          keyMasked: masked,
          status: 'valid',
          testResponse: text.substring(0, 50)
        });
      } catch (error) {
        results.push({
          keyIndex: i + 1,
          keyMasked: masked,
          status: 'invalid',
          error: error.message?.substring(0, 100) || 'Unknown error',
          errorStatus: error.status
        });
      }
    }
    
    const validCount = results.filter(r => r.status === 'valid').length;
    
    res.json({
      totalKeys: keys.length,
      validKeys: validCount,
      invalidKeys: results.length - validCount,
      results: results
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    threat_level: 'unknown',
    detected_risks: ['Server error occurred'],
    recommended_actions: ['Please try again later'],
    confidence: 0,
    extra_info: { error: err.message }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    threat_level: 'unknown',
    detected_risks: ['Endpoint not found'],
    recommended_actions: ['Check the API endpoint'],
    confidence: 0,
    extra_info: {}
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

