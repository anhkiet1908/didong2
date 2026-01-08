import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function VerifyOtp() {
  const { email, otp } = useLocalSearchParams();
  const [inputCode, setInputCode] = useState("");
  const router = useRouter();

  const handleVerify = () => {
    if (inputCode === otp) {
      Alert.alert("Thành công", "Mã xác thực chính xác!");
      router.replace({
        pathname: "/(auth)/reset-password",
        params: { email: email }
      });
    } else {
      Alert.alert("Lỗi", "Mã OTP không đúng. Vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Nút Quay lại (Thêm vào cho đồng bộ) */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Xác thực OTP</Text>
        <Text style={styles.subtitle}>
          Mã xác thực 6 số đã được gửi tới email{"\n"}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="- - - - - -"
            placeholderTextColor="#ccc"
            value={inputCode}
            onChangeText={setInputCode}
            keyboardType="numeric"
            maxLength={6}
            autoFocus={true} // Tự động bật bàn phím
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.btnText}>Xác nhận</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.resendContainer}>
            <Text style={styles.resendText}>Không nhận được mã? <Text style={styles.resendLink}>Gửi lại</Text></Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "white" 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 24, 
    paddingTop: 20,
  },
  // Nút Back
  backButton: { 
    width: 44,
    height: 44,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 40,
  },
  // Tiêu đề
  title: { 
    fontSize: 32, 
    fontWeight: "800", 
    color: "#1A1A1A", 
    marginBottom: 10 
  },
  // Mô tả
  subtitle: { 
    fontSize: 16, 
    color: "#888", 
    marginBottom: 40,
    lineHeight: 24,
  },
  // Làm nổi bật email
  emailText: {
    color: "#FF8C00",
    fontWeight: "600",
  },
  
  // Container bao quanh input để căn chỉnh
  inputContainer: {
    marginBottom: 32,
  },
  // Input OTP đặc biệt
  input: { 
    width: "100%",
    height: 80, // Cao hơn bình thường để số to rõ
    backgroundColor: "#F3F4F6", 
    borderRadius: 16, 
    fontSize: 36, // Cỡ chữ rất to
    fontWeight: "bold",
    textAlign: "center", // Căn giữa
    letterSpacing: 10, // Khoảng cách giữa các số rộng ra
    color: "#333",
  },

  // Nút bấm
  button: { 
    width: "100%",
    height: 56,
    backgroundColor: "#FF8C00", 
    borderRadius: 16, 
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: { 
    color: "white", 
    fontWeight: "700", 
    fontSize: 18, 
  },
  
  // Phần gửi lại mã
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    color: "gray",
    fontSize: 14,
  },
  resendLink: {
    color: "#FF8C00",
    fontWeight: "bold",
  }
});