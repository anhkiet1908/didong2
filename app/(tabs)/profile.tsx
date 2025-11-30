import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
router.replace("/(auth)/login");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@email.com</Text>
          <TouchableOpacity>
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>$420</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <MenuItem icon="location-outline" label="Address" description="Manage your delivery addresses" />
        <MenuItem icon="card-outline" label="Payment Methods" description="Add or edit payment methods" />
        <MenuItem icon="heart-outline" label="Favorites" description="Your favorite restaurants" />
        <MenuItem icon="notifications-outline" label="Notifications" description="Manage notification settings" />
        <MenuItem icon="help-circle-outline" label="Help & Support" description="Get help with your orders" />
        <MenuItem icon="settings-outline" label="Settings" description="App preferences and settings" />
      </View>

      {/* Logout Button */}
      <View style={styles.logout}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="red" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

function MenuItem({ icon, label, description }: { icon: any; label: string; description: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
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
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: { backgroundColor: "white", padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  userInfo: { flexDirection: "row", backgroundColor: "white", padding: 16, alignItems: "center" },
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
  version: { textAlign: "center", color: "gray", fontSize: 12, marginBottom: 16 },
});