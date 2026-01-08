import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
<<<<<<< HEAD
import React from 'react';
import { useColorScheme } from 'react-native'; // <--- QUAN TRỌNG: Dùng cái này thay vì file bị thiếu
import 'react-native-reanimated';
import Toast from "react-native-toast-message";

// Giả sử 2 file Context này bạn đã tạo rồi (nếu chưa có sẽ báo lỗi tiếp)
import { AuthProvider } from "../components/ui/AuthContext";
import { CartProvider } from "../components/ui/CartContext";

// Cấu hình mặc định cho expo-router
export const unstable_settings = {
  initialRouteName: '(auth)/login', // Mở màn hình login đầu tiên
};

export default function RootLayout() {
  // Lấy chế độ màu từ React Native chuẩn
  const colorScheme = useColorScheme();

  return (
    // Bọc AuthProvider ngoài cùng để quản lý đăng nhập
    <AuthProvider>
      {/* Bọc CartProvider để quản lý giỏ hàng */}
      <CartProvider>
        
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right', // Hiệu ứng lướt từ phải sang
            }}
          >
            {/* 1. Nhóm Auth (Login, Register...) */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            {/* 2. Nhóm Tab chính (Home, Cart, Profile...) */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* 3. Các màn hình lẻ khác */}
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="setting" />
            <Stack.Screen name="chat-ai" />
            <Stack.Screen name="restaurant-detail/[id]" />
            <Stack.Screen name="payment" />
            
            {/* Xử lý màn hình không tìm thấy */}
            <Stack.Screen name="+not-found" />
          </Stack>

          {/* Thanh trạng thái pin/sóng */}
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

          {/* Thông báo Toast (Đặt cuối cùng để đè lên tất cả) */}
          <Toast />
        </ThemeProvider>

      </CartProvider>
    </AuthProvider>
=======
import 'react-native-reanimated';
import { CartProvider } from "../components/ui/CartContext";
import Toast from "react-native-toast-message"; // ✅ import Toast

import { useColorScheme } from '@/hooks/use-color-scheme';

// Cấu hình mặc định cho expo-router
export const unstable_settings = {
  initialRouteName: '(auth)/login', // mở login trước
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
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
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
  );
}