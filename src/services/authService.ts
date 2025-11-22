// src/services/authService.ts

import { User } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_KEY = 'userAuthToken';
const DUMMY_AUTH_URL = 'https://dummyjson.com/auth';

export const authService = {
  // --------------------------------------------------
  // Secure Storage Functions
  // --------------------------------------------------

  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(AUTH_KEY);
    }
    return await SecureStore.getItemAsync(AUTH_KEY);
  },

  async setToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(AUTH_KEY, token);
    } else {
      await SecureStore.setItemAsync(AUTH_KEY, token);
    }
  },

  async removeToken(): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(AUTH_KEY);
    } else {
      await SecureStore.deleteItemAsync(AUTH_KEY);
    }
  },

  // --------------------------------------------------
  // LOGIN (REAL DummyJSON API)
  // --------------------------------------------------

  async login(username: string, password: string): Promise<User> {
    try {
      console.log(`Attempting login for: ${username}`);

      const response = await axios.post(`${DUMMY_AUTH_URL}/login`, {
        username,
        password,
        expiresInMins: 60, // correct field
      });

      console.log("Login Response:", response.data);

      // DummyJSON returns accessToken + refreshToken now
      const { accessToken, firstName } = response.data;

      if (!accessToken) {
        throw new Error("Login failed: No access token received.");
      }

      // Save the access token in secure storage
      await this.setToken(accessToken);

      return {
        token: accessToken,       // treat accessToken as token
        username: username,
        firstName: firstName || username,
      };

    } catch (error: any) {
      console.log("Login Error:", error.response?.data || error.message);

      throw new Error(
        error.response?.data?.message ||
        "Login failed. Check username/password or internet connection."
      );
    }
  },

  // --------------------------------------------------
  // REGISTER (Simulated, DummyJSON does NOT support real register)
  // --------------------------------------------------

  async register(username: string, password: string): Promise<User> {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    console.log(`Simulating registration for: ${username}`);

    // Generate fake token
    const mockToken = `mock_token_${username}_${Date.now()}`;

    // Save simulated token
    await this.setToken(mockToken);

    return {
      token: mockToken,
      username,
      firstName: username, // using username as mock firstName
    };
  }
};
