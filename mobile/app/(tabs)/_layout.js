import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        headerShown: true,
        tabBarActiveTintColor: '#0d9488',
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Vaults',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🗄️</Text>,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>👥</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
