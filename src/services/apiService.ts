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

// Function to fetch all upcoming events from the new lazy worker
export const fetchAllUpcomingEvents = async (): Promise<SportEvent[]> => {
  try {
    const response = await fetch(`${WORKER_URL}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.events || [];
  } catch (error) {
    console.error("Failed to fetch all upcoming events:", error);
    console.log("Falling back to mock data for demonstration...");
    
    // Return mock data as fallback when worker is not available
    return generateMockData();
  }
};

// Generate mock data for demonstration when worker is not available
function generateMockData(): SportEvent[] {
  const mockEvents: SportEvent[] = [];
  
  // Define Australian football focused sports data (accurate as of September 2025)
  const sportsData = [
    {
      sport: 'Australian Football',
      leagues: ['AFL', 'AFL Finals'],
      teams: [
        ['Collingwood Magpies', 'Carlton Blues'],
        ['Essendon Bombers', 'Richmond Tigers'],
        ['Geelong Cats', 'Hawthorn Hawks'],
        ['Sydney Swans', 'GWS Giants'],
        ['Adelaide Crows', 'Port Adelaide Power'],
        ['West Coast Eagles', 'Fremantle Dockers'],
        ['Brisbane Lions', 'Gold Coast Suns'],
        ['Melbourne Demons', 'Western Bulldogs']
      ],
      venues: ['MCG', 'Marvel Stadium', 'Adelaide Oval', 'Optus Stadium', 'Gabba', 'Metricon Stadium', 'GMHBA Stadium', 'University of Tasmania Stadium'],
      countries: ['Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia']
    },
    {
      sport: 'Rugby League',
      leagues: ['NRL', 'NRL Finals'],
      teams: [
        ['Sydney Roosters', 'Melbourne Storm'],
        ['Brisbane Broncos', 'Penrith Panthers'],
        ['Parramatta Eels', 'Cronulla Sharks'],
        ['Manly Sea Eagles', 'South Sydney Rabbitohs'],
        ['Newcastle Knights', 'Canberra Raiders'],
        ['North Queensland Cowboys', 'Gold Coast Titans'],
        ['St George Illawarra Dragons', 'Wests Tigers'],
        ['Canterbury Bulldogs', 'New Zealand Warriors']
      ],
      venues: ['Allianz Stadium', 'AAMI Park', 'Suncorp Stadium', 'Penrith Stadium', 'McDonald Jones Stadium', 'Queensland Country Bank Stadium', 'Netstrata Jubilee Stadium', 'ANZ Stadium'],
      countries: ['Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia']
    },
    {
      sport: 'Rugby Union',
      leagues: ['Rugby Championship', 'Super Rugby Pacific'],
      teams: [
        ['New Zealand All Blacks', 'South Africa Springboks'],
        ['Australia Wallabies', 'Argentina Pumas'],
        ['Crusaders', 'Blues'],
        ['Hurricanes', 'Chiefs'],
        ['Highlanders', 'Moana Pasifika'],
        ['Brumbies', 'Reds'],
        ['Waratahs', 'Force'],
        ['Rebels', 'Fijian Drua']
      ],
      venues: ['Eden Park', 'Ellis Park', 'Suncorp Stadium', 'Estadio José Amalfitani', 'Orangetheory Stadium', 'Eden Park', 'Forsyth Barr Stadium', 'Apia Park'],
      countries: ['New Zealand', 'South Africa', 'Australia', 'Argentina', 'New Zealand', 'New Zealand', 'New Zealand', 'Samoa']
    }
  ];
  
  for (let i = 0; i < 40; i++) {
    const sportData = sportsData[i % sportsData.length];
    const league = sportData.leagues[i % sportData.leagues.length];
    const teams = sportData.teams[i % sportData.teams.length];
    const venue = sportData.venues[i % sportData.venues.length];
    const country = sportData.countries[i % sportData.countries.length];
    
    // Generate realistic dates for September 2025 (AFL Finals, Rugby Championship)
    let randomDays;
    if (sportData.sport === 'Australian Football') {
      // AFL Finals: Sep 5-7 (qualifying), Sep 12-13 (semis), Sep 19-20 (prelims), Sep 27 (Grand Final)
      const aflFinalsDates = [5, 6, 7, 12, 13, 19, 20, 27];
      randomDays = aflFinalsDates[i % aflFinalsDates.length];
    } else if (sportData.sport === 'Rugby Union') {
      // Rugby Championship: Sep 6, 13, 20, 27
      const rugbyDates = [6, 13, 20, 27];
      randomDays = rugbyDates[i % rugbyDates.length];
    } else {
      // NRL Finals: Sep 5-7, 12-13, 19-20, 26-27
      const nrlDates = [5, 6, 7, 12, 13, 19, 20, 26, 27];
      randomDays = nrlDates[i % nrlDates.length];
    }
    
    const eventDate = new Date(2025, 8, randomDays); // September 2025
    const dateStr = eventDate.toISOString().slice(0, 10);
    
    // Generate realistic kick-off times for Australian sports
    let hours, minutes;
    if (sportData.sport === 'Australian Football') {
      // AFL: typically 7:20 PM, 7:50 PM, 3:20 PM for finals
      const aflTimes = [19, 20, 15]; // 7 PM, 8 PM, 3 PM
      hours = aflTimes[i % aflTimes.length];
      minutes = 20;
    } else if (sportData.sport === 'Rugby League') {
      // NRL: typically 7:35 PM, 7:50 PM, 3:00 PM
      const nrlTimes = [19, 20, 15]; // 7 PM, 8 PM, 3 PM
      hours = nrlTimes[i % nrlTimes.length];
      minutes = 35;
    } else {
      // Rugby Union: typically 7:30 PM, 8:00 PM
      const rugbyTimes = [19, 20]; // 7 PM, 8 PM
      hours = rugbyTimes[i % rugbyTimes.length];
      minutes = 30;
    }
    
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    
    const mockEvent: SportEvent = {
      idEvent: `mock_${sportData.sport.toLowerCase()}_${i}`,
      strEvent: `${teams[0]} vs ${teams[1]}`,
      strSport: sportData.sport,
      strLeague: league,
      strHomeTeam: teams[0],
      strAwayTeam: teams[1],
      dateEvent: dateStr,
      strTime: timeStr,
      strStatus: 'NS', // Not Started
      strVenue: venue,
      strCountry: country,
      intHomeScore: null,
      intAwayScore: null,
      strThumb: null,
      strCity: '',
      strRound: '',
      strSeason: '2025',
      strDescription: '',
      strFilename: '',
      strPoster: undefined,
      strFanart: undefined,
      strBanner: undefined,
      strLogo: undefined,
      strTrophy: undefined,
      strMap: undefined,
      strLocked: 'unlocked'
    };
    
    mockEvents.push(mockEvent);
  }
  
  return mockEvents;
}

// Function to fetch diverse sports data for better variety (now uses the lazy worker)
export const fetchDiverseSportsData = async (_variety: 'default' | 'max' = 'default'): Promise<SportEvent[]> => {
  return fetchAllUpcomingEvents();
};

// Function to fetch maximum variety data (30 days)
export const fetchMaximumVarietyData = async (): Promise<SportEvent[]> => {
  return fetchDiverseSportsData('max');
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

// Helper function to get sport icon - Australian focus
export const getSportIcon = (sport: string): string => {
  const sportIcons: Record<string, string> = {
    // Australian Football Codes
    'Australian Football': '🏈',
    'Rugby Union': '🏉',
    'Rugby League': '🏉',
    'AFL': '🏈',
    'NRL': '🏉',
    'Super Rugby': '🏉',
    'Super Rugby Pacific': '🏉',
    
    // Major Australian Leagues
    'AFL Finals': '🏈',
    'NRL Finals': '🏉',
    'Rugby Championship': '🏉',
    'State of Origin': '🏉',
    
    // Australian Teams & Competitions
    'Wallabies': '🏉',
    'Kangaroos': '🏉',
    'Queensland Maroons': '🏉',
    'New South Wales Blues': '🏉',
    
    // Fallback Sports
    'Soccer': '⚽',
    'Football': '⚽',
    'Basketball': '🏀',
    'Cricket': '🏏',
    'Tennis': '🎾',
    'Golf': '⛳',
    'Boxing': '🥊',
    'MMA': '🥊',
    'Formula 1': '🏎️',
    'Athletics': '🏃',
    'Swimming': '🏊',
    'Cycling': '🚴',
    'Surfing': '🏄',
    'Skateboarding': '🛹',
    'Climbing': '🧗',
    'Archery': '🏹',
    'Shooting': '🎯',
    'Weightlifting': '🏋️'
  };
  
  return sportIcons[sport] || '🏈';
};
