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