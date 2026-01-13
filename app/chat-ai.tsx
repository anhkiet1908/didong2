import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

/* ================= 1. CẤU HÌNH API ================= */

const GEMINI_API_KEY = "AIzaSyD7KRDdMC9TmB-5wypYjQDU1XHmOK3GL9Y"; 

// 🔥 URL CỦA 2 BẢNG DỮ LIỆU
const URL_RESTAURANTS = "https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/restaurants?key=AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4";
const URL_PRODUCTS = "https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/product?key=AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4";

interface IMessage { id: string; text: string; sender: 'user' | 'bot'; }

export default function ChatAIScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<IMessage>>(null);
  
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);
  
  const [dataContext, setDataContext] = useState<string>("Đang tải dữ liệu...");
const [activeModel, setActiveModel] = useState<string>("gemini-1.5-flash");
  /* ================= 2. HÀM XỬ LÝ DỮ LIỆU THÔNG MINH ================= */
  const buildAIContext = (restaurants: any, products: any) => {
    try {
      let text = "DỮ LIỆU HỆ THỐNG:\n";

      // 1. Xử lý danh sách Nhà hàng
      if (restaurants.documents) {
        text += "--- DANH SÁCH NHÀ HÀNG ---\n";
        restaurants.documents.forEach((doc: any) => {
          const f = doc.fields;
          const id = doc.name.split("/").pop(); 
          const name = f.name?.stringValue || "Chưa có tên";
          const addr = f.address?.stringValue || "TP.HCM"; 
          text += `🆔 ID Quán: ${id}\n🏠 Tên: ${name}\n📍 Đ/c: ${addr}\n\n`;
        });
      }

      // 2. Xử lý danh sách Món ăn
      if (products.documents) {
        text += "--- DANH SÁCH MÓN ĂN ---\n";
        products.documents.forEach((doc: any) => {
          const f = doc.fields;
          const name = f.name?.stringValue || "Món lạ";
          const price = f.price?.doubleValue || f.price?.integerValue || "0";
          const desc = f.description?.stringValue || "Ngon tuyệt";
          const restId = f.restaurantId?.stringValue || ""; 
          
          text += `🍔 Món: ${name} - Giá: $${price}\n📝 Mô tả: ${desc}\n🔗 Thuộc ID Quán: ${restId}\n\n`;
        });
      }

      return text;
    } catch (error) {
      return "Lỗi dữ liệu.";
    }
  };

  /* ================= 3. LOAD DỮ LIỆU & LỊCH SỬ CHAT ================= */
  useEffect(() => {
    const initSystem = async () => {
      // A. Tìm model Gemini
      try {
        const modelRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        const modelData = await modelRes.json();
        if (modelData.models) {
            const chosen = modelData.models.find((m: any) => m.name.includes("flash"))?.name || "gemini-1.5-flash";
            setActiveModel(chosen);
        }
      } catch (e) {}

      // B. Load Lịch sử Chat cũ từ máy (🔥 QUAN TRỌNG)
      try {
        const storedHistory = await AsyncStorage.getItem("chat_history");
        if (storedHistory) {
            setMessages(JSON.parse(storedHistory));
        } else {
            setMessages([{ id: "1", sender: "bot", text: "🤖 Chào bạn! Bạn muốn tìm món gì? (Ví dụ: Pizza, Burger...)" }]);
        }
      } catch (e) {}

      // C. Lấy dữ liệu API
      try {
        const [resRest, resProd] = await Promise.all([
            fetch(URL_RESTAURANTS).then(r => r.json()),
            fetch(URL_PRODUCTS).then(r => r.json())
        ]);
        const fullContext = buildAIContext(resRest, resProd);
        setDataContext(fullContext);
      } catch (e) {
        setDataContext("Lỗi kết nối database.");
      }
    };

    initSystem();
  }, []);

  // 🔥 TỰ ĐỘNG LƯU TIN NHẮN KHI CÓ THAY ĐỔI
  useEffect(() => {
      if (messages.length > 0) {
          AsyncStorage.setItem("chat_history", JSON.stringify(messages));
      }
  }, [messages]);

  /* ================= 4. GỌI API GEMINI ================= */
  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    if (!activeModel) return "⚠️ Đang khởi động não bộ AI...";

    const modelName = activeModel.startsWith("models/") ? activeModel : `models/${activeModel}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

    const FINAL_PROMPT = `
    Bạn là AI tư vấn ẩm thực FoodApp.
    
    DỮ LIỆU THỰC TẾ:
    =========================================
    ${dataContext}
    =========================================

    Quy tắc:
    1. Tìm món trong "DANH SÁCH MÓN ĂN".
    2. Xem "Thuộc ID Quán" để tìm tên/địa chỉ trong "DANH SÁCH NHÀ HÀNG".
    3. Trả lời: "Món [Tên] giá [Giá] tại quán [Tên Quán] ([Địa chỉ])".
    4. Dùng emoji.

    Khách hỏi: ${userMessage}
    `;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: FINAL_PROMPT }] }] }),
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI đang suy nghĩ...";
    } catch (error) {
      return "⚠️ Lỗi mạng rồi.";
    }
  };

  /* ================= 5. GỬI TIN NHẮN ================= */
  const sendMessage = async () => {
    if (!input.trim()) return;
    const msgText = input;
    
    // 1. Hiện tin nhắn user ngay lập tức
    const newMsgUser: IMessage = { id: Date.now().toString(), sender: "user", text: msgText };
    setMessages(prev => [...prev, newMsgUser]);
    setInput("");
    setTyping(true);

    // 2. Gọi AI
    const reply = await callGeminiAPI(msgText);

    // 3. Hiện tin nhắn bot
    const newMsgBot: IMessage = { id: (Date.now()+1).toString(), sender: "bot", text: reply };
    setMessages(prev => [...prev, newMsgBot]);
    setTyping(false);
  };

  // Hàm xóa lịch sử chat
  const clearHistory = async () => {
      Alert.alert("Xóa lịch sử", "Bạn có chắc muốn xóa hết tin nhắn không?", [
          { text: "Hủy", style: "cancel" },
          { 
              text: "Xóa", 
              style: "destructive", 
              onPress: async () => {
                  setMessages([{ id: Date.now().toString(), sender: "bot", text: "Đã xóa lịch sử. Chúng ta bắt đầu lại nhé! 🤖" }]);
                  await AsyncStorage.removeItem("chat_history");
              }
          }
      ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Trợ lý Ẩm Thực 👩‍🍳</Text>
              <Text style={{fontSize: 10, color: 'green'}}>
                 {dataContext.length > 50 ? "✅ Đã kết nối dữ liệu" : "⏳ Đang tải..."}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {typing && <ActivityIndicator size="small" color="#f97316" style={{marginRight: 10}} />}
                <TouchableOpacity onPress={clearHistory}>
                    <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
            </View>
          </View>

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.sender === "user" ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.text, item.sender === "user" ? styles.userText : styles.botText]}>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
          />

          <View style={styles.inputBar}>
            <TextInput 
                value={input} 
                onChangeText={setInput} 
                style={styles.input} 
                placeholder="Hỏi AI: Pizza giá bao nhiêu?..." 
                onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  header: { padding: 15, borderBottomWidth: 1, borderColor: "#eee", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: "bold", color: '#333' },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 18, marginVertical: 5 },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#FF6B00", borderBottomRightRadius: 4 },
  botBubble: { alignSelf: "flex-start", backgroundColor: "#F3F4F6", borderBottomLeftRadius: 4 },
  text: { fontSize: 15, lineHeight: 22 },
  userText: { color: "#fff" },
  botText: { color: "#333" },
  inputBar: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#eee", backgroundColor: '#fff' },
  input: { flex: 1, backgroundColor: "#F9FAFB", borderRadius: 25, paddingHorizontal: 20, height: 50, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 16 },
  sendBtn: { width: 50, height: 50, backgroundColor: "#FF6B00", borderRadius: 25, marginLeft: 10, justifyContent: "center", alignItems: "center", elevation: 2 }
});