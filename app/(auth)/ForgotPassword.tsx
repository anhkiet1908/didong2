import { Ionicons } from "@expo/vector-icons"; // Thêm icon cho đẹp (tùy chọn)
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Hàm tạo mã ngẫu nhiên 6 số
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSendOTP = async () => {
    // 1. Kiểm tra email hợp lệ
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Lỗi", "Vui lòng nhập đúng định dạng email");
      return;
    }

    setLoading(true);
    const otpCode = generateOTP();

    try {
      // 2. Cấu hình gửi mail
      const data = {
        service_id: "service_74sv32m",      // ✅ Đã điền sẵn Service ID của bạn
        template_id: "template_lcjp3x8", // 🔴 BẠN PHẢI DÁN TEMPLATE ID VÀO ĐÂY (VD: template_abc123)
        user_id: "nd985W6oGmhXrrHvT",      // 🔴 BẠN PHẢI DÁN PUBLIC KEY VÀO ĐÂY (VD: w8S_gT...)
        template_params: {
          to_email: email, // Biến này khớp với {{to_email}} trên web
          otp: otpCode,    // Biến này khớp với {{otp}} trên web
          name: "Bạn",     // Biến này khớp với {{name}} trên web
        },
      };

      // 3. Gọi API EmailJS
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // 4. Xử lý kết quả
      if (response.ok) {
        Alert.alert(
          "Thành công", 
          `Mã OTP đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư (cả mục Spam).`,
          [
            {
              text: "Nhập mã ngay",
              onPress: () => {
                // Chuyển sang trang nhập OTP, mang theo mã OTP thật để so sánh
                router.push({
                  pathname: "/(auth)/verify-otp",
                  params: { email: email, otp: otpCode },
                });
              }
            }
          ]
        );
      } else {
        // Nếu API trả về lỗi
        const errorText = await response.text();
        console.log("Lỗi EmailJS:", errorText);
        throw new Error("Gửi mail thất bại. Vui lòng kiểm tra lại Template ID hoặc Public Key.");
      }
    } catch (error) {
      console.log("Chi tiết lỗi:", error);
      Alert.alert("Lỗi kết nối", "Không thể gửi email lúc này. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Nút quay lại */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.subtitle}>Nhập email để nhận mã xác thực (OTP)</Text>

        <TextInput
          style={styles.input}
          placeholder="Ví dụ: name@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Gửi mã OTP</Text>
          )}
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container chính bao phủ toàn màn hình
  container: { 
    flex: 1, 
    backgroundColor: "white" 
  },
  
  // Phần nội dung bên trong
  content: { 
    flex: 1, 
    paddingHorizontal: 24, 
    paddingTop: 20, // Đẩy nội dung xuống một chút so với tai thỏ
  },

  // Nút quay lại (Back) - Làm đẹp thành hình vuông bo tròn
  backButton: { 
    width: 44,
    height: 44,
    backgroundColor: "#F3F4F6", // Màu nền xám nhẹ
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start", // Căn trái
    marginBottom: 40, // Cách xa tiêu đề một đoạn lớn
  },

  // Tiêu đề lớn
  title: { 
    fontSize: 32, 
    fontWeight: "800", // Chữ đậm hơn
    color: "#1A1A1A", 
    marginBottom: 10 
  },

  // Dòng mô tả nhỏ
  subtitle: { 
    fontSize: 16, 
    color: "#888", 
    marginBottom: 40, // Tạo khoảng cách thoáng với ô nhập liệu
    lineHeight: 24, // Tăng chiều cao dòng cho dễ đọc
  },

  // Ô nhập liệu (Input)
  input: { 
    width: "100%",
    height: 56, // Chiều cao cố định chuẩn UI mobile
    backgroundColor: "#F3F4F6", // Nền xám nhạt hiện đại
    borderRadius: 16, // Bo góc mềm mại
    paddingHorizontal: 20, 
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "transparent", // Mặc định không viền
    marginBottom: 24, 
  },

  // Nút bấm (Button)
  button: { 
    width: "100%",
    height: 56, // Cao bằng ô Input cho đồng bộ
    backgroundColor: "#FF8C00", // Màu cam
    borderRadius: 16, 
    justifyContent: "center",
    alignItems: "center",
    // Hiệu ứng bóng đổ nhẹ
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8, // Bóng đổ cho Android
  },

  // Chữ trong nút bấm
  btnText: { 
    color: "white", 
    fontWeight: "700", 
    fontSize: 18, // Chữ to rõ ràng hơn
  },
});