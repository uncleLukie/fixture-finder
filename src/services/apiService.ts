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
  const today = new Date();
  
  // Define rugby and football focused sports data
  const sportsData = [
    {
      sport: 'American Football',
      leagues: ['NFL', 'NCAA Division I', 'CFL', 'XFL', 'USFL'],
      teams: [
        ['Kansas City Chiefs', 'Buffalo Bills'],
        ['San Francisco 49ers', 'Dallas Cowboys'],
        ['Philadelphia Eagles', 'Green Bay Packers'],
        ['Miami Dolphins', 'New England Patriots'],
        ['Alabama Crimson Tide', 'Georgia Bulldogs'],
        ['Michigan Wolverines', 'Ohio State Buckeyes'],
        ['Toronto Argonauts', 'Winnipeg Blue Bombers'],
        ['Calgary Stampeders', 'Edmonton Elks']
      ],
      venues: ['Arrowhead Stadium', 'Highmark Stadium', 'Levi\'s Stadium', 'AT&T Stadium', 'Lincoln Financial Field', 'Lambeau Field', 'Hard Rock Stadium', 'Gillette Stadium'],
      countries: ['United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'Canada', 'Canada']
    },
    {
      sport: 'Rugby Union',
      leagues: ['Six Nations', 'Rugby Championship', 'Super Rugby', 'Heineken Champions Cup', 'Premiership Rugby', 'Top 14'],
      teams: [
        ['New Zealand All Blacks', 'South Africa Springboks'],
        ['England', 'France'],
        ['Australia Wallabies', 'Argentina Pumas'],
        ['Ireland', 'Wales'],
        ['Scotland', 'Italy'],
        ['Crusaders', 'Blues'],
        ['Leinster', 'Munster'],
        ['Toulouse', 'La Rochelle']
      ],
      venues: ['Eden Park', 'Ellis Park', 'Twickenham Stadium', 'Stade de France', 'Suncorp Stadium', 'Estadio José Amalfitani', 'Aviva Stadium', 'Principality Stadium'],
      countries: ['New Zealand', 'South Africa', 'United Kingdom', 'France', 'Australia', 'Argentina', 'Ireland', 'Wales']
    },
    {
      sport: 'Rugby League',
      leagues: ['NRL', 'Super League', 'State of Origin', 'Challenge Cup', 'World Cup'],
      teams: [
        ['Sydney Roosters', 'Melbourne Storm'],
        ['Brisbane Broncos', 'Penrith Panthers'],
        ['Leeds Rhinos', 'Wigan Warriors'],
        ['St Helens', 'Warrington Wolves'],
        ['Queensland Maroons', 'New South Wales Blues'],
        ['Australia Kangaroos', 'England Lions'],
        ['New Zealand Kiwis', 'Tonga'],
        ['Fiji', 'Samoa']
      ],
      venues: ['Allianz Stadium', 'AAMI Park', 'Suncorp Stadium', 'Penrith Stadium', 'Elland Road', 'DW Stadium', 'Totally Wicked Stadium', 'Halliwell Jones Stadium'],
      countries: ['Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'Australia', 'United Kingdom', 'United Kingdom']
    },
    {
      sport: 'Australian Football',
      leagues: ['AFL', 'AFLW', 'VFL', 'SANFL'],
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
      sport: 'College Football',
      leagues: ['SEC', 'Big Ten', 'ACC', 'Big 12', 'Pac-12', 'American Athletic'],
      teams: [
        ['Alabama Crimson Tide', 'Auburn Tigers'],
        ['Michigan Wolverines', 'Ohio State Buckeyes'],
        ['Clemson Tigers', 'Florida State Seminoles'],
        ['Oklahoma Sooners', 'Texas Longhorns'],
        ['USC Trojans', 'UCLA Bruins'],
        ['Georgia Bulldogs', 'Florida Gators'],
        ['LSU Tigers', 'Arkansas Razorbacks'],
        ['Penn State Nittany Lions', 'Michigan State Spartans']
      ],
      venues: ['Bryant-Denny Stadium', 'Jordan-Hare Stadium', 'Michigan Stadium', 'Ohio Stadium', 'Memorial Stadium', 'Doak Campbell Stadium', 'Cotton Bowl', 'Rose Bowl'],
      countries: ['United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States', 'United States']
    }
  ];
  
  for (let i = 0; i < 50; i++) {
    const sportData = sportsData[i % sportsData.length];
    const league = sportData.leagues[i % sportData.leagues.length];
    const teams = sportData.teams[i % sportData.teams.length];
    const venue = sportData.venues[i % sportData.venues.length];
    const country = sportData.countries[i % sportData.countries.length];
    
    // Generate random date within next 30 days
    const randomDays = Math.floor(Math.random() * 30);
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + randomDays);
    const dateStr = eventDate.toISOString().slice(0, 10);
    
    // Generate random time
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
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

// Helper function to get sport icon
export const getSportIcon = (sport: string): string => {
  const sportIcons: Record<string, string> = {
    // Rugby & Football Sports
    'American Football': '🏈',
    'Rugby Union': '🏉',
    'Rugby League': '🏉',
    'Australian Football': '🏈',
    'College Football': '🏈',
    'Canadian Football': '🏈',
    
    // Major Leagues
    'NFL': '🏈',
    'NCAA': '🏈',
    'CFL': '🏈',
    'XFL': '🏈',
    'USFL': '🏈',
    'AFL': '🏈',
    'NRL': '🏉',
    'Super League': '🏉',
    'Super Rugby': '🏉',
    'Six Nations': '🏉',
    'Rugby Championship': '🏉',
    'Heineken Champions Cup': '🏉',
    'Premiership Rugby': '🏉',
    'Top 14': '🏉',
    'State of Origin': '🏉',
    'Challenge Cup': '🏉',
    'World Cup': '🏉',
    
    // College Conferences
    'SEC': '🏈',
    'Big Ten': '🏈',
    'ACC': '🏈',
    'Big 12': '🏈',
    'Pac-12': '🏈',
    'American Athletic': '🏈',
    'Mountain West': '🏈',
    'Conference USA': '🏈',
    'MAC': '🏈',
    'Sun Belt': '🏈',
    
    // Australian Football
    'AFLW': '🏈',
    'VFL': '🏈',
    'SANFL': '🏈',
    
    // Other Sports (fallback)
    'Soccer': '⚽',
    'Football': '⚽',
    'Basketball': '🏀',
    'Baseball': '⚾',
    'Ice Hockey': '🏒',
    'Cricket': '🏏',
    'Tennis': '🎾',
    'Golf': '⛳',
    'Volleyball': '🏐',
    'Handball': '🤾',
    'Boxing': '🥊',
    'MMA': '🥊',
    'Formula 1': '🏎️',
    'MotoGP': '🏍️',
    'Athletics': '🏃',
    'Swimming': '🏊',
    'Cycling': '🚴',
    'Skiing': '⛷️',
    'Snooker': '🎱',
    'Darts': '🎯',
    'Bowling': '🎳',
    'Curling': '🥌',
    'Lacrosse': '🥍',
    'Water Polo': '🤽',
    'Surfing': '🏄',
    'Skateboarding': '🛹',
    'Climbing': '🧗',
    'Archery': '🏹',
    'Shooting': '🎯',
    'Weightlifting': '🏋️'
  };
  
  return sportIcons[sport] || '🏈';
};
