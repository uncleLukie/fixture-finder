import type { Match, Sport, ApiResponse } from '../types/sports';

// Fallback mock data for when API is not available
const mockMatches: Match[] = [
  {
    id: 1,
    homeTeam: { id: 1, name: 'Manchester United', shortName: 'Man Utd' },
    awayTeam: { id: 2, name: 'Liverpool', shortName: 'Liverpool' },
    venue: { id: 1, name: 'Old Trafford', city: 'Manchester' },
    date: '2024-01-15',
    time: '20:00',
    status: 'scheduled',
    competition: 'Premier League',
    round: 'Matchday 21'
  },
  {
    id: 2,
    homeTeam: { id: 3, name: 'Arsenal', shortName: 'Arsenal' },
    awayTeam: { id: 4, name: 'Chelsea', shortName: 'Chelsea' },
    venue: { id: 2, name: 'Emirates Stadium', city: 'London' },
    date: '2024-01-16',
    time: '19:45',
    status: 'live',
    competition: 'Premier League',
    round: 'Matchday 21',
    score: { home: 2, away: 1 },
    minute: 67
  },
  {
    id: 3,
    homeTeam: { id: 5, name: 'Barcelona', shortName: 'Barca' },
    awayTeam: { id: 6, name: 'Real Madrid', shortName: 'Real Madrid' },
    venue: { id: 3, name: 'Camp Nou', city: 'Barcelona' },
    date: '2024-01-17',
    time: '21:00',
    status: 'scheduled',
    competition: 'La Liga',
    round: 'Matchday 20'
  }
];

export const sports: Sport[] = [
  {
    id: 1,
    name: 'Football',
    icon: '⚽',
    competitions: ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Champions League']
  },
  {
    id: 2,
    name: 'Basketball',
    icon: '🏀',
    competitions: ['NBA', 'EuroLeague', 'FIBA World Cup']
  },
  {
    id: 3,
    name: 'Tennis',
    icon: '🎾',
    competitions: ['Australian Open', 'French Open', 'Wimbledon', 'US Open']
  },
  {
    id: 4,
    name: 'Cricket',
    icon: '🏏',
    competitions: ['ICC World Cup', 'IPL', 'Ashes Series']
  }
];

class SportsApiService {
  constructor() {
    // Initialize service
  }

  async getMatches(_sport: string, competition?: string): Promise<ApiResponse<Match[]>> {
    try {
      // For now, return mock data
      // In production, you would make actual API calls here
      let filteredMatches = mockMatches;
      
      if (competition) {
        filteredMatches = mockMatches.filter(match => 
          match.competition.toLowerCase().includes(competition.toLowerCase())
        );
      }

      return {
        data: filteredMatches,
        success: true
      };
    } catch (error) {
      console.error('Error fetching matches:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch matches'
      };
    }
  }

  async getLiveMatches(): Promise<ApiResponse<Match[]>> {
    try {
      const liveMatches = mockMatches.filter(match => match.status === 'live');
      return {
        data: liveMatches,
        success: true
      };
    } catch (error) {
      console.error('Error fetching live matches:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch live matches'
      };
    }
  }

  async getUpcomingMatches(days: number = 7): Promise<ApiResponse<Match[]>> {
    try {
      const today = new Date();
      const upcomingMatches = mockMatches.filter(match => {
        const matchDate = new Date(match.date);
        const diffTime = matchDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= days && match.status === 'scheduled';
      });

      return {
        data: upcomingMatches,
        success: true
      };
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch upcoming matches'
      };
    }
  }

  getSports(): Sport[] {
    return sports;
  }
}

export const sportsApiService = new SportsApiService();
