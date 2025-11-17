const geminiClient = require('../utils/geminiClient');

const normalizeArray = (value, fallback = []) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return fallback;
};

const pickFirstPopulatedArray = (...values) => {
  for (const value of values) {
    const arr = normalizeArray(value);
    if (arr.length > 0) {
      return arr;
    }
  }
  return [];
};

const analyzeRoute = async (req, res) => {
  try {
    const { currentLocation, destination, notes } = req.body || {};

    if (!currentLocation || typeof currentLocation !== 'object') {
      return res.status(400).json({
        error: 'Current location is required',
        threat_level: 'unknown',
        unsafe_areas: [],
        safe_areas: [],
        recommended_actions: ['Please share your current location again'],
      });
    }

    const { lat, lng } = currentLocation;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({
        error: 'Invalid location coordinates',
        threat_level: 'unknown',
        unsafe_areas: [],
        safe_areas: [],
        recommended_actions: ['Please try sharing your location again'],
      });
    }

    const destinationText =
      typeof destination === 'string' ? destination.trim() : '';
    const notesText = typeof notes === 'string' ? notes.trim() : '';

    // Call Gemini through the dedicated safe-route helper
    const aiResponse = await geminiClient.suggestSafeRoute(
      { lat, lng },
      destinationText,
      notesText
    );

    const threatLevel = (aiResponse.threat_level || 'medium').toLowerCase();
    const safeAreas = pickFirstPopulatedArray(
      aiResponse.safe_areas,
      aiResponse.recommended_safe_zones
    );
    const unsafeAreas = pickFirstPopulatedArray(
      aiResponse.unsafe_areas,
      aiResponse.danger_zones
    );
    const cautionAreas = pickFirstPopulatedArray(
      aiResponse.caution_areas,
      aiResponse.warning_zones
    );
    const recommendedActionsCandidate = pickFirstPopulatedArray(
      aiResponse.recommended_actions,
      aiResponse.actions
    );
    const recommendedActions =
      recommendedActionsCandidate.length > 0
        ? recommendedActionsCandidate
        : [
            'Move toward a well-lit public area immediately',
            'Avoid secluded alleys or side streets',
            'Share your live location with a trusted contact',
          ];
    const routeSteps = normalizeArray(aiResponse.route_steps);

    const routeDescription =
      aiResponse.route_description ||
      aiResponse.explanation ||
      (routeSteps.length > 0
        ? routeSteps.join(' ')
        : 'Move toward the nearest well-lit public location or staffed building.');

    const safeDestination =
      aiResponse.safe_destination ||
      destinationText ||
      'nearest well-lit public building or police station';

    let routeLink =
      typeof aiResponse.route_link === 'string' && aiResponse.route_link.trim()
        ? aiResponse.route_link.trim()
        : '';

    if (!routeLink) {
      const searchQuery = encodeURIComponent(
        `${safeDestination} near ${lat},${lng}`
      );
      routeLink = `https://www.google.com/maps/search/${searchQuery}/@${lat},${lng},16z`;
    }

    return res.json({
      route_link: routeLink,
      route_description: routeDescription,
      unsafe_areas: unsafeAreas,
      safe_areas: safeAreas,
      caution_areas: cautionAreas.length > 0 ? cautionAreas : undefined,
      recommended_actions: recommendedActions,
      threat_level: threatLevel,
      route_steps: routeSteps.length > 0 ? routeSteps : undefined,
      safe_destination: safeDestination,
      safe_destination_type: aiResponse.safe_destination_type,
      safe_destination_coordinates: aiResponse.safe_destination_coordinates,
      estimated_walk_time_minutes:
        typeof aiResponse.estimated_walk_time_minutes === 'number'
          ? aiResponse.estimated_walk_time_minutes
          : undefined,
      reasoning: aiResponse.reasoning,
      source: 'gemini',
    });
  } catch (error) {
    console.error('Route analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze route',
      threat_level: 'unknown',
      unsafe_areas: [],
      safe_areas: [],
      recommended_actions: ['Please try again'],
    });
  }
};

module.exports = {
  analyzeRoute
};

