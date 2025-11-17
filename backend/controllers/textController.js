const geminiClient = require('../utils/geminiClient');

const analyzeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        threat_level: 'unknown',
        detected_risks: ['No text provided'],
        recommended_actions: ['Please provide text to analyze'],
        confidence: 0,
        extra_info: {}
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({
        threat_level: 'unknown',
        detected_risks: ['Text too long'],
        recommended_actions: ['Please provide text under 10,000 characters'],
        confidence: 0,
        extra_info: {}
      });
    }

    const result = await geminiClient.analyzeText(text.trim());

    res.json(result);
  } catch (error) {
    console.error('Text analysis error:', error);
    const errorMessage = error.message || 'Unknown error';
    const isOverloaded = errorMessage.includes('overloaded') || errorMessage.includes('503');
    const isRateLimited = errorMessage.includes('rate limit') || errorMessage.includes('429');
    
    res.status(500).json({
      threat_level: 'unknown',
      detected_risks: isOverloaded 
        ? ['AI service is currently overloaded'] 
        : isRateLimited 
        ? ['API rate limit reached']
        : ['Analysis service temporarily unavailable'],
      recommended_actions: isOverloaded || isRateLimited
        ? ['Please wait a few moments and try again', 'The service should be available shortly']
        : ['Please try again in a moment'],
      confidence: 0,
      extra_info: { 
        error: errorMessage,
        retry_after: isOverloaded || isRateLimited ? '30-60 seconds' : undefined
      }
    });
  }
};

module.exports = {
  analyzeText
};

