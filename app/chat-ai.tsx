import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

// Key Gemini (Dùng để Chat)
// ⚠️ Hãy thay bằng Key Gemini của bạn (Key lấy ở aistudio.google.com)
const GEMINI_API_KEY = "AIzaSyAxlB39nHbj6eW0enaMXkHUN8qcOqme6wU"; 

// Link API dữ liệu thật của bạn (Firestore)
const FIRESTORE_URL = "https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/restaurants?key=AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4";

interface IMessage { id: string; text: string; sender: 'user' | 'bot'; }

export default function ChatAIScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<IMessage>>(null);
  
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);
  
  // State lưu trữ dữ liệu thật lấy từ API về
  const [restaurantContext, setRestaurantContext] = useState<string>("Đang tải dữ liệu quán...");
  const [activeModel, setActiveModel] = useState<string | null>(null);

  /* ================= 2. HÀM XỬ LÝ DỮ LIỆU FIRESTORE ================= */
  // Firestore trả về dạng { fields: { name: { stringValue: "..." } } } rất rối
  // Hàm này giúp chuyển nó thành văn bản dễ đọc cho AI hiểu.
  const parseFirestoreData = (data: any) => {
    try {
      if (!data.documents) return "Không có dữ liệu quán ăn.";

      let contextString = "Dưới đây là thông tin thực tế của các quán ăn từ hệ thống:\n";

      data.documents.forEach((doc: any, index: number) => {
        const fields = doc.fields;
        // Tùy vào cấu trúc database của bạn mà sửa phần này nhé
        // Ví dụ này giả định DB có các trường: name, address, menu, description
        const name = fields.name?.stringValue || "Quán chưa đặt tên";
        const address = fields.address?.stringValue || "Chưa cập nhật địa chỉ";
        const desc = fields.description?.stringValue || "";
        
        // Nếu menu là một chuỗi mô tả
        const menu = fields.menu?.stringValue || fields.menu?.arrayValue?.values?.map((v:any) => v.stringValue).join(", ") || "Đang cập nhật";

        contextString += `\n${index + 1}. Tên quán: ${name}\n   - Địa chỉ: ${address}\n   - Menu/Món ăn: ${menu}\n   - Mô tả: ${desc}\n`;
      });

      return contextString;
    } catch (error) {
      console.error("Lỗi parse Firestore:", error);
      return "Lỗi khi đọc dữ liệu quán.";
    }
  };

  /* ================= 3. LOAD DỮ LIỆU & MODEL ================= */
  useEffect(() => {
    const initSystem = async () => {
      // BƯỚC A: Tìm Model Gemini tốt nhất (Auto-discovery)
      try {
        const modelRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        const modelData = await modelRes.json();
        if (modelData.models) {
          const chosen = modelData.models.find((m: any) => m.name.includes("flash"))?.name 
                      || modelData.models.find((m: any) => m.name.includes("pro"))?.name
                      || modelData.models[0]?.name;
          setActiveModel(chosen);
        }
      } catch (e) { console.error("Lỗi tìm model:", e); }

      // BƯỚC B: Lấy dữ liệu thật từ Firestore
      try {
        console.log("⏳ Đang lấy dữ liệu từ Firestore...");
        const firestoreRes = await fetch(FIRESTORE_URL);
        const firestoreData = await firestoreRes.json();
        
        // Chuyển JSON loằng ngoằng thành văn bản
        const cleanData = parseFirestoreData(firestoreData);
        console.log("✅ Dữ liệu đã lấy:", cleanData);
        
        setRestaurantContext(cleanData); // Lưu vào bộ nhớ để AI dùng sau này
      } catch (e) {
        console.error("Lỗi lấy Firestore:", e);
        setRestaurantContext("Hiện không kết nối được với dữ liệu quán ăn.");
      }
    };

    initSystem();
    
    // Load lịch sử chat
    AsyncStorage.getItem("chat_history").then(stored => {
      if (stored) setMessages(JSON.parse(stored));
      else setMessages([{ id: "1", sender: "bot", text: "👋 Xin chào! Mình có thể giúp gì về thông tin các quán ăn ạ?" }]);
    });
  }, []);

  /* ================= 4. GỌI API GEMINI (KÈM DỮ LIỆU THẬT) ================= */
  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    if (!activeModel) return "⚠️ Đang kết nối AI...";

    const modelName = activeModel.startsWith("models/") ? activeModel : `models/${activeModel}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

    // 🔥 KỸ THUẬT PROMPT: Nhồi dữ liệu thật vào ngữ cảnh
    const FINAL_PROMPT = `
    Bạn là trợ lý ảo hỗ trợ tìm kiếm quán ăn.
    
    HÃY TRẢ LỜI DỰA TRÊN DỮ LIỆU THỰC TẾ SAU ĐÂY (Không được bịa đặt):
    -------------------
    ${restaurantContext}
    -------------------

    Yêu cầu:
    - Trả lời ngắn gọn, thân thiện, dùng emoji 🍔.
    - Nếu khách hỏi món không có trong danh sách trên, hãy bảo là quán chưa có.
    
    Khách hỏi: ${userMessage}
    `;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: FINAL_PROMPT }] }]
        }),
      });

      const data = await response.json();
      
      if (data.error) return `⚠️ Lỗi AI: ${data.error.message}`;
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không hiểu.";

    } catch (error) {
      return "⚠️ Lỗi kết nối mạng.";
    }
  };

  /* ================= 5. GỬI TIN NHẮN ================= */
  const sendMessage = async (text?: string) => {
    const content = text ?? input;
    if (!content.trim()) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: content }]);
    setInput("");
    setTyping(true);

    const reply = await callGeminiAPI(content);

    setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: "bot", text: reply }]);
    setTyping(false);
  };

  /* ================= UI RENDER ================= */
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={insets.top + 10}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>FoodApp AI 🤖</Text>
              {/* Hiển thị trạng thái dữ liệu */}
              <Text style={{fontSize: 10, color: restaurantContext.includes("Đang tải") ? 'orange' : 'green'}}>
                 {restaurantContext.includes("Đang tải") ? "⏳ Đang tải menu..." : "AI 2.0"}
              </Text>
            </View>
            {typing && <ActivityIndicator size="small" color="#f97316" />}
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
            contentContainerStyle={{ padding: 10 }}
          />

          <View style={styles.inputBar}>
            <TextInput value={input} onChangeText={setInput} style={styles.input} placeholder="Tìm quán, món ăn..." />
            <TouchableOpacity onPress={() => sendMessage()} style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  header: { padding: 15, borderBottomWidth: 1, borderColor: "#eee", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: "bold" },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 18, marginVertical: 5 },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#f97316" },
  botBubble: { alignSelf: "flex-start", backgroundColor: "#f1f5f9" },
  text: { fontSize: 15 },
  userText: { color: "#fff" },
  botText: { color: "#000" },
  inputBar: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#eee" },
  input: { flex: 1, backgroundColor: "#f8f9fa", borderRadius: 25, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: "#ddd" },
  sendBtn: { width: 45, height: 45, backgroundColor: "#f97316", borderRadius: 25, marginLeft: 10, justifyContent: "center", alignItems: "center" }
});