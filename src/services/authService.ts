// src/services/authService.ts
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { User } from '@/src/types';

const AUTH_KEY = 'userAuthToken';
const DUMMY_AUTH_URL = 'https://dummyjson.com/auth';

export const authService = {
  // --- Secure Storage ---
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(AUTH_KEY);
  },

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(AUTH_KEY, token);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_KEY);
  },

  // --- Dummy Login/Register API Call ---
  async login(username: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${DUMMY_AUTH_URL}/login`, {
        username,
        password,
        expiresIn: '60m',
      });

      const { token, firstName } = response.data;
      if (token) {
        await this.setToken(token);
        return { token, firstName, username };
      }
      throw new Error('Authentication failed: No token received.');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to connect to login service. Check network/credentials.');
    }
  },

  async register(username: string, password: string): Promise<boolean> {
      // Dummy API for registration: always returns success
      if (username && password) {
         console.log(`Simulating successful registration for ${username}`);
         return true;
      }
      return false;
  }
};