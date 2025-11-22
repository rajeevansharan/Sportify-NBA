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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';

// Sample team data structure - replace with your API data
interface Team {
  rank: number;
  name: string;
  wins: number;
  losses: number;
  winPercentage: number;
  gamesBack: number;
  streak: string;
  conference: 'Eastern' | 'Western';
}

// Mock data - Replace this with actual API call
const generateMockData = (): Team[] => [
  { rank: 1, name: 'Boston Celtics', wins: 45, losses: 12, winPercentage: 0.789, gamesBack: 0, streak: 'W5', conference: 'Eastern' },
  { rank: 2, name: 'Milwaukee Bucks', wins: 42, losses: 15, winPercentage: 0.737, gamesBack: 3, streak: 'W2', conference: 'Eastern' },
  { rank: 3, name: 'Philadelphia 76ers', wins: 40, losses: 17, winPercentage: 0.702, gamesBack: 5, streak: 'L1', conference: 'Eastern' },
  { rank: 4, name: 'Cleveland Cavaliers', wins: 38, losses: 19, winPercentage: 0.667, gamesBack: 7, streak: 'W3', conference: 'Eastern' },
  { rank: 5, name: 'Miami Heat', wins: 35, losses: 22, winPercentage: 0.614, gamesBack: 10, streak: 'W1', conference: 'Eastern' },
  { rank: 1, name: 'Denver Nuggets', wins: 44, losses: 13, winPercentage: 0.772, gamesBack: 0, streak: 'W7', conference: 'Western' },
  { rank: 2, name: 'Phoenix Suns', wins: 41, losses: 16, winPercentage: 0.719, gamesBack: 3, streak: 'W4', conference: 'Western' },
  { rank: 3, name: 'LA Lakers', wins: 38, losses: 19, winPercentage: 0.667, gamesBack: 6, streak: 'L2', conference: 'Western' },
  { rank: 4, name: 'Sacramento Kings', wins: 37, losses: 20, winPercentage: 0.649, gamesBack: 7, streak: 'W1', conference: 'Western' },
  { rank: 5, name: 'Golden State Warriors', wins: 35, losses: 22, winPercentage: 0.614, gamesBack: 9, streak: 'L1', conference: 'Western' },
];

export default function StandingsScreen() {
  const { colors } = useTheme();
  const [selectedConference, setSelectedConference] = useState<'Eastern' | 'Western'>('Eastern');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStandings = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await sportsService.getStandings();
      // setTeams(response);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTeams(generateMockData());
    } catch (error) {
      console.error('Error fetching standings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStandings();
  };

  const filteredTeams = teams.filter(team => team.conference === selectedConference);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            NBA Standings
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            2024-25 Regular Season
          </Text>
        </View>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.iconBadgeText}>🏆</Text>
        </View>
      </View>

      {/* Conference Selector */}
      <View style={[styles.conferenceSelector, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.conferenceButton,
            selectedConference === 'Eastern' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setSelectedConference('Eastern')}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.conferenceButtonText,
            { color: selectedConference === 'Eastern' ? '#FFFFFF' : colors.text }
          ]}>
            Eastern
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.conferenceButton,
            selectedConference === 'Western' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setSelectedConference('Western')}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.conferenceButtonText,
            { color: selectedConference === 'Western' ? '#FFFFFF' : colors.text }
          ]}>
            Western
          </Text>
        </TouchableOpacity>
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

  const renderTeamRow = (team: Team, index: number) => {
    const isTopThree = team.rank <= 3;
    
    return (
      <TouchableOpacity
        key={`${team.conference}-${team.rank}`}
        style={[
          styles.teamRow,
          { backgroundColor: colors.card, borderColor: colors.border },
          index === filteredTeams.length - 1 && styles.lastRow
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
          { backgroundColor: team.streak.startsWith('W') ? 'rgba(40, 167, 69, 0.12)' : 'rgba(220, 53, 69, 0.12)' }
        ]}>
          <Text style={[
            styles.streakText,
            { color: team.streak.startsWith('W') ? '#28a745' : '#DC3545' }
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
          {filteredTeams.map((team, index) => renderTeamRow(team, index))}
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
  conferenceSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  conferenceButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  conferenceButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
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