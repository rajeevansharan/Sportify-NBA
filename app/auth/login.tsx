// app/auth/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRouter, useFocusEffect } from 'expo-router';
import { loginUser } from '@/src/redux/slices/authSlice';
import { useAppDispatch } from '@/src/redux/store';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/src/hooks/useAuth';

// 1. Define the Yup validation schema
const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

// 2. Define the exact type of the form values using yup.InferType
type LoginValues = yup.InferType<typeof loginSchema>;


export default function LoginScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  // Redirect if user somehow lands here while logged in
  useFocusEffect(React.useCallback(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]));

  // 3. Apply the derived type to the values parameter in handleLogin
  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    try {
      await dispatch(loginUser({ username: values.username, password: values.password })).unwrap();
      // On success, the root layout handles navigation to / (tabs)
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>🏀 Sportify NBA Login</Text>
      <Formik
        // 4. Apply the derived type to initialValues
        initialValues={{ username: 'emilys', password: 'emilyspass' } as LoginValues} // Demo Creds
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {/* The render prop uses inferred types */}
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
              placeholder="Username (emilys)"
              placeholderTextColor={colors.textMuted}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
            {touched.username && errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
              placeholder="Password (emilyspass)"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]}
              // FIX: Wrap handleSubmit in an arrow function to satisfy TypeScript's GestureResponderEvent type
              onPress={() => handleSubmit()} 
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('auth/register')}>
              <Text style={[styles.registerText, { color: colors.primary }]}>
                  Don&apos;t have an account? Register
              </Text>
            </TouchableOpacity>
            <Text style={[styles.tipText, { color: colors.textMuted }]}>
              Tip: Credentials are for demo purposes (emilys/emilyspass).
            </Text>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 40, textAlign: 'center' },
  form: { width: '100%' },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  errorText: { color: '#DC3545', marginBottom: 10, marginLeft: 5 },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: { 
    marginTop: 20, 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  tipText: { 
    marginTop: 10, 
    textAlign: 'center', 
    fontSize: 12, 
    fontStyle: 'italic' 
  }
});