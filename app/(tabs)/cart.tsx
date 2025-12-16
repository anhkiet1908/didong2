<<<<<<< HEAD
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
=======
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons, FontAwesome, Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
import { CartItem } from "../../app/types/CartItem";

interface CartProps {
items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onBack: () => void;
}

export default function Cart({ items, onUpdateQuantity, onBack }: CartProps) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);

const subtotal = (items ?? []).reduce((sum, item) => sum + item.price * item.quantity, 0);
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
  const deliveryFee = 4.99;
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo(true);
    }
  };

<<<<<<< HEAD
  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
        </View>
=======
  if (items.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>

        {/* Empty Cart */}
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyIcon}>
            <Text style={{ fontSize: 48 }}>🛒</Text>
          </View>
<<<<<<< HEAD
          <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
          <Text style={styles.emptyDesc}>
            Thêm các món từ nhà hàng để bắt đầu đặt hàng
          </Text>
        </View>
      </SafeAreaView>
=======
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDesc}>
            Add items from a restaurant to start ordering
          </Text>
          <TouchableOpacity onPress={onBack} style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </View>
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({items.length})</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Delivery Address */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={styles.iconCircle}>
              <Entypo name="location-pin" size={20} color="#f97316" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.label}>Delivery Address</Text>
              <Text style={styles.text}>Current Location</Text>
              <Text style={styles.subText}>123 Main Street, Apt 4B</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.link}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cart Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.subText}>{item.restaurant}</Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
              <View style={{ alignItems: "flex-end", justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => onUpdateQuantity(item.id, 0)}>
                  <Ionicons name="trash" size={18} color="#999" />
                </TouchableOpacity>
                <View style={styles.quantityBox}>
                  <TouchableOpacity
                    onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={18} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={18} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="local-offer" size={20} color="#f97316" />
            <TextInput
              placeholder="Enter promo code (try: SAVE10)"
              value={promoCode}
              onChangeText={setPromoCode}
              editable={!appliedPromo}
              style={styles.input}
            />
            {!appliedPromo ? (
              <TouchableOpacity onPress={handleApplyPromo}>
                <Text style={styles.link}>Apply</Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ color: "green" }}>Applied!</Text>
            )}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.subText}>Subtotal</Text>
            <Text style={styles.subText}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.subText}>Delivery Fee</Text>
            <Text style={styles.subText}>${deliveryFee.toFixed(2)}</Text>
          </View>
          {appliedPromo && (
            <View style={styles.summaryRow}>
              <Text style={{ color: "green" }}>Discount (10%)</Text>
              <Text style={{ color: "green" }}>-${discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderColor: "#eee", paddingTop: 8 }]}>
            <Text style={styles.text}>Total</Text>
            <Text style={styles.total}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutBar}>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>
            Proceed to Checkout · ${total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
=======
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
<<<<<<< HEAD

  headerTitle: { fontSize: 18, fontWeight: "600" },
=======
  headerTitle: { fontSize: 18, fontWeight: "600", marginLeft: 12 },
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
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
<<<<<<< HEAD
=======
  browseButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: { color: "#fff", fontWeight: "600" },
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
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
<<<<<<< HEAD
    marginRight: 12,
=======
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
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
<<<<<<< HEAD
  quantityText: {
    width: 24,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
=======
  quantityText: { width: 24, textAlign: "center", fontSize: 14 },
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
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
<<<<<<< HEAD
  total: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f97316",
  },
=======
  total: { fontSize: 18, fontWeight: "700", color: "#f97316" },
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
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
<<<<<<< HEAD
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
=======
  iconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#fff7ed",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
});