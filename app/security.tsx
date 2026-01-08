import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function SecurityScreen() {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bảo mật</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Đăng nhập</Text>
        <View style={styles.card}>
            
            {/* Sinh trắc học */}
            <View style={styles.item}>
                <View style={styles.textWrapper}>
                    <Text style={styles.itemText}>Face ID / Vân tay</Text>
                    <Text style={styles.subText}>Đăng nhập nhanh hơn</Text>
                </View>
                <Switch 
                    value={biometricEnabled} 
                    onValueChange={(val) => {
                        setBiometricEnabled(val);
                        if(val) Alert.alert("Thông báo", "Đã bật đăng nhập sinh trắc học");
                    }} 
                />
            </View>
            <View style={styles.separator} />

            {/* Đổi mật khẩu */}
            <TouchableOpacity style={styles.item} onPress={() => router.push("/(auth)/ForgotPassword")}>
                 <Text style={styles.itemText}>Đổi mật khẩu</Text>
                 <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Nâng cao</Text>
        <View style={styles.card}>
            {/* Xác thực 2 bước */}
            <View style={styles.item}>
                <View style={styles.textWrapper}>
                    <Text style={styles.itemText}>Xác thực 2 bước (2FA)</Text>
                    <Text style={styles.subText}>Gửi OTP về email khi đăng nhập lạ</Text>
                </View>
                <Switch 
                    value={twoFactorEnabled} 
                    onValueChange={setTwoFactorEnabled} 
                    trackColor={{ false: "#E9E9EA", true: "#34C759" }}
                />
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F2F2F7" },
  header: { flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: "#F2F2F7" },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  container: { padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#666", marginBottom: 8, marginLeft: 12, textTransform: "uppercase" },
  card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 24, overflow: "hidden" },
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 16 },
  textWrapper: { flex: 1 },
  itemText: { fontSize: 16, fontWeight: "500" },
  subText: { fontSize: 13, color: "gray", marginTop: 2 },
  separator: { height: 1, backgroundColor: "#F2F2F7", marginLeft: 16 },
});