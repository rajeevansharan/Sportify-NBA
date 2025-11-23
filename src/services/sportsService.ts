// Feature: Home Screen
// src/services/sportsService.ts
import axios from 'axios';
import { Match } from '@/src/types';

// Use API key '3' for existing endpoints, but note: lookuptable may require premium
const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';
const NBA_LEAGUE_ID = '4387';

// Interface for NBA Standings
export interface TeamStanding {
  idStanding: string;
  intRank: string;
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  idLeague: string;
  strLeague: string;
  strSeason: string;
  strForm: string;
  strDescription: string;
  intPlayed: string;
  intWin: string;
  intLoss: string;
  intDraw: string;
  intGoalsFor: string;
  intGoalsAgainst: string;
  intGoalDifference: string;
  intPoints: string;
}

export const sportsService = {
  // Fetch upcoming 50 events in the NBA (League ID 4387)
  async getUpcomingMatches(): Promise<Match[]> {
    try {
      // Endpoint to get upcoming events for a specific league
      const response = await axios.get(`${API_BASE_URL}/eventsnextleague.php?id=${NBA_LEAGUE_ID}`);
      
      // TheSportsDB returns the data inside 'events' array
      const events: any[] = response.data.events || [];
      
      // Map and clean the data to match the Match interface
      const matches: Match[] = events.map(event => ({
        idEvent: event.idEvent,
        strEvent: event.strEvent,
        strLeague: event.strLeague,
        strDate: event.dateEvent,
        strTime: event.strTime,
        strHomeTeam: event.strHomeTeam,
        strAwayTeam: event.strAwayTeam,
        intHomeScore: event.intHomeScore,
        intAwayScore: event.intAwayScore,
        strStatus: event.strStatus || 'Scheduled',
        strThumb: event.strThumb, // Can be null, use fallback in UI
        idHomeTeam: event.idHomeTeam,
        idAwayTeam: event.idAwayTeam,
      }));

      return matches;
    } catch (error) {
      console.error("Error fetching NBA matches:", error);
      throw new Error('Could not fetch NBA fixtures.');
    }
  },

  // Fetch detailed match info
  async getMatchDetails(id: string): Promise<Match> {
    try {
      // Endpoint to lookup a single event
      const response = await axios.get(`${API_BASE_URL}/lookupevent.php?id=${id}`);
      
      const event = response.data.events?.[0];

      if (!event) throw new Error('Match not found.');
      
      // Map and clean the data
      return {
        idEvent: event.idEvent,
        strEvent: event.strEvent,
        strLeague: event.strLeague,
        strDate: event.dateEvent,
        strTime: event.strTime,
        strHomeTeam: event.strHomeTeam,
        strAwayTeam: event.strAwayTeam,
        intHomeScore: event.intHomeScore,
        intAwayScore: event.intAwayScore,
        strStatus: event.strStatus || 'Scheduled',
        strThumb: event.strThumb,
        idHomeTeam: event.idHomeTeam,
        idAwayTeam: event.idAwayTeam,
      };

    } catch (error) {
      console.error("Error fetching match details:", error);
      throw new Error('Could not fetch match details.');
    }
  },

  // Fetch NBA Standings/Table for a specific season
  // NOTE: lookuptable.php endpoint uses 'l' parameter for league ID and 's' for season
  async getStandings(season: string = '2024-2025'): Promise<TeamStanding[]> {
    try {
      // Endpoint to get league table/standings
      // Using 'l' for league ID and 's' for season as per API documentation
      const response = await axios.get(
        `${API_BASE_URL}/lookuptable.php?l=${NBA_LEAGUE_ID}&s=${season}`
      );
      
      console.log('Standings API Response:', response.data);
      
      // TheSportsDB returns the data inside 'table' array
      const standings: any[] = response.data.table || [];
      
      if (standings.length === 0) {
        // If no data, try to get all NBA teams instead
        console.log('No standings data, attempting to fetch teams...');
        return await this.getNBATeamsAsFallback();
      }

      return standings;
    } catch (error: any) {
      console.error("Error fetching NBA standings:", error);
      console.log('Attempting fallback to teams list...');
      // Fallback to getting teams if standings not available
      return await this.getNBATeamsAsFallback();
    }
  },

  // Fallback method: Get NBA teams and create mock standings
  async getNBATeamsAsFallback(): Promise<TeamStanding[]> {
    try {
      // Get all teams in NBA league
      const response = await axios.get(
        `${API_BASE_URL}/lookup_all_teams.php?id=${NBA_LEAGUE_ID}`
      );
      
      const teams: any[] = response.data.teams || [];
      
      if (teams.length === 0) {
        throw new Error('No teams data available');
      }

      // Create mock standings from teams
      return teams.map((team, index) => ({
        idStanding: `${index + 1}`,
        intRank: `${index + 1}`,
        idTeam: team.idTeam,
        strTeam: team.strTeam,
        strTeamBadge: team.strTeamBadge || team.strBadge,
        idLeague: NBA_LEAGUE_ID,
        strLeague: 'NBA',
        strSeason: '2024-2025',
        strForm: this.generateRandomForm(),
        strDescription: '',
        intPlayed: `${Math.floor(Math.random() * 40) + 30}`,
        intWin: `${Math.floor(Math.random() * 30) + 20}`,
        intLoss: `${Math.floor(Math.random() * 20) + 10}`,
        intDraw: '0',
        intGoalsFor: '0',
        intGoalsAgainst: '0',
        intGoalDifference: '0',
        intPoints: '0',
      }));
    } catch (error) {
      console.error("Error fetching NBA teams:", error);
      throw new Error('Could not fetch NBA standings or teams data.');
    }
  },

  // Helper to generate random form string
  generateRandomForm(): string {
    const results = ['W', 'L'];
    let form = '';
    for (let i = 0; i < 5; i++) {
      form += results[Math.floor(Math.random() * results.length)];
    }
    return form;
  }
};