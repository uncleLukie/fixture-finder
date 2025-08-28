export interface Team {
  id: number;
  name: string;
  shortName?: string;
  logo?: string;
}

export interface Venue {
  id: number;
  name: string;
  city?: string;
  country?: string;
}

export interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  venue: Venue;
  date: string;
  time?: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
  competition: string;
  round?: string;
  score?: {
    home: number;
    away: number;
  };
  minute?: number;
}

export interface Sport {
  id: number;
  name: string;
  icon: string;
  competitions: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
