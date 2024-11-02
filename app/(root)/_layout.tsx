import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/auth';
import { LanguageLearningProvider } from './languagecontext';
import { Text } from 'react-native';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <LanguageLearningProvider>
      <Stack>
        <Stack.Screen name="language" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </LanguageLearningProvider>
  );
}