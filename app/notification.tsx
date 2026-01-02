import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const notifications = [
  "Đơn hàng #1023 đã được giao thành công 🎉",
  "Freeship cho đơn trên 100.000đ hôm nay!",
];

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.header}>Thông báo</Text>

        {notifications.map((text, index) => (
          <View key={index} style={styles.card}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color="orange"
            />
            <Text style={styles.text}>{text}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    paddingHorizontal: 14,
  },

  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 8,
  },

  text: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
    color: "#333",
  },
});
