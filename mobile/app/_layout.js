import '../global.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Legacy Locker' }} />
        <Stack.Screen name="(auth)" options={{ title: 'Authentication' }} />
        <Stack.Screen name="(tabs)" options={{ title: 'Home' }} />
        <Stack.Screen name="vaults" options={{ title: 'Vaults' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
