// app/auth/login.tsx
import { useTheme } from "@/src/contexts/ThemeContext";
import { loginUser } from "@/src/redux/slices/authSlice";
import { useAppDispatch } from "@/src/redux/store";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

type LoginValues = yup.InferType<typeof loginSchema>;

export default function LoginScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    console.log("Login attempt started with:", values.username);
    try {
      const result = await dispatch(
        loginUser({ username: values.username, password: values.password })
      ).unwrap();
      console.log("Login successful, user:", result);
      console.log("Attempting navigation to /");
      router.replace("/");
      console.log("Navigation completed");
    } catch (error: any) {
      console.error("Login failed with error:", error);
      Alert.alert(
        "Login Failed",
        error.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
      console.log("Login process completed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>🏀</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Sign in to continue to Sportify NBA
          </Text>
        </View>

        <Formik
          initialValues={{ username: "emilys", password: "emilyspass" } as LoginValues}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Username
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: touched.username && errors.username 
                        ? "#DC3545" 
                        : colors.border,
                      color: colors.text,
                      backgroundColor: colors.card,
                    },
                  ]}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.textMuted}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {touched.username && errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Password
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: touched.password && errors.password 
                        ? "#DC3545" 
                        : colors.border,
                      color: colors.text,
                      backgroundColor: colors.card,
                    },
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  autoCapitalize="none"
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.primary },
                  loading && styles.buttonDisabled,
                ]}
                onPress={() => handleSubmit()}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>
                  OR
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              <TouchableOpacity
                style={[styles.registerButton, { borderColor: colors.border }]}
                onPress={() => router.push("/auth/register")}
                activeOpacity={0.7}
              >
                <Text style={[styles.registerButtonText, { color: colors.primary }]}>
                  Create New Account
                </Text>
              </TouchableOpacity>

              <View style={styles.demoContainer}>
                <Text style={[styles.demoLabel, { color: colors.textMuted }]}>
                  Demo Credentials
                </Text>
                <Text style={[styles.demoText, { color: colors.textMuted }]}>
                  Username: emilys • Password: emilyspass
                </Text>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "#DC3545",
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 16,
    letterSpacing: 0.5,
  },
  registerButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  demoContainer: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.08)",
    alignItems: "center",
  },
  demoLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  demoText: {
    fontSize: 13,
    fontWeight: "500",
  },
});