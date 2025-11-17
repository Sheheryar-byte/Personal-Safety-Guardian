import { NextRequest, NextResponse } from 'next/server';

interface AnalyzeTextResponse {
  threat_level?: 'low' | 'medium' | 'high' | 'critical';
  explanation?: string;
  recommended_actions?: string[];
  emotional_cues?: string[];
  danger_probability?: number;
  suggestions?: string[];
  urgent_help_needed?: boolean;
  detected_risks?: string[];
  confidence_score?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is empty' },
        { status: 400 }
      );
    }

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    // Forward the request to the backend
    try {
      const backendResponse = await fetch(`${backendUrl}/api/text-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message.trim() }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Backend request failed');
      }

      const backendData = await backendResponse.json();

      // Transform backend response to frontend format
      const analysis: AnalyzeTextResponse = {
        threat_level: (backendData.threat_level || 'medium').toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        explanation: backendData.explanation || '',
        recommended_actions: Array.isArray(backendData.recommended_actions) 
          ? backendData.recommended_actions 
          : (Array.isArray(backendData.suggestions) ? backendData.suggestions : []),
        emotional_cues: Array.isArray(backendData.emotional_cues) ? backendData.emotional_cues : [],
        danger_probability: typeof backendData.danger_probability === 'number' ? backendData.danger_probability : undefined,
        suggestions: Array.isArray(backendData.suggestions) ? backendData.suggestions : (Array.isArray(backendData.recommended_actions) ? backendData.recommended_actions : []),
        urgent_help_needed: typeof backendData.urgent_help_needed === 'boolean' ? backendData.urgent_help_needed : undefined,
        detected_risks: Array.isArray(backendData.detected_risks) && backendData.detected_risks.length > 0 ? backendData.detected_risks : undefined,
        confidence_score: typeof backendData.confidence_score === 'number' ? backendData.confidence_score : (typeof backendData.confidence === 'number' ? backendData.confidence : undefined)
      };

      return NextResponse.json(analysis);
    } catch (error: any) {
      console.error('Backend API error:', error);
      return NextResponse.json(
        {
          error: 'Failed to analyze text',
          threat_level: 'unknown' as const,
          explanation: error.message || 'An error occurred during analysis. Please try again.',
          recommended_actions: ['Please try again']
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('Text analysis API error:', err);
    return NextResponse.json(
      { error: 'Server error during text analysis' },
      { status: 500 }
    );
  }
}

