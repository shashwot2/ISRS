import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        // configures tab bar icons based on route and focus state
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: 'albums' | 'albums-outline' | 'person' | 'person-outline' | undefined;
          
          // sets deck selection tab icons
          if (route.name === 'deckselection') {
            iconName = focused ? 'albums' : 'albums-outline';
          } 
          // sets profile tab icons
          else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // defines tab colors for active and inactive states
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* deck selection tab screen */}
      <Tabs.Screen name="deckselection" options={{ title: 'Deck Selection', headerShown: false }} />
      
      {/* profile tab screen */}
      <Tabs.Screen name="profile" options={{ title: 'Profile' , headerShown: false}} />
    </Tabs>
  );
}