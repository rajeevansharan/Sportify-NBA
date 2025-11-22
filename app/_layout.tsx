// app/_layout.tsx
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { useAuth } from "@/src/hooks/useAuth";
import { logoutUser, setAuthStatus } from "@/src/redux/slices/authSlice";
import { persistor, store, useAppDispatch } from "@/src/redux/store";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

function RootNavigator() {
  const { isLoading } = useAuth();
  const dispatch = useAppDispatch();

  // Always start app at login: clear any persisted auth token/user once per cold start.
  useEffect(() => {
    dispatch(logoutUser());
    dispatch(setAuthStatus("idle"));
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack initialRouteName="auth/login">
      {/* Main tabs (only meaningful after login) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Auth screens */}
      <Stack.Screen
        name="auth/login"
        options={{ title: "Login", headerShown: true }}
      />
      <Stack.Screen
        name="auth/register"
        options={{ title: "Register", headerShown: true }}
      />
      {/* Match details modal */}
      <Stack.Screen
        name="match/[id]"
        options={{ presentation: "modal", title: "Match Details" }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
