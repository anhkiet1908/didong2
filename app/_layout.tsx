import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Cấu hình mặc định cho expo-router
export const unstable_settings = {
  initialRouteName: '(auth)/login', // mở login trước
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', // hiệu ứng chuyển màn hình
        }}
      >
        {/* Nhóm tab chính */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Nhóm auth (login/register) */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Modal */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}