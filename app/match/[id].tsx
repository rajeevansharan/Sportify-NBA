// app/match/[id].tsx
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  selectIsFavorite,
  toggleFavorite,
} from "@/src/redux/slices/favoritesSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/src/redux/store";
import { sportsService } from "@/src/services/sportsService";
import { Match } from "@/src/types";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FALLBACK_IMAGE = require("@/assets/images/logo.png");

export default function MatchDetailsScreen() {
  const { id } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isFavorite = useAppSelector((state: RootState) =>
    selectIsFavorite(state, matchId!)
  );

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
        setError(err.message || "Failed to fetch match details.");
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
      <SafeAreaView
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading match details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !matchDetails) {
    return (
      <SafeAreaView
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContent}>
          <View
            style={[
              styles.errorIconContainer,
              { backgroundColor: "rgba(220, 53, 69, 0.1)" },
            ]}
          >
            <Feather name="alert-circle" size={48} color={colors.error} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Unable to Load Match
          </Text>
          <Text style={[styles.errorDescription, { color: colors.textMuted }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Feather
              name="arrow-left"
              size={18}
              color="#FFFFFF"
              style={styles.retryIcon}
            />
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const matchDate = moment(`${matchDetails.strDate} ${matchDetails.strTime}`);
  const isFinished = matchDetails.intHomeScore && matchDetails.intAwayScore;
  const scoreText = isFinished
    ? `${matchDetails.intHomeScore} - ${matchDetails.intAwayScore}`
    : "vs";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image with Overlay */}
        <View style={styles.headerContainer}>
          <Image
            source={
              matchDetails.strThumb
                ? { uri: matchDetails.strThumb }
                : FALLBACK_IMAGE
            }
            style={styles.headerImage}
            defaultSource={FALLBACK_IMAGE}
          />
          <View style={styles.headerOverlay} />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButtonHeader}
            onPress={handleToggleFavorite}
            activeOpacity={0.8}
          >
            <Feather
              name="heart"
              size={24}
              color={isFavorite ? colors.error : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View
          style={[
            styles.contentContainer,
            { backgroundColor: colors.background },
          ]}
        >
          {/* Match Title */}
          <Text style={[styles.matchTitle, { color: colors.text }]}>
            {matchDetails.strEvent}
          </Text>

          {/* League Badge */}
          <View
            style={[
              styles.leagueBadge,
              { backgroundColor: `${colors.primary}15` },
            ]}
          >
            <Feather
              name="award"
              size={16}
              color={colors.primary}
              style={styles.leagueIcon}
            />
            <Text style={[styles.leagueText, { color: colors.primary }]}>
              {matchDetails.strLeague}
            </Text>
          </View>

          {/* Score Section */}
          <View
            style={[
              styles.scoreSection,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isFinished
                    ? "rgba(40, 167, 69, 0.12)"
                    : "rgba(0, 122, 255, 0.12)",
                },
              ]}
            >
              <Feather
                name={isFinished ? "check-circle" : "clock"}
                size={14}
                color={isFinished ? "#28a745" : colors.primary}
                style={styles.statusIcon}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isFinished ? "#28a745" : colors.primary },
                ]}
              >
                {isFinished ? "Final Score" : "Scheduled"}
              </Text>
            </View>

            <Text style={[styles.scoreText, { color: colors.text }]}>
              {scoreText}
            </Text>
          </View>

          {/* Team Cards */}
          <View style={styles.teamsContainer}>
            <TeamCard
              teamName={matchDetails.strHomeTeam}
              score={matchDetails.intHomeScore}
              colors={colors}
              isHome
            />
            <TeamCard
              teamName={matchDetails.strAwayTeam}
              score={matchDetails.intAwayScore}
              colors={colors}
            />
          </View>

          {/* Match Information */}
          <View
            style={[
              styles.infoSection,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Match Information
            </Text>

            <InfoRow
              icon="calendar"
              label="Date"
              value={matchDate.format("dddd, MMM DD, YYYY")}
              colors={colors}
            />
            <InfoRow
              icon="clock"
              label="Time"
              value={matchDate.format("hh:mm A")}
              colors={colors}
            />
            <InfoRow
              icon="map-pin"
              label="Venue"
              value="To be announced"
              colors={colors}
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Reusable Components
const InfoRow = ({
  icon,
  label,
  value,
  colors,
  isLast = false,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  colors: any;
  isLast?: boolean;
}) => (
  <View
    style={[
      infoRowStyles.container,
      !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
    ]}
  >
    <View
      style={[
        infoRowStyles.iconContainer,
        { backgroundColor: `${colors.primary}10` },
      ]}
    >
      <Feather name={icon} size={18} color={colors.primary} />
    </View>
    <View style={infoRowStyles.textContainer}>
      <Text style={[infoRowStyles.label, { color: colors.textMuted }]}>
        {label}
      </Text>
      <Text style={[infoRowStyles.value, { color: colors.text }]}>{value}</Text>
    </View>
  </View>
);

const infoRowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

const TeamCard = ({
  teamName,
  score,
  colors,
  isHome = false,
}: {
  teamName: string;
  score: string | null;
  colors: any;
  isHome?: boolean;
}) => (
  <View
    style={[
      teamCardStyles.container,
      {
        backgroundColor: colors.card,
        borderColor: isHome ? colors.primary : colors.border,
        borderWidth: isHome ? 2 : 1,
      },
    ]}
  >
    {isHome && (
      <View
        style={[teamCardStyles.homeBadge, { backgroundColor: colors.primary }]}
      >
        <Text style={teamCardStyles.homeBadgeText}>HOME</Text>
      </View>
    )}
    <Text
      style={[teamCardStyles.teamName, { color: colors.text }]}
      numberOfLines={2}
    >
      {teamName}
    </Text>
    <View style={teamCardStyles.scoreContainer}>
      <Text
        style={[
          teamCardStyles.score,
          { color: score ? colors.text : colors.textMuted },
        ]}
      >
        {score !== null ? score : "-"}
      </Text>
    </View>
  </View>
);

const teamCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    position: "relative",
  },
  homeBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  homeBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  scoreContainer: {
    marginTop: 8,
  },
  score: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
  },
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  errorContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 28,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  headerContainer: {
    position: "relative",
    height: 280,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButtonHeader: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  matchTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  leagueBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 24,
  },
  leagueIcon: {
    marginRight: 8,
  },
  leagueText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  scoreSection: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -2,
  },
  teamsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  infoSection: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 20,
    letterSpacing: 0.2,
  },
});
