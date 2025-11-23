// src/types/index.ts

export interface Match {
  idEvent: string;
  strEvent: string; // e.g., 'Team A vs Team B'
  strLeague: string;
  strDate: string; // YYYY-MM-DD
  strTime: string; // HH:MM:SS
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: 'Scheduled' | 'Finished' | string;
  strThumb: string | null; // Placeholder for image/icon
  idHomeTeam: string;
  idAwayTeam: string;
}
export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string | null;
  strStadium: string | null;
  strCountry: string | null;
}
export interface MatchSummary {
  id: string;
  title: string;         // "Luton Town vs Derby County"
  league: string;
  date: string;          // "2024-08-16"
  time: string;          // "19:00"
  status: string;        // "Not Started", "Finished", "Match Finished"
  home: {
    name: string;
    score: string | null;
  };
  away: {
    name: string;
    score: string | null;
  };
  thumbnail: string | null;
}

export interface User {
  token: string;
  firstName: string;
  username: string;
}

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  error: string;
}

export type ThemeName = 'light' | 'dark';