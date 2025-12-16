import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets(); // lấy khoảng trống notch

  const handleRegister = async () => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4`,
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
        console.log("Đăng ký thành công:", result.email);
        router.replace("/(auth)/login");
      } else {
        console.log("Lỗi đăng ký:", result.error?.message);
      }
    } catch (error) {
      console.log("Lỗi kết nối:", (error as any).message);
    }
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
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
            <Text style={styles.logoText}>🍕</Text>
          </View>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>Đăng ký để bắt đầu</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="gray"
                style={styles.iconLeft}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

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
                placeholder="Create a password"
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

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerText}>Sign Up</Text>
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

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.loginLink} onPress={handleLogin}>
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "gray",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  registerButton: {
    backgroundColor: "orange",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  registerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "gray",
    fontSize: 12,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    color: "gray",
  },
  loginLink: {
    color: "orange",
    fontWeight: "500",
  },
});