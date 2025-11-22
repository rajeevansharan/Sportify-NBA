// app/auth/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/contexts/ThemeContext';
import { authService } from '@/src/services/authService';

// 1. Define the Yup validation schema
const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required').min(4, 'Username must be at least 4 characters'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// 2. Define the exact type of the form values using yup.InferType
type RegisterValues = yup.InferType<typeof registerSchema>;

export default function RegisterScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 3. Apply the derived RegisterValues type to the values parameter
  const handleRegister = async (values: RegisterValues) => {
    setLoading(true);
    try {
      // NOTE: We only send username and password to the service
      const success = await authService.register(values.username, values.password);
      if (success) {
        Alert.alert('Registration Success', 'Your account has been created. Please log in.');
        router.replace('/auth/login');
      } else {
         Alert.alert('Registration Failed', 'Could not register user. Try again.');
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>🏀 Register for Sportify</Text>
      <Formik
        // 4. Apply the derived type to initialValues
        initialValues={{ username: '', password: '', confirmPassword: '' } as RegisterValues}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
              placeholder="Username"
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
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]}
              // 5. FIX: Wrap handleSubmit in an arrow function to resolve the GestureResponderEvent conflict
              onPress={() => handleSubmit()} 
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.loginText, { color: colors.primary }]}>
                  Already have an account? Login
              </Text>
            </TouchableOpacity>
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
  loginText: { 
    marginTop: 20, 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});