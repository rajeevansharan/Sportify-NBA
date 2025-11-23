// Feature: Navigation Structure
// app/_layout.tsx
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { persistor, store } from "@/src/redux/store";
import { Stack } from "expo-router";
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
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="auth/login"
        options={{ title: "Login", headerShown: true }}
      />
      <Stack.Screen
        name="auth/register"
        options={{ title: "Register", headerShown: true }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="match/[id]"
        options={{ presentation: "modal", title: "Match Details" }}
      />
    </Stack>
  );
}
