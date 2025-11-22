// src/components/MatchCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, GestureResponderEvent } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Match } from '@/src/types';
import { useAppDispatch, useAppSelector, RootState } from '@/src/redux/store'; 
import { selectIsFavorite, toggleFavorite } from '@/src/redux/slices/favoritesSlice';
import moment from 'moment';
import { useRouter } from 'expo-router';

interface MatchCardProps {
  match: Match;
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/150x80/007AFF/FFFFFF?text=NBA';

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { colors } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const isFav = useAppSelector((state: RootState) => selectIsFavorite(state, match.idEvent));

  const matchDate = moment(`${match.strDate} ${match.strTime}`);
  const isFinished = match.intHomeScore && match.intAwayScore;
  
  const handleToggleFavorite = (e: GestureResponderEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(match.idEvent));
  };

  const handlePress = () => {
    router.push(`/match/${match.idEvent}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Favorite Button - Top Right */}
      <TouchableOpacity 
        onPress={handleToggleFavorite} 
        style={[styles.favoriteButton, { backgroundColor: colors.background }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather 
          name={isFav ? 'heart' : 'heart'} 
          size={20} 
          color={isFav ? colors.error : colors.textMuted}
          style={{ opacity: isFav ? 1 : 0.5 }}
        />
      </TouchableOpacity>

      {/* Match Image */}
      <View style={[styles.imageContainer, { backgroundColor: `${colors.primary}10` }]}>
        <Image 
          source={{ uri: match.strThumb || FALLBACK_IMAGE }} 
          style={styles.image} 
          defaultSource={{ uri: FALLBACK_IMAGE }}
        />
      </View>

      {/* Match Info */}
      <View style={styles.infoContainer}>
        {/* Teams */}
        <View style={styles.teamsContainer}>
          <View style={styles.teamRow}>
            <View style={[styles.teamDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
              {match.strHomeTeam}
            </Text>
            {isFinished && (
              <Text style={[styles.score, { color: colors.text }]}>
                {match.intHomeScore}
              </Text>
            )}
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={[styles.vsText, { color: colors.textMuted }]}>VS</Text>
          </View>
          
          <View style={styles.teamRow}>
            <View style={[styles.teamDot, { backgroundColor: colors.textMuted }]} />
            <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
              {match.strAwayTeam}
            </Text>
            {isFinished && (
              <Text style={[styles.score, { color: colors.text }]}>
                {match.intAwayScore}
              </Text>
            )}
          </View>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <View style={[
            styles.statusBadge, 
            { 
              backgroundColor: isFinished 
                ? 'rgba(40, 167, 69, 0.12)' 
                : 'rgba(0, 122, 255, 0.12)' 
            }
          ]}>
            <Feather 
              name={isFinished ? 'check-circle' : 'clock'} 
              size={12} 
              color={isFinished ? '#28a745' : colors.primary} 
              style={styles.statusIcon}
            />
            <Text style={[
              styles.statusText, 
              { color: isFinished ? '#28a745' : colors.primary }
            ]}>
              {isFinished ? 'Finished' : matchDate.format('MMM DD, hh:mm A')}
            </Text>
          </View>
          
          <View style={styles.leagueContainer}>
            <Feather name="award" size={12} color={colors.textMuted} style={styles.leagueIcon} />
            <Text style={[styles.leagueText, { color: colors.textMuted }]} numberOfLines={1}>
              {match.strLeague}
            </Text>
          </View>
        </View>
      </View>

      {/* Arrow Indicator */}
      <View style={styles.arrowContainer}>
        <Feather name="chevron-right" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
  },
  teamsContainer: {
    marginBottom: 16,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  teamDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  teamName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  score: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 12,
    minWidth: 30,
    textAlign: 'right',
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  vsText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    flex: 1,
  },
  leagueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.08)',
  },
  leagueIcon: {
    marginRight: 6,
  },
  leagueText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  arrowContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default MatchCard;