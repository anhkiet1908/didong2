import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function SettingScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Nút Back về Profile */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Khối chức năng chứa 3 mục */}
        <View style={styles.card}>
            
            {/* 1. CHẾ ĐỘ TỐI */}
            <View style={styles.item}>
                <View style={styles.itemLeft}>
                    <View style={[styles.iconBox, { backgroundColor: "#212121" }]}>
                        <Ionicons name="moon" size={18} color="#fff" />
                    </View>
                    <Text style={styles.itemText}>Chế độ tối</Text>
                </View>
                <Switch 
                    value={isDarkMode} 
                    onValueChange={setIsDarkMode} 
                    trackColor={{ false: "#E9E9EA", true: "#34C759" }}
                />
            </View>
            <View style={styles.separator} />

            {/* 2. NGÔN NGỮ */}
            <TouchableOpacity style={styles.item}>
                <View style={styles.itemLeft}>
                    <View style={[styles.iconBox, { backgroundColor: "#007AFF" }]}>
                        <Ionicons name="globe-outline" size={18} color="#fff" />
                    </View>
                    <Text style={styles.itemText}>Ngôn ngữ</Text>
                </View>
                <View style={styles.itemRight}>
                    <Text style={styles.valueText}>Tiếng Việt</Text>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </View>
            </TouchableOpacity>
            <View style={styles.separator} />

            {/* 3. BẢO MẬT */}
            <TouchableOpacity style={styles.item}>
                <View style={styles.itemLeft}>
                    <View style={[styles.iconBox, { backgroundColor: "#34C759" }]}>
                        <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
                    </View>
                    <Text style={styles.itemText}>Bảo mật & Quyền riêng tư</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

        </View>

        <Text style={styles.footerText}>Phiên bản 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F2F2F7" },
  
  header: { flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: "#F2F2F7" },
  backBtn: { marginRight: 15, padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },

  container: { padding: 20 },

  // Card chứa 3 item
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" },

  // Style cho từng dòng item
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 16 },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  itemRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemText: { fontSize: 16, fontWeight: "500", marginLeft: 12 },
  valueText: { fontSize: 15, color: "#8E8E93" },

  // Icon vuông bo góc
  iconBox: { width: 30, height: 30, borderRadius: 8, justifyContent: "center", alignItems: "center" },

  // Đường kẻ phân cách
  separator: { height: 1, backgroundColor: "#F2F2F7", marginLeft: 58 },

  footerText: { textAlign: "center", marginTop: 20, color: "#999", fontSize: 13 },
});