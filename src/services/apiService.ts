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
  
  // Define diverse sports data
  const sportsData = [
    {
      sport: 'Tennis',
      leagues: ['Australian Open', 'Wimbledon', 'US Open', 'French Open', 'ATP Tour', 'WTA Tour'],
      teams: [
        ['Novak Djokovic', 'Carlos Alcaraz'],
        ['Rafael Nadal', 'Daniil Medvedev'],
        ['Iga Świątek', 'Aryna Sabalenka'],
        ['Coco Gauff', 'Elena Rybakina'],
        ['Jannik Sinner', 'Stefanos Tsitsipas'],
        ['Ons Jabeur', 'Markéta Vondroušová']
      ],
      venues: ['Rod Laver Arena', 'Centre Court', 'Arthur Ashe Stadium', 'Court Philippe-Chatrier', 'Indian Wells Tennis Garden'],
      countries: ['Australia', 'United Kingdom', 'United States', 'France', 'United States']
    },
    {
      sport: 'Cricket',
      leagues: ['ICC World Cup', 'IPL', 'Ashes Series', 'Big Bash League', 'Caribbean Premier League'],
      teams: [
        ['Australia', 'England'],
        ['India', 'Pakistan'],
        ['New Zealand', 'South Africa'],
        ['West Indies', 'Sri Lanka'],
        ['Bangladesh', 'Afghanistan'],
        ['Mumbai Indians', 'Chennai Super Kings']
      ],
      venues: ['Melbourne Cricket Ground', 'Lords Cricket Ground', 'Eden Gardens', 'Wankhede Stadium', 'The Gabba'],
      countries: ['Australia', 'United Kingdom', 'India', 'India', 'Australia']
    },
    {
      sport: 'Rugby Union',
      leagues: ['Six Nations', 'Rugby Championship', 'Super Rugby', 'Heineken Champions Cup', 'Premiership Rugby'],
      teams: [
        ['New Zealand', 'South Africa'],
        ['England', 'France'],
        ['Australia', 'Argentina'],
        ['Ireland', 'Wales'],
        ['Scotland', 'Italy'],
        ['Crusaders', 'Blues']
      ],
      venues: ['Twickenham Stadium', 'Stade de France', 'Eden Park', 'Murrayfield', 'Principality Stadium'],
      countries: ['United Kingdom', 'France', 'New Zealand', 'United Kingdom', 'United Kingdom']
    },
    {
      sport: 'Rugby League',
      leagues: ['NRL', 'Super League', 'State of Origin', 'World Cup', 'Challenge Cup'],
      teams: [
        ['Sydney Roosters', 'Melbourne Storm'],
        ['Brisbane Broncos', 'Penrith Panthers'],
        ['Leeds Rhinos', 'Wigan Warriors'],
        ['St Helens', 'Warrington Wolves'],
        ['Queensland', 'New South Wales'],
        ['Australia', 'England']
      ],
      venues: ['ANZ Stadium', 'Suncorp Stadium', 'Old Trafford', 'Allianz Stadium', 'Elland Road'],
      countries: ['Australia', 'Australia', 'United Kingdom', 'Australia', 'United Kingdom']
    },
    {
      sport: 'Basketball',
      leagues: ['NBA', 'EuroLeague', 'NBL', 'CBA', 'Liga ACB'],
      teams: [
        ['Los Angeles Lakers', 'Boston Celtics'],
        ['Golden State Warriors', 'Miami Heat'],
        ['Real Madrid', 'Barcelona'],
        ['Sydney Kings', 'Melbourne United'],
        ['CSKA Moscow', 'Fenerbahçe'],
        ['Toronto Raptors', 'Dallas Mavericks']
      ],
      venues: ['Staples Center', 'TD Garden', 'Palau Blaugrana', 'Qudos Bank Arena', 'Megasport Arena'],
      countries: ['United States', 'United States', 'Spain', 'Australia', 'Russia']
    },
    {
      sport: 'Soccer',
      leagues: ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'A-League'],
      teams: [
        ['Manchester United', 'Liverpool'],
        ['Real Madrid', 'Barcelona'],
        ['Bayern Munich', 'Borussia Dortmund'],
        ['Juventus', 'AC Milan'],
        ['Sydney FC', 'Melbourne City'],
        ['Arsenal', 'Chelsea']
      ],
      venues: ['Old Trafford', 'Camp Nou', 'Allianz Arena', 'San Siro', 'Allianz Stadium'],
      countries: ['United Kingdom', 'Spain', 'Germany', 'Italy', 'Australia']
    },
    {
      sport: 'American Football',
      leagues: ['NFL', 'NCAA', 'CFL', 'European League of Football'],
      teams: [
        ['Green Bay Packers', 'Washington Commanders'],
        ['Cincinnati Bengals', 'Jacksonville Jaguars'],
        ['Detroit Lions', 'Chicago Bears'],
        ['Tennessee Titans', 'Los Angeles Rams'],
        ['Dallas Cowboys', 'New York Giants'],
        ['Houston Texans', 'Tampa Bay Buccaneers']
      ],
      venues: ['Lambeau Field', 'Paycor Stadium', 'Ford Field', 'Nissan Stadium', 'AT&T Stadium', 'NRG Stadium'],
      countries: ['United States', 'United States', 'United States', 'United States', 'United States', 'United States']
    },
    {
      sport: 'Baseball',
      leagues: ['MLB', 'Nippon Baseball League', 'Chinese Professional Baseball League'],
      teams: [
        ['Washington Nationals', 'Atlanta Braves'],
        ['Hanshin Tigers', 'Yokohama DeNA BayStars'],
        ['Tohoku Rakuten Golden Eagles', 'Saitama Seibu Lions'],
        ['Tokyo Yakult Swallows', 'Chunichi Dragons'],
        ['Yomiuri Giants', 'Hiroshima Toyo Carp'],
        ['Rakuten Monkeys', 'Wei Chuan Dragons']
      ],
      venues: ['Nationals Park', 'Koshien Stadium', 'Rakuten Mobile Park Miyagi', 'Meiji Jingu Stadium', 'Tokyo Dome', 'Taoyuan International Baseball Stadium'],
      countries: ['United States', 'Japan', 'Japan', 'Japan', 'Japan', 'Taiwan']
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
    // Major Sports
    'Soccer': '⚽',
    'Football': '⚽',
    'Basketball': '🏀',
    'Baseball': '⚾',
    'American Football': '🏈',
    'Australian Football': '🏈',
    'Ice Hockey': '🏒',
    'Rugby': '🏉',
    'Rugby Union': '🏉',
    'Rugby League': '🏉',
    'Cricket': '🏏',
    'Tennis': '🎾',
    'Golf': '⛳',
    'Volleyball': '🏐',
    'Handball': '🤾',
    'Table Tennis': '🏓',
    'Badminton': '🏸',
    'Squash': '🏸',
    
    // Combat Sports
    'Boxing': '🥊',
    'MMA': '🥊',
    'Fighting': '🥊',
    'Wrestling': '🤼',
    'Judo': '🥋',
    'Karate': '🥋',
    'Taekwondo': '🥋',
    
    // Motorsports
    'Motorsport': '🏎️',
    'Formula 1': '🏎️',
    'Formula E': '🏎️',
    'MotoGP': '🏍️',
    'NASCAR': '🏎️',
    'IndyCar': '🏎️',
    'Rally': '🏎️',
    'Le Mans': '🏎️',
    
    // Athletics & Olympic Sports
    'Athletics': '🏃',
    'Swimming': '🏊',
    'Gymnastics': '🤸',
    'Diving': '🏊',
    'Cycling': '🚴',
    'Rowing': '🚣',
    'Sailing': '⛵',
    'Skiing': '⛷️',
    'Snowboarding': '🏂',
    'Skating': '⛸️',
    'Hockey': '🏒',
    'Field Hockey': '🏑',
    
    // Other Sports
    'Snooker': '🎱',
    'Pool': '🎱',
    'Darts': '🎯',
    'Bowling': '🎳',
    'Curling': '🥌',
    'Lacrosse': '🥍',
    'Water Polo': '🤽',
    'Beach Volleyball': '🏐',
    'Surfing': '🏄',
    'Skateboarding': '🛹',
    'Climbing': '🧗',
    'Archery': '🏹',
    'Shooting': '🎯',
    'Weightlifting': '🏋️',
    'Powerlifting': '🏋️',
    'CrossFit': '🏋️',
    
    // League Names (for specific leagues)
    'NFL': '🏈',
    'NBA': '🏀',
    'MLB': '⚾',
    'NHL': '🏒',
    'AFL': '🏈',
    'NRL': '🏉',
    'Super Rugby': '🏉',
    'Big Bash': '🏏',
    'A-League': '⚽',
    'Premier League': '⚽',
    'La Liga': '⚽',
    'Bundesliga': '⚽',
    'Serie A': '⚽',
    'Ligue 1': '⚽',
    'Championship': '⚽',
    'FA Cup': '⚽',
    'Carabao Cup': '⚽',
    'Champions League': '⚽',
    'Europa League': '⚽',
    'NCAA': '🏈',
    'College Football': '🏈',
    'College Basketball': '🏀',
    'CFL': '🏈',
    'MLS': '⚽',
    'Canadian Football': '🏈',
    'IPL': '🏏',
    'ICC': '🏏',
    'Ashes': '🏏',
    'Wimbledon': '🎾',
    'Australian Open': '🎾',
    'US Open': '🎾',
    'French Open': '🎾',
    'ATP': '🎾',
    'WTA': '🎾',
    'Six Nations': '🏉',
    'Rugby Championship': '🏉',
    'Heineken Champions Cup': '🏉',
    'Premiership Rugby': '🏉'
  };
  
  return sportIcons[sport] || '🏆';
};
