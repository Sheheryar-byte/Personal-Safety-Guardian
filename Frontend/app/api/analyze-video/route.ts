import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';

interface AnalyzeVideoResponse {
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  hazards_seen: string[];
  people_detected: string[];
  movement_patterns: string[];
  summary: string;
  actions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload MP4, MOV, AVI, or WEBM' },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // Validate video duration (5-10 seconds recommended)
    // Note: Actual duration check would require video processing library

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    // Forward the request to the backend
    try {
      // Read file as array buffer and convert to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Use form-data package for proper multipart/form-data encoding
      const backendFormData = new FormData();
      backendFormData.append('video', buffer, {
        filename: file.name || 'video.mp4',
        contentType: file.type || 'video/mp4',
      });

      // Use axios for better form-data handling
      const backendResponse = await axios.post(`${backendUrl}/api/analyze-video`, backendFormData, {
        headers: {
          ...backendFormData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const backendData = backendResponse.data;

      // Transform backend response to frontend format
      const analysis: AnalyzeVideoResponse = {
        threat_level: (backendData.threat_level || 'medium').toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        hazards_seen: Array.isArray(backendData.hazards_seen) ? backendData.hazards_seen : [],
        people_detected: Array.isArray(backendData.people_detected) ? backendData.people_detected : [],
        movement_patterns: Array.isArray(backendData.movement_patterns) ? backendData.movement_patterns : [],
        summary: backendData.summary || '',
        actions: Array.isArray(backendData.actions) ? backendData.actions : (Array.isArray(backendData.recommended_actions) ? backendData.recommended_actions : [])
      };

      return NextResponse.json(analysis);
    } catch (error: any) {
      console.error('Backend API error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred during analysis. Please try again.';
      return NextResponse.json(
        {
          error: 'Failed to analyze video',
          threat_level: 'unknown' as const,
          hazards_seen: ['Analysis error'],
          people_detected: [],
          movement_patterns: [],
          summary: errorMessage,
          actions: ['Please try again']
        },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error) {
    console.error('Video analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        threat_level: 'unknown',
        hazards_seen: [],
        people_detected: [],
        movement_patterns: [],
        summary: 'An error occurred during analysis',
        actions: ['Please try again']
      },
      { status: 500 }
    );
  }
}

