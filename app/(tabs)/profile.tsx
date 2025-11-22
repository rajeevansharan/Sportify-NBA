// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import { logoutUser } from '@/src/redux/slices/authSlice';

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const username = user?.firstName || user?.username || 'Guest';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="user" size={60} color={colors.primary} />
        <Text style={[styles.username, { color: colors.text }]}>{username}</Text>
        <Text style={[styles.memberSince, { color: colors.textMuted }]}>
          NBA Fan since 2023
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

        {/* --- Dark Mode Toggle (Bonus Feature) --- */}
        <View style={styles.settingItem}>
          <Feather name="moon" size={20} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.textMuted, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* --- Logout --- */}
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={colors.error} />
          <Text style={[styles.settingText, { color: colors.error }]}>Logout</Text>
          <Feather name="chevron-right" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  memberSince: {
    fontSize: 14,
    marginTop: 5,
  },
  section: {
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 5,
  }
});