// src/services/sportsService.ts
import axios from 'axios';
import { Match } from '@/src/types';

const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';
const NBA_LEAGUE_ID = '4387';

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
  }
};