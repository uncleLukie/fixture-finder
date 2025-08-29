import type { SportEvent } from '../types/sports';

const WORKER_URL = 'https://ff-worker.luke-076.workers.dev';

// A function to get today's date in the required YYYY-MM-DD format
const getTodaysDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

// A function to get a future date (for upcoming fixtures)
const getFutureDate = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
};

export const fetchAllFixturesByDay = async (date: string = getTodaysDate()): Promise<SportEvent[]> => {
  try {
    const response = await fetch(`${WORKER_URL}?day=${date}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // The API returns an object like { events: [...] } or { results: [...] }
    const data = await response.json();
    
    // TheSportsDB sometimes returns null if no events are found for that day
    return data.events || [];

  } catch (error) {
    console.error("Failed to fetch fixtures:", error);
    // Re-throw the error to be handled by the component
    throw error;
  }
};

// Function to fetch upcoming fixtures for the next N days
export const fetchUpcomingFixtures = async (days: number = 7): Promise<SportEvent[]> => {
  const allEvents: SportEvent[] = [];
  
  try {
    // Fetch events for the next N days
    for (let i = 0; i < days; i++) {
      const date = getFutureDate(i);
      const events = await fetchAllFixturesByDay(date);
      allEvents.push(...events);
    }
    
    return allEvents;
  } catch (error) {
    console.error("Failed to fetch upcoming fixtures:", error);
    throw error;
  }
};

// Function to fetch today's fixtures
export const fetchTodaysFixtures = async (): Promise<SportEvent[]> => {
  return fetchAllFixturesByDay(getTodaysDate());
};

// Helper function to group events by sport
export const groupEventsBySport = (events: SportEvent[]): Record<string, SportEvent[]> => {
  return events.reduce((acc, event) => {
    const sport = event.strSport;
    if (!acc[sport]) {
      acc[sport] = [];
    }
    acc[sport].push(event);
    return acc;
  }, {} as Record<string, SportEvent[]>);
};

// Helper function to get sport icon
export const getSportIcon = (sport: string): string => {
  const sportIcons: Record<string, string> = {
    'Soccer': '⚽',
    'Basketball': '🏀',
    'Baseball': '⚾',
    'American Football': '🏈',
    'Motorsport': '🏎️',
    'Ice Hockey': '🏒',
    'Rugby': '🏉',
    'Volleyball': '🏐',
    'Handball': '🤾',
    'Fighting': '🥊',
    'Cricket': '🏏',
    'Cycling': '🚴',
    'Tennis': '🎾',
    'Golf': '⛳',
    'Boxing': '🥊',
    'MMA': '🥊',
    'Formula 1': '🏎️',
    'MotoGP': '🏍️',
    'NFL': '🏈',
    'NBA': '🏀',
    'MLB': '⚾',
    'NHL': '🏒'
  };
  
  return sportIcons[sport] || '🏆';
};
