import { NextRequest, NextResponse } from 'next/server';

interface AnalyzeTextResponse {
  emotional_cues: string[];
  danger_probability: number;
  suggestions: string[];
  recommended_actions?: string[];
  urgent_help_needed: boolean;
  threat_level?: 'low' | 'medium' | 'high' | 'critical';
  detected_risks?: string[];
  explanation?: string;
  confidence_score?: number;
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { reply: 'Invalid request format. Please try again.' },
        { status: 400 }
      );
    }

    const inputText = body.inputText || body.text; // Support both for backward compatibility

    // Validate input
    if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
      return NextResponse.json(
        { reply: 'Please enter text for analysis.' },
        { status: 400 }
      );
    }

    // Handle text length limit (safely handle Unicode characters)
    const textLength = Array.from(inputText).length; // Properly count Unicode characters
    if (textLength > 10000) {
      return NextResponse.json(
        { reply: 'Text must be under 10,000 characters.' },
        { status: 400 }
      );
    }

    // Safely process text (handle special characters, emojis, quotes, etc.)
    const text = inputText.trim();

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    // Forward the request to the backend
    try {
      const backendResponse = await fetch(`${backendUrl}/api/text-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Backend request failed');
      }

      const backendData = await backendResponse.json();

      // Transform backend response to frontend format
      const analysis: AnalyzeTextResponse = {
        emotional_cues: Array.isArray(backendData.emotional_cues) ? backendData.emotional_cues : [],
        danger_probability: typeof backendData.danger_probability === 'number' ? backendData.danger_probability : 0.5,
        suggestions: Array.isArray(backendData.suggestions) ? backendData.suggestions : (Array.isArray(backendData.recommended_actions) ? backendData.recommended_actions : []),
        recommended_actions: Array.isArray(backendData.recommended_actions) ? backendData.recommended_actions : (Array.isArray(backendData.suggestions) ? backendData.suggestions : []),
        urgent_help_needed: typeof backendData.urgent_help_needed === 'boolean' ? backendData.urgent_help_needed : false,
        threat_level: (backendData.threat_level || 'medium').toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        detected_risks: Array.isArray(backendData.detected_risks) && backendData.detected_risks.length > 0 ? backendData.detected_risks : undefined,
        explanation: backendData.explanation || '',
        confidence_score: typeof backendData.confidence_score === 'number' ? backendData.confidence_score : (typeof backendData.confidence === 'number' ? backendData.confidence : 0.75)
      };

      return NextResponse.json(analysis);
    } catch (error: any) {
      console.error('Backend API error:', error);
      return NextResponse.json(
        {
          reply: 'Failed to analyze text',
          threat_level: 'unknown' as const,
          detected_risks: ['Analysis error'],
          explanation: error.message || 'An error occurred during analysis. Please try again.',
          recommended_actions: ['Please try again'],
          confidence_score: 0
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Text analysis error:', error);
    return NextResponse.json(
      { 
        reply: 'An error occurred. Please try again.',
        threat_level: 'unknown',
        detected_risks: [],
        explanation: 'An error occurred during analysis',
        recommended_actions: ['Please try again'],
        confidence_score: 0
      },
      { status: 500 }
    );
  }
}

