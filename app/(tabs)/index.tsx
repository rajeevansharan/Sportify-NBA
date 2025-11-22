// app/(tabs)/index.tsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import { fetchUpcomingMatches } from '@/src/redux/slices/matchesSlice';
import MatchCard from '@/src/components/MatchCard';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { matches, status, error } = useAppSelector((state) => state.matches);
  const { colors } = useTheme();

  useEffect(() => {
    // Fetch data only on initial load or if failed
    if (status === 'idle') {
      dispatch(fetchUpcomingMatches());
    }
  }, [status, dispatch]);

  const onRefresh = () => {
    dispatch(fetchUpcomingMatches());
  };

  const renderContent = () => {
    if (status === 'loading' && matches.length === 0) {
      return <LoadingSpinner message="Fetching NBA fixtures..." />;
    }

    if (error && matches.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Feather name="alert-triangle" size={40} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>Error: {error}</Text>
          <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
            Could not load matches. Please check your network or try refreshing.
          </Text>
        </View>
      );
    }

    if (matches.length === 0 && status === 'succeeded') {
      return (
        <View style={styles.emptyContainer}>
          <Feather name="frown" size={40} color={colors.textMuted} />
          <Text style={[styles.errorText, { color: colors.text }]}>No Upcoming Matches Found</Text>
          <Text style={{ color: colors.textMuted }}>
            The NBA schedule may not be available at this moment.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={matches}
        keyExtractor={(item) => item.idEvent}
        renderItem={({ item }) => <MatchCard match={item} />}
        contentContainerStyle={{ paddingVertical: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});