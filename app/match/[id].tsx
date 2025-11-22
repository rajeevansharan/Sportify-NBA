// app/match/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Match } from '@/src/types';
import { sportsService } from '@/src/services/sportsService';
import moment from 'moment';
// 1. Import RootState to ensure correct typing for selectors (from previous fixes)
import { useAppDispatch, useAppSelector, RootState } from '@/src/redux/store'; 
import { selectIsFavorite, toggleFavorite } from '@/src/redux/slices/favoritesSlice';

const FALLBACK_IMAGE = 'https://via.placeholder.com/600x200/007AFF/FFFFFF?text=NBA+Match';

export default function MatchDetailsScreen() {
  const { id } = useLocalSearchParams();
  // Ensure matchId is always a string
  const matchId = Array.isArray(id) ? id[0] : id; 
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  
  // FIX: Apply RootState type to the state parameter for type safety
  const isFavorite = useAppSelector((state: RootState) => selectIsFavorite(state, matchId!));

  const [matchDetails, setMatchDetails] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const details = await sportsService.getMatchDetails(matchId);
        setMatchDetails(details);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch match details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [matchId]);

  const handleToggleFavorite = () => {
    if (matchId) {
      dispatch(toggleFavorite(matchId));
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Loading details...</Text>
      </View>
    );
  }

  if (error || !matchDetails) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Feather name="x-circle" size={40} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>Error Loading Match</Text>
        <Text style={{ color: colors.textMuted }}>{error}</Text>
      </View>
    );
  }

  const matchDate = moment(`${matchDetails.strDate} ${matchDetails.strTime}`);
  const status = matchDetails.intHomeScore && matchDetails.intAwayScore ? 'Final Score' : 'Scheduled';
  const scoreText = matchDetails.intHomeScore && matchDetails.intAwayScore 
    ? `${matchDetails.intHomeScore} - ${matchDetails.intAwayScore}`
    : 'vs';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      
      {/* Team Image / Header */}
      <Image 
        source={{ uri: matchDetails.strThumb || FALLBACK_IMAGE }} 
        style={styles.headerImage} 
        defaultSource={{ uri: FALLBACK_IMAGE }}
      />
      
      <View style={[styles.detailContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        
        {/* Title and Favorite Button */}
        <View style={styles.titleRow}>
          <Text style={[styles.matchTitle, { color: colors.text }]}>{matchDetails.strEvent}</Text>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteBtn}>
            <Feather 
              // FIX: Use 'heart' consistently, relying on color for state indication
              name={'heart'} 
              size={30} 
              color={isFavorite ? colors.error : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Score/Status */}
        <View style={styles.scoreBox}>
          <Text style={[styles.scoreStatus, { color: colors.textMuted }]}>{status}</Text>
          <Text style={[styles.scoreText, { color: colors.text }]}>{scoreText}</Text>
        </View>
        
        {/* Details List */}
        <View style={[styles.infoCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <DetailRow 
            icon="calendar" 
            label="Date" 
            value={matchDate.format('dddd, MMM DD, YYYY')} 
            colors={colors}
          />
          <DetailRow 
            icon="clock" 
            label="Time" 
            value={matchDate.format('hh:mm A')} 
            colors={colors}
          />
          <DetailRow 
            icon="tag" 
            label="League" 
            value={matchDetails.strLeague} 
            colors={colors}
          />
        </View>

        {/* Team Names and Scores */}
        <View style={styles.teamSection}>
            <TeamBox teamName={matchDetails.strHomeTeam} score={matchDetails.intHomeScore} colors={colors} isHome />
            <TeamBox teamName={matchDetails.strAwayTeam} score={matchDetails.intAwayScore} colors={colors} />
        </View>
      </View>
    </ScrollView>
  );
}

// Reusable Sub-Components
const DetailRow = ({ icon, label, value, colors }: { icon: keyof typeof Feather.glyphMap, label: string, value: string, colors: any }) => (
  <View style={detailRowStyles.row}>
    <Feather name={icon} size={18} color={colors.primary} />
    <Text style={[detailRowStyles.label, { color: colors.textMuted }]}>{label}:</Text>
    <Text style={[detailRowStyles.value, { color: colors.text }]}>{value}</Text>
  </View>
);

const detailRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
    width: 80,
  },
  value: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  }
});

const TeamBox = ({ teamName, score, colors, isHome = false }: { teamName: string, score: string | null, colors: any, isHome?: boolean }) => (
  <View style={[teamBoxStyles.box, { backgroundColor: isHome ? colors.background : colors.card, borderColor: isHome ? colors.primary : colors.border }]}>
    <Text style={[teamBoxStyles.name, { color: colors.text }]}>{teamName}</Text>
    <Text style={[teamBoxStyles.score, { color: score ? colors.text : colors.textMuted }]}>
      {score !== null ? score : 'TBD'}
    </Text>
  </View>
);

const teamBoxStyles = StyleSheet.create({
    box: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        width: '48%',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    score: {
        fontSize: 24,
        fontWeight: '900',
        marginTop: 5,
    }
});


const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  detailContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Overlap the image slightly
    borderTopWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 10,
  },
  favoriteBtn: {
    padding: 5,
  },
  scoreBox: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  scoreStatus: {
    fontSize: 14,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '900',
  },
  infoCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  teamSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});