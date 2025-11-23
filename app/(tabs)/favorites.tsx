// Feature: Favourites
// app/(tabs)/favorites.tsx
import MatchCard from "@/src/components/MatchCard";
import { useTheme } from "@/src/contexts/ThemeContext";
import { selectFavoriteIds } from "@/src/redux/slices/favoritesSlice";
import { useAppSelector } from "@/src/redux/store";
import { Match } from "@/src/types";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const allMatches = useAppSelector((state) => state.matches.matches);
  const favoriteIds = useAppSelector(selectFavoriteIds);

  // Filter the main matches list to only include favorites
  const favoriteMatches: Match[] = allMatches.filter((match) =>
    favoriteIds.includes(match.idEvent)
  );

  const renderContent = () => {
    if (favoriteMatches.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Feather name="star" size={40} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No Favorites Yet
          </Text>
          <Text style={{ color: colors.textMuted, textAlign: "center" }}>
            Tap the heart icon on any match to add it to your list.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={favoriteMatches}
        keyExtractor={(item) => item.idEvent}
        renderItem={({ item }) => <MatchCard match={item} />}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
