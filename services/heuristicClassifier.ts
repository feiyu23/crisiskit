import { UrgencyLevel } from '../types';

/**
 * Fallback heuristic urgency classifier
 * Used when AI classification fails or is unavailable
 */

const CRITICAL_KEYWORDS = [
  'fire', 'burning', 'flame', 'smoke',
  'trapped', 'stuck', 'cannot escape', 'cannot move',
  'injury', 'injured', 'bleeding', 'broken', 'hurt',
  'medical', 'emergency', 'ambulance', 'doctor', 'hospital',
  'life-threatening', 'dying', 'death',
  'flood', 'water rising', 'drowning',
  'earthquake', 'collapsed', 'collapse',
  'help now', 'immediate', 'urgent', 'asap', 'critical',
  'baby', 'child', 'elderly', 'disabled', 'pregnant'
];

const MODERATE_KEYWORDS = [
  'food', 'water', 'hungry', 'thirsty',
  'shelter', 'homeless', 'nowhere to go',
  'cold', 'freezing', 'hot',
  'medication', 'medicine', 'prescription',
  'power out', 'no electricity', 'blackout',
  'need help', 'assistance needed',
  'stranded', 'lost', 'separated'
];

const LOW_KEYWORDS = [
  'information', 'info', 'question', 'asking',
  'update', 'status', 'news',
  'supplies', 'donation', 'volunteer',
  'later', 'non-urgent', 'when possible'
];

export function classifyUrgencyHeuristic(needs: string, location: string): {
  urgency: UrgencyLevel;
  reasoning: string;
} {
  const text = `${needs} ${location}`.toLowerCase();

  // Check for critical keywords
  const criticalMatches = CRITICAL_KEYWORDS.filter(keyword =>
    text.includes(keyword.toLowerCase())
  );

  if (criticalMatches.length > 0) {
    return {
      urgency: 'CRITICAL',
      reasoning: `Keywords: ${criticalMatches.slice(0, 2).join(', ')}`
    };
  }

  // Check for moderate keywords
  const moderateMatches = MODERATE_KEYWORDS.filter(keyword =>
    text.includes(keyword.toLowerCase())
  );

  if (moderateMatches.length > 0) {
    return {
      urgency: 'MODERATE',
      reasoning: `Keywords: ${moderateMatches.slice(0, 2).join(', ')}`
    };
  }

  // Check for low priority keywords
  const lowMatches = LOW_KEYWORDS.filter(keyword =>
    text.includes(keyword.toLowerCase())
  );

  if (lowMatches.length > 0) {
    return {
      urgency: 'LOW',
      reasoning: `Keywords: ${lowMatches.slice(0, 2).join(', ')}`
    };
  }

  // Default to MODERATE if unclear
  return {
    urgency: 'MODERATE',
    reasoning: 'No clear urgency indicators'
  };
}
