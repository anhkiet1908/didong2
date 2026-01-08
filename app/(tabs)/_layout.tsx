import { Ionicons } from '@expo/vector-icons'; // Dùng icon chuẩn có sẵn
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

export default function TabLayout() {
  // 1. Lấy chế độ màu (Sáng/Tối) trực tiếp từ React Native
  const colorScheme = useColorScheme();

  // 2. Tự định nghĩa màu sắc ngay tại đây (để không cần file theme bên ngoài)
  const activeColor = colorScheme === 'dark' ? '#fff' : '#007AFF'; // Màu khi đang chọn (Xanh hoặc Trắng)
  const inactiveColor = '#8E8E93'; // Màu khi không chọn (Xám)
  const bgColor = colorScheme === 'dark' ? '#000' : '#fff'; // Màu nền thanh menu

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false, // Ẩn header mặc định của Tab
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Trong suốt trên iOS
            backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          },
          default: {
            backgroundColor: bgColor,
          },
        }),
      }}>

      {/* --- CẤU HÌNH CÁC TAB --- */}

      {/* Tab 1: Trang chủ (File home.tsx) */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* Tab 2: Đơn hàng (File orders.tsx) */}
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "receipt" : "receipt-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* Tab 3: Giỏ hàng (File cart.tsx) */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "cart" : "cart-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* Tab 4: Hồ sơ (File profile.tsx) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* Ẩn file _layout ra khỏi menu */}
      <Tabs.Screen
        name="_layout"
        options={{ href: null }}
      />
    </Tabs>
  );
}