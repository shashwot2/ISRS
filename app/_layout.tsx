import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="(root)" />
        </>
      ) : 
        <>
          <Stack.Screen name="sign-in" />
        </>
}
    </Stack>
  );
}
