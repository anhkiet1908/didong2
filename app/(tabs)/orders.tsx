import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const orders = [
  {
    id: "ORD-2024-001",
    status: "delivering",
    restaurant: "The Burger House",
    items: ["Classic Beef Burger", "Cheese Burger Deluxe"],
    total: 27.98,
    date: "Today, 2:30 PM",
    estimatedTime: "15 min",
    image: "https://images.unsplash.com/photo-1671106672702-5626deb87b0e?...",
    driver: {
      name: "John Smith",
      phone: "+1 234 567 8900",
      image: "https://images.unsplash.com/photo-1727694619845-2a35923f9734?...",
    },
  },
  {
    id: "ORD-2024-002",
    status: "completed",
    restaurant: "Pizza Paradise",
    items: ["Margherita Pizza", "Pepperoni Pizza"],
    total: 35.98,
    date: "Yesterday, 7:45 PM",
    image: "https://images.unsplash.com/photo-1634435334343-27e5d92a7870?...",
  },
  {
    id: "ORD-2024-003",
    status: "completed",
    restaurant: "Sushi Master",
    items: ["California Roll", "Salmon Nigiri Set"],
    total: 33.98,
    date: "Nov 24, 2024",
    image: "https://images.unsplash.com/photo-1625937751876-4515cd8e78bd?...",
  },
];

interface OrdersProps {
  onOrderClick: (orderId: string) => void;
}

export default function Orders({ onOrderClick }: OrdersProps) {
  const activeOrder = orders.find((o) => o.status === "delivering");
  const pastOrders = orders.filter((o) => o.status !== "delivering");
  const insets = useSafeAreaInsets(); // lấy khoảng trống notch

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header tránh notch */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>Đơn hàng</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          contentInsetAdjustmentBehavior="never"
        >
          {/* Active Order */}
          {activeOrder && (
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.sectionTitle}>Hoạt động</Text>
              <View style={styles.card}>
                {/* Status */}
                <View style={styles.statusBar}>
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <Ionicons name="cube" size={18} color="#fff" />
                      <Text style={styles.statusText}>Order {activeOrder.id}</Text>
                    </View>
                    <Text style={styles.statusBadge}>Giao hàng</Text>
                  </View>
                  <Text style={styles.statusSub}>
                    Dự kiến đến vào {activeOrder.estimatedTime}
                  </Text>
                </View>

                {/* Steps */}
                <View style={styles.cardSection}>
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <FontAwesome name="check-circle" size={18} color="green" />
                      <Text style={styles.stepText}>Đơn hàng đã được xác nhận</Text>
                    </View>
                    <Text style={styles.stepTime}>2:30 PM</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <FontAwesome name="check-circle" size={18} color="green" />
                      <Text style={styles.stepText}>Chuẩn bị</Text>
                    </View>
                    <Text style={styles.stepTime}>2:35 PM</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <Ionicons name="time" size={18} color="#f97316" />
                      <Text style={styles.stepText}>Trên đường đi</Text>
                    </View>
                    <Text style={styles.stepTime}>2:45 PM</Text>
                  </View>
                </View>

                {/* Driver */}
                {activeOrder.driver && (
                  <View style={styles.cardSection}>
                    <Text style={styles.subText}>Đối tác giao hàng của bạn</Text>
                    <View style={styles.rowBetween}>
                      <View style={styles.row}>
                        <Image
                          source={{ uri: activeOrder.driver.image }}
                          style={styles.driverImage}
                        />
                        <View>
                          <Text>{activeOrder.driver.name}</Text>
                          <View style={styles.row}>
                            <Entypo name="location-pin" size={14} color="#666" />
                            <Text style={styles.subText}>cách 2,3 km</Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.callButton}>
                        <Ionicons name="call" size={20} color="#f97316" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Order Details */}
                <View style={styles.cardSection}>
                  <View style={styles.row}>
                    <Image
                      source={{ uri: activeOrder.image }}
                      style={styles.orderImage}
                    />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.text}>{activeOrder.restaurant}</Text>
                      <Text style={styles.subText}>
                        {activeOrder.items.join(", ")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.subText}>Total</Text>
                    <Text style={styles.price}>${activeOrder.total.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Past Orders */}
          <Text style={styles.sectionTitle}>Đơn hàng trước đây</Text>
          {pastOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => onOrderClick(order.id)}
              style={styles.card}
            >
              <View style={styles.row}>
                <Image source={{ uri: order.image }} style={styles.orderImageLarge} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <View style={styles.rowBetween}>
                    <View>
                      <Text style={styles.text}>{order.restaurant}</Text>
                      <Text style={styles.subText}>{order.date}</Text>
                    </View>
                    <View style={styles.row}>
                      <FontAwesome name="check-circle" size={14} color="green" />
                      <Text style={[styles.subText, { color: "green" }]}>Hoàn thành</Text>
                    </View>
                  </View>
                  <Text style={styles.subText}>{order.items.join(", ")}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.price}>${order.total.toFixed(2)}</Text>
                    <TouchableOpacity style={styles.reorderButton}>
                      <Text style={styles.reorderText}>Sắp xếp lại</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9fafb" },
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: { fontSize: 18, fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
  },
  statusBar: { backgroundColor: "#f97316", padding: 12 },
  statusText: { color: "#fff", marginLeft: 6 },
  statusBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    color: "#fff",
    fontSize: 12,
  },
  
  statusSub: { color: "#fff", fontSize: 12, marginTop: 4 },
  cardSection: { padding: 12, borderTopWidth: 1, borderColor: "#eee" },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepText: { fontSize: 13, marginLeft: 6 },
  stepTime: { fontSize: 11, color: "#666" },
  subText: { fontSize: 12, color: "#666" },
  text: { fontSize: 14, fontWeight: "500" },
  price: { fontSize: 14, fontWeight: "600", color: "#f97316" },
  driverImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
    backgroundColor: "#eee",
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  orderImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  orderImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  reorderButton: {
    backgroundColor: "#fff7ed",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  reorderText: { color: "#f97316", fontSize: 13, fontWeight: "500" },
});