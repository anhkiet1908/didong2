import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Trạng thái ẩn/hiện pass
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Trạng thái ẩn/hiện confirm pass
  
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const handleReset = async () => {
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    Alert.alert(
      "Thành công", 
      "Mật khẩu của bạn đã được thay đổi! Hãy đăng nhập lại.",
      [
        { text: "Đăng nhập ngay", onPress: () => router.replace("/(auth)/login") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView giúp bàn phím không che mất nút khi nhập */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Nút Back */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Đặt lại mật khẩu</Text>
          <Text style={styles.subtitle}>
            Tạo mật khẩu mới cho tài khoản{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          {/* Mật khẩu mới */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.iconLeft} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nhập lại mật khẩu */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.iconLeft} />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#aaa"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconRight}>
                <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nút xác nhận */}
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.btnText}>Đổi mật khẩu</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "white" 
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  
  // Nút Back đồng bộ
  backButton: { 
    width: 44,
    height: 44,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 30,
  },

  // Typography
  title: { 
    fontSize: 30, 
    fontWeight: "800", 
    color: "#1A1A1A", 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 15, 
    color: "#888", 
    marginBottom: 40,
    lineHeight: 22,
  },
  emailText: {
    color: "#FF8C00",
    fontWeight: "600",
  },

  // Style cho form input
  inputGroup: {
    marginBottom: 24,
  },
  label: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#333", 
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6", // Nền xám
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: { 
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  iconLeft: {
    marginRight: 12,
  },
  iconRight: {
    padding: 8,
  },

  // Nút bấm chính
  button: { 
    width: "100%",
    height: 56,
    backgroundColor: "#FF8C00", 
    borderRadius: 16, 
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: { 
    color: "white", 
    fontWeight: "700", 
    fontSize: 18, 
  },
});