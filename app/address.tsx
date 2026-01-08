import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const addresses = [
  {
    id: "1",
    title: "Nhà",
    detail: "123 Nguyễn Văn A, Quận 7, TP.HCM",
    default: true,
  },
  {
    id: "2",
    title: "Công ty",
    detail: "456 Lê Văn B, Quận 1, TP.HCM",
    default: false,
  },
];

export default function AddressScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.header}>Địa chỉ giao hàng</Text>

        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {item.title} {item.default && "(Mặc định)"}
                </Text>
                <Text style={styles.detail}>{item.detail}</Text>
              </View>
              <Ionicons name="ellipsis-vertical" size={18} color="gray" />
            </View>
          )}
        />

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addText}>Thêm địa chỉ mới</Text>
        </TouchableOpacity>
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

  title: {
    fontSize: 15,
    fontWeight: "600",
  },

  detail: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },

  addButton: {
    flexDirection: "row",
    backgroundColor: "orange",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  addText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
});
