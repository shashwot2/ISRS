import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: 'albums' | 'albums-outline' | 'person' | 'person-outline' | undefined;
          if (route.name === 'deckselection') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="deckselection" options={{ title: 'Deck Selection', headerShown: false }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' , headerShown: false}} />
    </Tabs>
  );
}
