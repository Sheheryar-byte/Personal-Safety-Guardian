import { NextRequest, NextResponse } from 'next/server';

interface ChatResponse {
  response: string;
  threat_level?: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  detected_risks?: string[];
  recommended_actions?: string[];
  explanation?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    // Forward the request to the backend for analysis
    try {
      const backendResponse = await fetch(`${backendUrl}/api/text-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message.trim() }),
      });

      const backendData = await backendResponse.json();
      
      // Handle backend errors gracefully - still return a response to the user
      if (!backendResponse.ok) {
        const errorMessage = backendData.extra_info?.error || backendData.detected_risks?.[0] || 'Service temporarily unavailable';
        const isOverloaded = errorMessage.includes('overloaded') || errorMessage.includes('503');
        
        return NextResponse.json({
          response: isOverloaded 
            ? '⚠️ The AI service is currently experiencing high demand. Please try again in a few moments.'
            : `⚠️ ${errorMessage}. Please try again.`,
          threat_level: backendData.threat_level || 'unknown' as const,
          detected_risks: backendData.detected_risks || ['Service error'],
          recommended_actions: backendData.recommended_actions || ['Please try again in a moment'],
          explanation: errorMessage
        });
      }

      // Extract data from backend response (from Gemini API)
      const threatLevel = (backendData.threat_level || 'low').toLowerCase() as 'low' | 'medium' | 'high' | 'critical';
      const explanation = backendData.explanation || '';
      const detectedRisks = Array.isArray(backendData.detected_risks) ? backendData.detected_risks : [];
      const recommendedActions = Array.isArray(backendData.recommended_actions) 
        ? backendData.recommended_actions 
        : (Array.isArray(backendData.suggestions) ? backendData.suggestions : []);

      // Get threat emoji
      const getThreatEmoji = () => {
        switch (threatLevel) {
          case 'critical': return '🔴';
          case 'high': return '🟠';
          case 'medium': return '🟡';
          case 'low': return '🟢';
          default: return '⚪';
        }
      };

      // Use the actual Gemini explanation as the response text
      // Format it nicely with threat level emoji and the explanation
      let responseText = '';
      if (explanation) {
        // Use Gemini's explanation as the main response
        responseText = `${getThreatEmoji()} ${explanation}`;
        
        // If there are recommended actions, append them
        if (recommendedActions.length > 0) {
          responseText += `\n\nRecommended Actions:\n${recommendedActions.slice(0, 3).map((action: string) => `• ${action}`).join('\n')}`;
        }
      } else {
        // Fallback if no explanation provided
        responseText = `${getThreatEmoji()} Threat Level: ${threatLevel.toUpperCase()}\n\nAnalysis complete. Please review the detailed report.`;
      }

      const chatResponse: ChatResponse = {
        response: responseText,
        threat_level: threatLevel,
        detected_risks: detectedRisks.length > 0 ? detectedRisks : undefined,
        recommended_actions: recommendedActions,
        explanation: explanation || `Threat level: ${threatLevel}`
      };

      return NextResponse.json(chatResponse);
    } catch (error: any) {
      console.error('Backend API error:', error);
      // Return error response if backend fails
      return NextResponse.json(
        {
          error: 'Failed to analyze message',
          response: 'Sorry, I encountered an error analyzing your message. Please try again.',
          threat_level: 'unknown' as const,
          detected_risks: ['Analysis error'],
          recommended_actions: ['Please try again'],
          explanation: 'An error occurred during analysis'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response: 'Sorry, I encountered an error. Please try again.'
      },
      { status: 500 }
    );
  }
}
