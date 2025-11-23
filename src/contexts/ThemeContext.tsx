// Feature: Styling and UI
// src/contexts/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
// 1. Import both SecureStore and AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
// 2. Import Constants from Expo to check the platform
import Constants from "expo-constants";

import { DARK_THEME, LIGHT_THEME } from "@/src/constants/theme";
import { ThemeColors, ThemeName } from "@/src/types";

interface ThemeContextType {
  theme: ThemeName;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (newTheme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "userThemePreference";

// 3. Define Fallback Storage functions
// We use a function check because the web environment is the common culprit.
// We fall back to AsyncStorage if SecureStore isn't working.
const isSecureStoreAvailable = !Constants.manifest || !Constants.manifest.web;

const Storage = {
  // Determine the proper storage utility based on environment
  getStore: () => (isSecureStoreAvailable ? SecureStore : AsyncStorage),

  async getItem(key: string): Promise<string | null> {
    const store = Storage.getStore();
    if (store === SecureStore) {
      return await SecureStore.getItemAsync(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    const store = Storage.getStore();
    if (store === SecureStore) {
      // Check if function exists before calling (redundant with the logic above, but safer)
      if (SecureStore.setItemAsync) {
        await SecureStore.setItemAsync(key, value);
      }
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemTheme = useColorScheme() as ThemeName;
  const [userTheme, setUserTheme] = useState<ThemeName | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Load user preference from Storage (handles SecureStore/AsyncStorage fallback)
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await Storage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === "light" || storedTheme === "dark") {
          setUserTheme(storedTheme);
        } else {
          // Default to system theme if none stored
          setUserTheme(systemTheme);
        }
      } catch (e) {
        console.warn("Failed to load theme:", e);
        setUserTheme(systemTheme);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, [systemTheme]);

  const currentTheme: ThemeName = userTheme || systemTheme;

  const colors = useMemo(() => {
    return currentTheme === "dark" ? DARK_THEME : LIGHT_THEME;
  }, [currentTheme]);

  const setTheme = (newTheme: ThemeName) => {
    setUserTheme(newTheme);
    // Use the custom Storage object to save the preference
    Storage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const contextValue = useMemo(
    () => ({
      theme: currentTheme,
      colors,
      toggleTheme,
      setTheme,
    }),
    [currentTheme, colors]
  );

  if (!isReady) {
    // Simple splash screen while theme loads (important for avoiding flash)
    return <></>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
