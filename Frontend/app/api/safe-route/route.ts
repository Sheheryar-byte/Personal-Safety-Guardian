import { NextRequest, NextResponse } from 'next/server';

interface SafeRouteResponse {
  route_link: string;
  route_description: string;
  unsafe_areas: string[];
  safe_areas: string[];
  caution_areas?: string[];
  recommended_actions: string[];
  threat_level: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  route_steps?: string[];
  safe_destination?: string;
  safe_destination_type?: string;
  estimated_walk_time_minutes?: number;
}

const normalizeArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && item.trim());
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return [];
};

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request format. Please try again.' },
        { status: 400 }
      );
    }

    const { currentLocation, destination, notes } = body || {};

    if (!currentLocation || typeof currentLocation !== 'object') {
      return NextResponse.json(
        { error: 'Current location is required' },
        { status: 400 }
      );
    }

    const { lat, lng } = currentLocation;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json(
        { error: 'Invalid location coordinates. Please provide valid latitude and longitude.' },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Location coordinates are out of valid range.' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    try {
      const backendResponse = await fetch(`${backendUrl}/api/safe-route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentLocation: { lat, lng },
          destination:
            typeof destination === 'string' && destination.trim().length > 0
              ? destination.trim()
              : undefined,
          notes:
            typeof notes === 'string' && notes.trim().length > 0
              ? notes.trim()
              : undefined,
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze safe route');
      }

      const backendData = await backendResponse.json();

      const unsafeAreas = normalizeArray(backendData.unsafe_areas);
      const safeAreas = normalizeArray(backendData.safe_areas);
      const cautionAreas = normalizeArray(backendData.caution_areas);
      const recommendedActions = normalizeArray(backendData.recommended_actions);
      const routeSteps = normalizeArray(backendData.route_steps);

      const safeRoute: SafeRouteResponse = {
        route_link: backendData.route_link || '',
        route_description:
          backendData.route_description ||
          backendData.explanation ||
          'Safest route guidance unavailable. Please head toward the nearest well-lit public building.',
        unsafe_areas:
          unsafeAreas.length > 0 ? unsafeAreas : normalizeArray(backendData.danger_zones),
        safe_areas:
          safeAreas.length > 0 ? safeAreas : normalizeArray(backendData.recommended_safe_zones),
        caution_areas:
          cautionAreas.length > 0
            ? cautionAreas
            : (() => {
                const warnings = normalizeArray(backendData.warning_zones);
                return warnings.length > 0 ? warnings : undefined;
              })(),
        recommended_actions:
          recommendedActions.length > 0 ? recommendedActions : normalizeArray(backendData.actions),
        threat_level: (backendData.threat_level || 'medium').toLowerCase(),
        route_steps: routeSteps.length > 0 ? routeSteps : undefined,
        safe_destination: backendData.safe_destination,
        safe_destination_type: backendData.safe_destination_type,
        estimated_walk_time_minutes:
          typeof backendData.estimated_walk_time_minutes === 'number'
            ? backendData.estimated_walk_time_minutes
            : undefined,
      };

      return NextResponse.json(safeRoute);
    } catch (error: any) {
      console.error('Backend safe route error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to analyze safe route',
          route_link: '',
          route_description: 'Unable to analyze route at this time',
          unsafe_areas: [],
          safe_areas: [],
          caution_areas: [],
          recommended_actions: ['Please try again'],
          threat_level: 'unknown',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Route analysis error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        route_link: '',
        route_description: 'Unable to analyze route at this time',
        unsafe_areas: [],
        safe_areas: [],
        caution_areas: [],
        recommended_actions: ['Please try again'],
        threat_level: 'unknown',
      },
      { status: 500 }
    );
  }
}
