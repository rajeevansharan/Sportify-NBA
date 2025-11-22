// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();

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
          title: 'Upcoming Matches',
          tabBarIcon: ({ color }) => <Feather name="calendar" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'My Favorites',
          tabBarIcon: ({ color }) => <Feather name="heart" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}