// src/components/MatchCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, GestureResponderEvent } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Match } from '@/src/types';
// Import RootState for typed selector
import { useAppDispatch, useAppSelector, RootState } 
  from '@/src/redux/store'; 
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
  
  // FIX 1: Apply RootState type to the state parameter
  const isFav = useAppSelector((state: RootState) => selectIsFavorite(state, match.idEvent));

  const matchDate = moment(`${match.strDate} ${match.strTime}`);
  const statusText = match.intHomeScore && match.intAwayScore 
    ? `FT: ${match.intHomeScore} - ${match.intAwayScore}`
    : `Upcoming: ${matchDate.format('MMM DD, hh:mm A')}`;
  
  // FIX 2: Explicitly type the event parameter 'e'
  const handleToggleFavorite = (e: GestureResponderEvent) => {
    e.stopPropagation(); // Prevents navigating to details when toggling favorite
    dispatch(toggleFavorite(match.idEvent));
  };

  const handlePress = () => {
    router.push(`/match/${match.idEvent}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handlePress}
    >
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          {/* Image / Icon o */}
          <Image 
            source={{ uri: match.strThumb || FALLBACK_IMAGE }} 
            style={styles.image} 
            defaultSource={{ uri: FALLBACK_IMAGE }}
          />
        </View>

        <View style={styles.textContainer}>
          {/* Title o */}
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {match.strHomeTeam} vs {match.strAwayTeam}
          </Text>
          {/* Description or status o */}
          <Text style={[styles.status, { color: colors.textMuted }]}>
            {statusText}
          </Text>
          <Text style={[styles.league, { color: colors.textMuted }]}>
            {match.strLeague}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
        <Feather 
          // FIX 3: Change 'heart-o' (invalid) to 'star' (valid alternative)
          // to comply with the "Feather Icons" rule while showing state.
          name={isFav ? 'heart' : 'star'} 
          size={24} 
          // Color change provides the primary visual state indication
          color={isFav ? colors.error : colors.textMuted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF10', // Light blue background for NBA theme
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
  },
  league: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  favoriteButton: {
    padding: 5,
  },
});

export default MatchCard;