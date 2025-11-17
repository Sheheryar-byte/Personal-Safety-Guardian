import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';

interface AnalyzeImageResponse {
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  detected_objects: string[];
  explanation: string;
  recommended_actions: string[];
  confidence_score: number;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const textNote = formData.get('textNote') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPG, PNG, GIF, or WEBP' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    // Forward the request to the backend
    try {
      // Read file as array buffer and convert to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Use form-data package for proper multipart/form-data encoding
      const backendFormData = new FormData();
      backendFormData.append('image', buffer, {
        filename: file.name || 'image.jpg',
        contentType: file.type || 'image/jpeg',
      });
      if (textNote) {
        backendFormData.append('textNote', textNote);
      }

      // Use axios for better form-data handling
      const backendResponse = await axios.post(`${backendUrl}/api/analyze-image`, backendFormData, {
        headers: {
          ...backendFormData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const backendData = backendResponse.data;

      // Transform backend response to frontend format
      const analysis: AnalyzeImageResponse = {
        threat_level: (backendData.threat_level || 'medium').toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        detected_objects: Array.isArray(backendData.detected_objects) ? backendData.detected_objects : [],
        explanation: backendData.explanation || '',
        recommended_actions: Array.isArray(backendData.recommended_actions) ? backendData.recommended_actions : [],
        confidence_score: typeof backendData.confidence_score === 'number' ? backendData.confidence_score : (typeof backendData.confidence === 'number' ? backendData.confidence : 0.75)
      };

      return NextResponse.json(analysis);
    } catch (error: any) {
      console.error('Backend API error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred during analysis. Please try again.';
      return NextResponse.json(
        {
          error: 'Failed to analyze image',
          threat_level: 'unknown' as const,
          detected_objects: ['Analysis error'],
          explanation: errorMessage,
          recommended_actions: ['Please try again'],
          confidence_score: 0
        },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        threat_level: 'unknown',
        detected_objects: [],
        explanation: 'An error occurred during analysis',
        recommended_actions: ['Please try again'],
        confidence_score: 0
      },
      { status: 500 }
    );
  }
}

