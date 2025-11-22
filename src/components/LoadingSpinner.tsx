// src/components/LoadingSpinner.tsx
import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading data...' }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={[styles.text, { color: colors.text }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoadingSpinner;