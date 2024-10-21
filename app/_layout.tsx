import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth, AuthProvider } from '../context/auth';

import Welcome from './index';
import { LoginScreen } from './login';
import dashboard from './dashboard';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { user } = useAuth();

  return (
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={dashboard} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
