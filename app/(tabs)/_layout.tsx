// app/(tabs)/_layout.tsx
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuth } from "@/src/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

export default function TabLayout() {
  const { colors } = useTheme();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Upcoming Matches",
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="Standings"
        options={{
          title: "Standings",
          tabBarIcon: ({ color }) => (
            <Feather name="list" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "My Favorites",
          tabBarIcon: ({ color }) => (
            <Feather name="heart" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
