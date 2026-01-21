import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../components/ui/AuthContext";

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, login } = useAuth();
  
  // API Key Firebase của bạn
  const API_KEY = "AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4"; 

  // --- STATE QUẢN LÝ ---
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // State thông tin update
  const [newName, setNewName] = useState("");
  
  // State mật khẩu
  const [oldPassword, setOldPassword] = useState(""); 
  const [newPassword, setNewNamePassword] = useState(""); 
  
  // State ẩn/hiện mật khẩu
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // State Logic xác thực
  const [isVerified, setIsVerified] = useState(false); // Đã check pass cũ đúng chưa?
  const [verifying, setVerifying] = useState(false);   // Đang check pass cũ?

  // --- HÀM 1: ĐĂNG XUẤT ---
  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { 
        text: "Đăng xuất", 
        style: "destructive", 
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        } 
      }
    ]);
  };

  // --- HÀM 2: MỞ MODAL & RESET STATE ---
  const openEditModal = () => {
      setNewName(user?.name || "");
      setNewNamePassword(""); 
      setOldPassword("");
      setIsVerified(false); // Reset trạng thái xác thực
      setShowOldPassword(false);
      setShowNewPassword(false);
      setModalVisible(true);
  };

  // --- HÀM 3: XÁC THỰC MẬT KHẨU CŨ ---
  const handleVerifyOldPassword = async () => {
    if (!oldPassword) {
        Alert.alert("Lỗi", "Vui lòng nhập mật khẩu hiện tại.");
        return;
    }

    setVerifying(true);
    try {
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user?.email,
                    password: oldPassword,
                    returnSecureToken: true
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            Alert.alert("Sai mật khẩu", "Mật khẩu hiện tại không đúng.");
            setIsVerified(false);
        } else {
            setIsVerified(true);
            // Alert.alert("Thành công", "Mật khẩu chính xác. Bạn có thể nhập mật khẩu mới.");
        }
    } catch (error) {
        Alert.alert("Lỗi", "Lỗi kết nối mạng, vui lòng thử lại.");
    } finally {
        setVerifying(false);
    }
  };

  // --- HÀM 4: CẬP NHẬT PROFILE LÊN SERVER ---
  const handleUpdateProfile = async () => {
    // 1. Validate Tên
    if (!newName.trim()) {
      Alert.alert("Lỗi", "Tên hiển thị không được để trống");
      return;
    }

    // 2. Validate Logic Mật khẩu
    // Nếu có nhập mật khẩu mới thì BẮT BUỘC phải đã Verify mật khẩu cũ
    if (newPassword.length > 0) {
        if (!isVerified) {
             Alert.alert("Lỗi", "Vui lòng xác nhận mật khẩu cũ trước khi đổi.");
             return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }
    }

    setLoading(true);
    try {
      const payload: any = {
        idToken: user?.token, 
        displayName: newName,
        returnSecureToken: true,
      };

      // Chỉ gửi password mới khi đã verify OK
      if (newPassword.length > 0 && isVerified) {
        payload.password = newPassword;
      }

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Cập nhật Context
      if (user) {
        const updatedUser = {
            ...user,
            name: result.displayName, 
            token: result.idToken, 
        };
        login(updatedUser); 
      }

      Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
      setModalVisible(false);

    } catch (error: any) {
      console.log("Update Error:", error);
      Alert.alert("Lỗi", "Không thể cập nhật. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ Sơ Của Bạn</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userInfoCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name || "Người dùng"}</Text>
            <Text style={styles.userEmail}>{user?.email || "Chưa đăng nhập"}</Text>
            
            <TouchableOpacity style={styles.editBtn} onPress={openEditModal}>
              <Text style={styles.editBtnText}>Chỉnh sửa thông tin</Text>
              <Ionicons name="create-outline" size={16} color="#FF6B00" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$420</Text>
            <Text style={styles.statLabel}>Chi tiêu</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <MenuItem icon="location-outline" label="Địa chỉ giao hàng" onPress={() => router.push("/address")} />
          <MenuItem icon="card-outline" label="Phương thức thanh toán" onPress={() => router.push("/payment")} />
          <MenuItem icon="heart-outline" label="Nhà hàng yêu thích" onPress={() => router.push("/favorite")} />

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Cài đặt & Hỗ trợ</Text>
          <MenuItem icon="notifications-outline" label="Thông báo" onPress={() => router.push("/notification")} />
          <MenuItem icon="help-circle-outline" label="Trợ giúp & Hỗ trợ" onPress={() => router.push("/help")} />
          <MenuItem icon="settings-outline" label="Cài đặt chung" onPress={() => router.push("/setting")} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Phiên bản 1.0.0</Text>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Cập nhật hồ sơ</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={{marginBottom: 16}}>
                            <Text style={styles.inputLabel}>Tên hiển thị</Text>
                            <TextInput 
                                style={styles.input}
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="Nhập tên mới..."
                            />
                        </View>
                        
                        <View style={{height: 1, backgroundColor: '#EEE', marginVertical: 10}} />
                        <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FF6B00', marginBottom: 10}}>
                            Đổi mật khẩu (Tùy chọn)
                        </Text>

                         <View style={{marginBottom: 16}}>
                            <Text style={styles.inputLabel}>
                                1. Mật khẩu hiện tại <Text style={{color:'red'}}>*</Text>
                                {isVerified && <Text style={{color: 'green', fontWeight: 'bold'}}> (Đã xác thực)</Text>}
                            </Text>
                            
                            <View style={[styles.passwordContainer, isVerified && {borderColor: '#4CAF50', backgroundColor: '#F1F8E9'}]}>
                                <TextInput 
                                    style={styles.passwordInput}
                                    value={oldPassword}
                                    onChangeText={(text) => {
                                        setOldPassword(text);
                                        setIsVerified(false); // Nếu sửa pass cũ thì reset verify
                                    }}
                                    placeholder="Nhập mật khẩu đang dùng..."
                                    secureTextEntry={!showOldPassword}
                                />
                                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showOldPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                                </TouchableOpacity>
                            </View>

                            {!isVerified && oldPassword.length > 0 && (
                                <TouchableOpacity 
                                    style={styles.verifyBtn} 
                                    onPress={handleVerifyOldPassword}
                                    disabled={verifying}
                                >
                                    {verifying ? (
                                        <ActivityIndicator size="small" color="#FFF"/>
                                    ) : (
                                        <Text style={styles.verifyBtnText}>Xác thực mật khẩu</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={{marginBottom: 16, opacity: isVerified ? 1 : 0.5}}>
                            <Text style={styles.inputLabel}>
                                2. Mật khẩu mới {isVerified ? "" : "(Bị khóa - Cần xác thực ở trên)"}
                            </Text>
                            <View style={[styles.passwordContainer, !isVerified && {backgroundColor: '#EEE'}]}>
                                <TextInput 
                                    style={styles.passwordInput}
                                    value={newPassword}
                                    onChangeText={setNewNamePassword}
                                    placeholder={isVerified ? "Nhập mật khẩu mới (min 6 ký tự)" : "Hãy xác thực mật khẩu cũ trước"}
                                    secureTextEntry={!showNewPassword}
                                    editable={isVerified} // 🔥 KHÓA Ô NÀY NẾU CHƯA VERIFY
                                />
                                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showNewPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{marginBottom: 20}}>
                            <Text style={styles.inputLabel}>Email (Không thể sửa)</Text>
                            <TextInput 
                                style={[styles.input, {backgroundColor: '#f0f0f0', color: '#888'}]}
                                value={user?.email}
                                editable={false}
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.saveBtn} 
                            onPress={handleUpdateProfile}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#555" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#CCC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F8" },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },

  userInfoCard: { flexDirection: "row", backgroundColor: "#fff", margin: 16, padding: 16, borderRadius: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#FF6B00", justifyContent: "center", alignItems: "center", marginRight: 16 },
  avatarText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  userName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  userEmail: { color: "#888", fontSize: 13, marginTop: 2 },
  editBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 6, backgroundColor: '#FFF0E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  editBtnText: { color: "#FF6B00", fontSize: 12, fontWeight: "600", marginRight: 4 },

  statsContainer: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 16, paddingVertical: 16, justifyContent: "space-around", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  statItem: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#FF6B00" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 4 },
  verticalLine: { width: 1, height: 30, backgroundColor: "#EEE" },

  menuContainer: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 12, marginLeft: 4 },
  menuItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#F5F5F5" },
  iconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#F5F5F8", justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "500", color: "#333" },

  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FFE5E5", marginHorizontal: 16, marginTop: 30, paddingVertical: 14, borderRadius: 12 },
  logoutText: { color: "#FF3B30", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
  version: { textAlign: "center", color: "#AAA", fontSize: 12, marginTop: 20, marginBottom: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F8', borderRadius: 12, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#eee', color: '#333' },
  
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F8', borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  passwordInput: { flex: 1, padding: 14, fontSize: 16, color: '#333' },
  eyeIcon: { padding: 14 },

  saveBtn: { backgroundColor: '#FF6B00', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10, shadowColor: "#FF6B00", shadowOpacity: 0.3, shadowOffset: {width: 0, height: 4}, elevation: 5 },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  verifyBtn: { alignSelf: 'flex-end', backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginTop: 8 },
  verifyBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' }
});