import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../components/ui/AuthContext"; // ✅ lấy user từ context

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        contentInsetAdjustmentBehavior="never"
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>Hồ Sơ</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.substring(0, 2).toUpperCase() || "??"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name || "Chưa có tên"}</Text>
            <Text style={styles.userEmail}>{user?.email || "Chưa có email"}</Text>
            <TouchableOpacity>
              <Text style={styles.editProfile}>Chỉnh sửa hồ sơ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$420</Text>
            <Text style={styles.statLabel}>Đã chi</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
        <MenuItem
  icon="location-outline"
  label="Địa chỉ"
  description="Quản lý địa chỉ giao hàng của bạn"
  onPress={() => router.push("/address")}
/>

<MenuItem
  icon="card-outline"
  label="Phương thức thanh toán"
  description="Thêm hoặc chỉnh sửa phương thức thanh toán"
  onPress={() => router.push("/payment")}
/>

<MenuItem
  icon="heart-outline"
  label="Yêu thích"
  description="Những nhà hàng yêu thích của bạn"
  onPress={() => router.push("/favorite")}
/>

<MenuItem
  icon="notifications-outline"
  label="Thông báo"
  description="Quản lý cài đặt thông báo"
  onPress={() => router.push("/notification")}
/>

<MenuItem
  icon="help-circle-outline"
  label="Trợ giúp & Hỗ trợ"
  description="Nhận trợ giúp về đơn hàng của bạn"
  onPress={() => router.push("/help")}
/>

<MenuItem
  icon="settings-outline"
  label="Cài đặt"
  description="Tùy chọn và cài đặt ứng dụng"
  onPress={() => router.push("/setting")}
/>

        </View>

        {/* Logout Button */}
        <View style={styles.logout}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="red" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  description,
  onPress,
}: {
  icon: any;
  label: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={22} color="orange" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="gray" />
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9fafb" },
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  userInfo: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: { color: "white", fontSize: 20, fontWeight: "700" },
  userName: { fontSize: 18, fontWeight: "600" },
  userEmail: { color: "gray", marginBottom: 4 },
  editProfile: { color: "orange", fontSize: 14 },
  stats: { flexDirection: "row", backgroundColor: "white", marginTop: 8 },
  statItem: { flex: 1, alignItems: "center", padding: 16 },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#eee" },
  statValue: { fontSize: 20, color: "orange", fontWeight: "600" },
  statLabel: { color: "gray", fontSize: 12 },
  menu: { padding: 16 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#fff3e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuLabel: { fontSize: 16, fontWeight: "500" },
  menuDescription: { fontSize: 12, color: "gray" },
  logout: { padding: 16 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
  },
  logoutText: { color: "red", marginLeft: 8, fontSize: 16 },
  version: {
    textAlign: "center",
    color: "gray",
    fontSize: 12,
    marginBottom: 16,
  },
});