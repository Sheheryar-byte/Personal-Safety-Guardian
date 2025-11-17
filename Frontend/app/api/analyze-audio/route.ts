import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';

interface AnalyzeAudioResponse {
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  sound_events: string[];
  risk_reasoning: string;
  actions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload MP3, WAV, WEBM, OGG, or M4A' },
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
      
      // Determine file extension and ensure filename has proper extension
      let fileExtension = '.webm';
      let finalFilename = file.name || 'audio.webm';
      
      // Map mime type to extension for validation
      const mimeToExt: { [key: string]: string } = {
        'audio/mpeg': '.mp3',
        'audio/mp3': '.mp3',
        'audio/wav': '.wav',
        'audio/webm': '.webm',
        'audio/ogg': '.ogg',
        'audio/m4a': '.m4a',
      };
      
      // Get extension from filename if available
      if (file.name) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext && ['mp3', 'wav', 'webm', 'ogg', 'm4a'].includes(ext)) {
          fileExtension = '.' + ext;
          finalFilename = file.name;
        } else {
          // Filename doesn't have valid extension, add one based on mime type
          fileExtension = mimeToExt[file.type] || '.webm';
          finalFilename = file.name.replace(/\.[^/.]+$/, '') + fileExtension;
        }
      } else {
        // No filename, use mime type to determine extension
        fileExtension = mimeToExt[file.type] || '.webm';
        finalFilename = `audio${fileExtension}`;
      }
      
      // Ensure mimetype matches what backend expects
      let finalMimeType = file.type || 'audio/webm';
      // Normalize some common mimetype variations
      if (finalMimeType === 'audio/mp3') finalMimeType = 'audio/mpeg';
      
      // Use form-data package for proper multipart/form-data encoding
      const backendFormData = new FormData();
      backendFormData.append('audio', buffer, {
        filename: finalFilename,
        contentType: finalMimeType,
      });
      
      console.log('Sending audio file:', { filename: finalFilename, contentType: finalMimeType, size: buffer.length });

      // Use axios for better form-data handling
      const backendResponse = await axios.post(`${backendUrl}/api/analyze-audio`, backendFormData, {
        headers: {
          ...backendFormData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const backendData = backendResponse.data;

      // Transform backend response to frontend format
      const analysis: AnalyzeAudioResponse = {
        threat_level: (backendData.threat_level || 'medium').toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        sound_events: Array.isArray(backendData.sound_events) ? backendData.sound_events : [],
        risk_reasoning: backendData.risk_reasoning || '',
        actions: Array.isArray(backendData.actions) ? backendData.actions : (Array.isArray(backendData.recommended_actions) ? backendData.recommended_actions : [])
      };

      return NextResponse.json(analysis);
    } catch (error: any) {
      console.error('Backend API error:', error);
      console.error('Backend error response data:', error.response?.data);
      const errorMessage = error.response?.data?.extra_info?.error || 
                          error.response?.data?.detected_risks?.[0] || 
                          error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'An error occurred during analysis. Please try again.';
      return NextResponse.json(
        {
          error: 'Failed to analyze audio',
          threat_level: 'unknown' as const,
          sound_events: ['Analysis error'],
          risk_reasoning: errorMessage,
          actions: ['Please try again']
        },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error) {
    console.error('Audio analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        threat_level: 'unknown',
        sound_events: [],
        risk_reasoning: 'An error occurred during analysis',
        actions: ['Please try again']
      },
      { status: 500 }
    );
  }
}

