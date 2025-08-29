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
  fromCache?: boolean;
}

// New types for Cloudflare Worker integration
export interface SportEvent {
  idEvent: string;
  strEvent: string;
  strSport: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string;
  strTime: string;
  strVenue: string;
  strThumb: string | null;
  strStatus?: string;
  strCity?: string;
  strCountry?: string;
  strRound?: string;
  strSeason?: string;
  strDescription?: string;
  strFilename?: string;
  strPoster?: string;
  strFanart?: string;
  strBanner?: string;
  strLogo?: string;
  strTrophy?: string;
  strMap?: string;
  strLocked?: string;
}

export type GroupedEvents = Record<string, SportEvent[]>;
