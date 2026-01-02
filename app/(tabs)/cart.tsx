import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../components/ui/CartContext";

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const insets = useSafeAreaInsets(); // lấy khoảng trống notch

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 4.99;
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo(true);
    }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
        </View>
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyIcon}>
            <Text style={{ fontSize: 48 }}>🛒</Text>
          </View>
          <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
          <Text style={styles.emptyDesc}>
            Thêm các món từ nhà hàng để bắt đầu đặt hàng
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header tránh notch */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>Giỏ hàng ({cart.length})</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          contentInsetAdjustmentBehavior="never" // không tự thêm padding
        >
          {/* Địa chỉ giao hàng */}
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View style={styles.iconCircle}>
                <Entypo name="location-pin" size={20} color="#f97316" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.label}>Địa chỉ giao hàng</Text>
                <Text style={styles.text}>Vị trí hiện tại</Text>
                <Text style={styles.subText}>123 Đường Tăng Nhơn Phú, Căn hộ 4B</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.link}>Thay đổi</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Danh sách món ăn */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mặt hàng</Text>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                </View>
                <View style={{ alignItems: "flex-end", justifyContent: "space-between" }}>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Ionicons name="trash" size={18} color="#999" />
                  </TouchableOpacity>
                  <View style={styles.quantityBox}>
                    <TouchableOpacity
                      onPress={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeFromCart(item.id)
                      }
                    >
                      <Ionicons name="remove" size={18} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={18} color="#333" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Mã giảm giá */}
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="local-offer" size={20} color="#f97316" />
              <TextInput
                placeholder="Nhập mã giảm giá (ví dụ: SAVE10)"
                value={promoCode}
                onChangeText={setPromoCode}
                editable={!appliedPromo}
                style={styles.input}
              />
              {!appliedPromo ? (
                <TouchableOpacity onPress={handleApplyPromo}>
                  <Text style={styles.link}>Áp dụng</Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ color: "green" }}>Đã áp dụng!</Text>
              )}
            </View>
          </View>

          {/* Tóm tắt đơn hàng */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.subText}>Tổng phụ</Text>
              <Text style={styles.subText}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.subText}>Phí giao hàng</Text>
              <Text style={styles.subText}>${deliveryFee.toFixed(2)}</Text>
            </View>
            {appliedPromo && (
              <View style={styles.summaryRow}>
                <Text style={{ color: "green" }}>Giảm giá (10%)</Text>
                <Text style={{ color: "green" }}>-${discount.toFixed(2)}</Text>
              </View>
            )}
            <View
              style={[
                styles.summaryRow,
                { borderTopWidth: 1, borderColor: "#eee", paddingTop: 8 },
              ]}
            >
              <Text style={styles.text}>Tổng cộng</Text>
              <Text style={styles.total}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Nút thanh toán */}
        <View style={[styles.checkoutBar, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>
              Tiến hành thanh toán · ${total.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: { fontSize: 18, fontWeight: "600" },
  emptyWrapper: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  emptyDesc: { color: "#666", textAlign: "center", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: { fontSize: 12, color: "#666" },
  text: { fontSize: 14, fontWeight: "500" },
  subText: { fontSize: 13, color: "#666" },
  link: { color: "#f97316", fontSize: 13, marginLeft: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  cartItem: { flexDirection: "row", marginBottom: 12 },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  itemTitle: { fontSize: 15, fontWeight: "500", marginBottom: 4 },
  price: { color: "#f97316", fontWeight: "600", marginTop: 4 },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 8,
  },
  quantityText: {
    width: 24,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 4,
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f97316",
  },
  checkoutBar: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  checkoutButton: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
});