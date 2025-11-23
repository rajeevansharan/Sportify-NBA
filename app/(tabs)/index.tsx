// Feature: Home Screen
// app/(tabs)/index.tsx
import LoadingSpinner from "@/src/components/LoadingSpinner";
import MatchCard from "@/src/components/MatchCard";
import { useTheme } from "@/src/contexts/ThemeContext";
import { fetchUpcomingMatches } from "@/src/redux/slices/matchesSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { matches, status, error } = useAppSelector((state) => state.matches);
  const { colors } = useTheme();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUpcomingMatches());
    }
  }, [status, dispatch]);

  const onRefresh = () => {
    dispatch(fetchUpcomingMatches());
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            NBA Fixtures
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            {matches.length > 0
              ? `${matches.length} upcoming ${matches.length === 1 ? "match" : "matches"}`
              : "Stay updated with live schedules"}
          </Text>
        </View>
        <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.iconBadgeText}>🏀</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = (
    icon: string,
    title: string,
    description: string,
    isError = false
  ) => (
    <View style={styles.emptyStateContainer}>
      <View
        style={[
          styles.emptyStateIconContainer,
          {
            backgroundColor: isError
              ? "rgba(220, 53, 69, 0.1)"
              : "rgba(128, 128, 128, 0.1)",
          },
        ]}
      >
        <Feather
          name={icon as any}
          size={48}
          color={isError ? colors.error : colors.textMuted}
        />
      </View>
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.emptyStateDescription, { color: colors.textMuted }]}>
        {description}
      </Text>
      {isError && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRefresh}
          activeOpacity={0.8}
        >
          <Feather
            name="refresh-cw"
            size={18}
            color="#FFFFFF"
            style={styles.retryIcon}
          />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderContent = () => {
    if (status === "loading" && matches.length === 0) {
      return <LoadingSpinner message="Fetching NBA fixtures..." />;
    }

    if (error && matches.length === 0) {
      return renderEmptyState(
        "alert-circle",
        "Unable to Load Matches",
        "Please check your internet connection and try again.",
        true
      );
    }

    if (matches.length === 0 && status === "succeeded") {
      return renderEmptyState(
        "calendar",
        "No Upcoming Matches",
        "The NBA schedule may not be available at this moment. Check back later for updates."
      );
    }

    return (
      <>
        {renderHeader()}
        <FlatList
          data={matches}
          keyExtractor={(item) => item.idEvent}
          renderItem={({ item }) => <MatchCard match={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={status === "loading"}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      </>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="dark-content" />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBadgeText: {
    fontSize: 28,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  emptyStateDescription: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
