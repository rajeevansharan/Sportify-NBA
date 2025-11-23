// Feature: Styling and UI
// src/constants/theme.ts
import { ThemeColors } from '@/src/types';

export const LIGHT_THEME: ThemeColors = {
  primary: '#007AFF', // NBA Blue
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textMuted: '#6C757D',
  border: '#E0E0E0',
  success: '#28A745',
  error: '#DC3545',
};

export const DARK_THEME: ThemeColors = {
  primary: '#1E90FF', // Brighter NBA Blue for contrast
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textMuted: '#A0A0A0',
  border: '#333333',
  success: '#3CB371',
  error: '#FF6347',
};