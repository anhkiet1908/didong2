import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
<<<<<<< HEAD
import { CartProvider } from "../components/ui/CartContext";
import Toast from "react-native-toast-message"; // ✅ import Toast
=======
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40

import { useColorScheme } from '@/hooks/use-color-scheme';

// Cấu hình mặc định cho expo-router
export const unstable_settings = {
  initialRouteName: '(auth)/login', // mở login trước
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
<<<<<<< HEAD
    <CartProvider>
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

        {/* ✅ Toast đặt ở đây để toàn app dùng được */}
        <Toast />
      </ThemeProvider>
    </CartProvider>
=======
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
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
  );
}