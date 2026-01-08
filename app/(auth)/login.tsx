import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../components/ui/AuthContext"; // ✅ dùng AuthContext để lưu user

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const result = await response.json();

      if (result.idToken) {
        // ✅ Lưu thông tin user vào context
        login({
          id: result.localId,
          email: result.email,
          name: result.displayName || "Người dùng",
        });

        console.log("Đăng nhập thành công:", result.email);

        // ✅ HIỂN THỊ THÔNG BÁO THÀNH CÔNG
        Alert.alert(
          "Thành công", // Tiêu đề
          "Đăng nhập thành công! Chào mừng bạn quay trở lại.", // Nội dung
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)/home"), // Chuyển trang khi bấm OK
            },
          ]
        );
      } else {
        // ... (Giữ nguyên phần xử lý lỗi cũ của bạn)
        const errorCode = result.error?.message;
        switch (errorCode) {
          case "EMAIL_NOT_FOUND":
            setErrorMessage("Email này chưa được đăng ký");
            break;
          case "INVALID_PASSWORD":
            setErrorMessage("Bạn nhập sai mật khẩu");
            break;
          case "INVALID_EMAIL":
            setErrorMessage("Định dạng email không hợp lệ");
            break;
          case "USER_DISABLED":
            setErrorMessage("Tài khoản này đã bị vô hiệu hóa");
            break;
          default:
            setErrorMessage("Đăng nhập thất bại, vui lòng thử lại");
        }
        // Thêm Alert báo lỗi (nếu muốn người dùng chú ý hơn)
        Alert.alert("Lỗi", "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      setErrorMessage("Lỗi kết nối, vui lòng kiểm tra mạng");
      Alert.alert("Lỗi mạng", "Không thể kết nối đến máy chủ.");
    }
  };
  const handleSignUp = () => {
    router.push("/(auth)/register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        contentInsetAdjustmentBehavior="never"
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🍔</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="gray"
                style={styles.iconLeft}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="gray"
                style={styles.iconLeft}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.iconRight}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hiển thị lỗi nếu có */}
          {errorMessage ? (
            <Text style={{ color: "red", marginTop: 10 }}>{errorMessage}</Text>
          ) : null}
{/* Code chèn vào Login.tsx */}
<View style={{ alignItems: "flex-end", marginBottom: 20 }}>
  <TouchableOpacity onPress={() => router.push("/(auth)/ForgotPassword")}>
    <Text style={{ color: "orange", fontWeight: "600" }}>Quên mật khẩu?</Text>
  </TouchableOpacity>
</View>
          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          {/* Social Login */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={20} color="black" />
              <Text>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.signUp} onPress={handleSignUp}>
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9fafb" },
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: { alignItems: "center", marginBottom: 20 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  
  logoText: { fontSize: 28 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "gray", marginTop: 4 },
  form: { paddingHorizontal: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: { flex: 1, padding: 10 },
  iconLeft: { marginRight: 8 },
  iconRight: { padding: 8 },
  loginButton: {
    backgroundColor: "orange",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  loginText: { color: "white", textAlign: "center", fontWeight: "600" },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#ddd" },
  dividerText: { marginHorizontal: 8, color: "gray" },
  socialRow: { flexDirection: "row", justifyContent: "space-around" },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
  },
  footer: { alignItems: "center", marginTop: 20 },
  footerText: { color: "gray" },
  signUp: { color: "orange", fontWeight: "600" },
});