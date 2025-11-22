// app/(tabs)/explore.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { sportsService, TeamStanding } from '@/src/services/sportsService';

// Processed team data for display
interface ProcessedTeam {
  rank: number;
  name: string;
  wins: number;
  losses: number;
  winPercentage: number;
  gamesBack: number;
  streak: string;
  form: string;
  teamBadge: string;
}

export default function StandingsScreen() {
  const { colors } = useTheme();
  const [teams, setTeams] = useState<ProcessedTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [season, setSeason] = useState('2024-2025');

  const processStandings = (standings: TeamStanding[]): ProcessedTeam[] => {
    // Sort by wins (descending)
    const sorted = [...standings].sort((a, b) => parseInt(b.intWin) - parseInt(a.intWin));
    
    const topWins = parseInt(sorted[0]?.intWin || '0');
    
    return sorted.map((team, index) => {
      const wins = parseInt(team.intWin || '0');
      const losses = parseInt(team.intLoss || '0');
      const totalGames = wins + losses;
      const winPercentage = totalGames > 0 ? wins / totalGames : 0;
      const gamesBack = (topWins - wins);
      
      // Parse form (e.g., "WLWWL") to get streak
      const form = team.strForm || '';
      let streak = '';
      if (form.length > 0) {
        const lastResult = form[form.length - 1];
        let count = 1;
        for (let i = form.length - 2; i >= 0; i--) {
          if (form[i] === lastResult) count++;
          else break;
        }
        streak = `${lastResult}${count}`;
      }

      return {
        rank: index + 1,
        name: team.strTeam,
        wins,
        losses,
        winPercentage,
        gamesBack,
        streak: streak || 'N/A',
        form: team.strForm || '',
        teamBadge: team.strTeamBadge || '',
      };
    });
  };

  const fetchStandings = async () => {
    try {
      setError(null);
      const standings = await sportsService.getStandings(season);
      const processed = processStandings(standings);
      setTeams(processed);
    } catch (err: any) {
      console.error('Error fetching standings:', err);
      setError(err.message || 'Failed to load standings');
      Alert.alert('Error', err.message || 'Failed to load standings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, [season]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStandings();
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            NBA Teams
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            {season} Season Rankings
          </Text>
        </View>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.iconBadgeText}>🏆</Text>
        </View>
      </View>
      
      {/* Info Banner */}
      <View style={[styles.infoBanner, { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}40` }]}>
        <Feather name="info" size={16} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={[styles.infoBannerText, { color: colors.primary }]}>
          Showing NBA teams with simulated standings data
        </Text>
      </View>
    </View>
  );

  const renderTableHeader = () => (
    <View style={[styles.tableHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.rankHeaderText, { color: colors.textMuted }]}>#</Text>
      <Text style={[styles.teamHeaderText, { color: colors.textMuted }]}>Team</Text>
      <Text style={[styles.statHeaderText, { color: colors.textMuted }]}>W</Text>
      <Text style={[styles.statHeaderText, { color: colors.textMuted }]}>L</Text>
      <Text style={[styles.statHeaderText, { color: colors.textMuted }]}>PCT</Text>
      <Text style={[styles.statHeaderText, { color: colors.textMuted }]}>GB</Text>
      <Text style={[styles.streakHeaderText, { color: colors.textMuted }]}>Streak</Text>
    </View>
  );

  const renderTeamRow = (team: ProcessedTeam, index: number) => {
    const isTopThree = team.rank <= 3;
    const isWinStreak = team.streak.startsWith('W');
    
    return (
      <TouchableOpacity
        key={`${team.name}-${team.rank}`}
        style={[
          styles.teamRow,
          { backgroundColor: colors.card, borderColor: colors.border },
          index === teams.length - 1 && styles.lastRow
        ]}
        activeOpacity={0.7}
      >
        {/* Rank */}
        <View style={styles.rankContainer}>
          {isTopThree ? (
            <View style={[styles.topRankBadge, { backgroundColor: getTopRankColor(team.rank) }]}>
              <Text style={styles.topRankText}>{team.rank}</Text>
            </View>
          ) : (
            <Text style={[styles.rankText, { color: colors.textMuted }]}>{team.rank}</Text>
          )}
        </View>

        {/* Team Name */}
        <Text style={[styles.teamNameText, { color: colors.text }]} numberOfLines={1}>
          {team.name}
        </Text>

        {/* Stats */}
        <Text style={[styles.statText, { color: colors.text }]}>{team.wins}</Text>
        <Text style={[styles.statText, { color: colors.text }]}>{team.losses}</Text>
        <Text style={[styles.statText, { color: colors.text }]}>
          {team.winPercentage.toFixed(3)}
        </Text>
        <Text style={[styles.statText, { color: colors.textMuted }]}>
          {team.gamesBack === 0 ? '-' : team.gamesBack}
        </Text>

        {/* Streak */}
        <View style={[
          styles.streakBadge,
          { backgroundColor: isWinStreak ? 'rgba(40, 167, 69, 0.12)' : 'rgba(220, 53, 69, 0.12)' }
        ]}>
          <Text style={[
            styles.streakText,
            { color: isWinStreak ? '#28a745' : '#DC3545' }
          ]}>
            {team.streak}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getTopRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return colors.primary;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading standings...</Text>
      </SafeAreaView>
    );
  }

  if (error && teams.length === 0) {
    return (
      <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <View style={styles.errorContent}>
          <View style={[styles.errorIconContainer, { backgroundColor: 'rgba(220, 53, 69, 0.1)' }]}>
            <Feather name="alert-circle" size={48} color={colors.error} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Unable to Load Standings</Text>
          <Text style={[styles.errorDescription, { color: colors.textMuted }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={onRefresh}
            activeOpacity={0.8}
          >
            <Feather name="refresh-cw" size={18} color="#FFFFFF" style={styles.retryIcon} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {renderHeader()}
        
        <View style={styles.tableContainer}>
          {renderTableHeader()}
          {teams.map((team, index) => renderTeamRow(team, index))}
        </View>

        {/* Info Footer */}
        <View style={styles.footerContainer}>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="info" size={16} color={colors.primary} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: colors.textMuted }]}>
              W: Wins | L: Losses | PCT: Win Percentage | GB: Games Back
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 28,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBadgeText: {
    fontSize: 28,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 16,
  },
  infoBannerText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  tableContainer: {
    paddingHorizontal: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  rankHeaderText: {
    width: 40,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  teamHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statHeaderText: {
    width: 45,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  streakHeaderText: {
    width: 55,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    marginTop: -1,
  },
  lastRow: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rankContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  topRankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRankText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  rankText: {
    fontSize: 15,
    fontWeight: '700',
  },
  teamNameText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statText: {
    width: 45,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  streakBadge: {
    width: 55,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
});