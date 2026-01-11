import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.header}> Thanh toán </Text>

        <PaymentItem icon="cash-outline" title="Tiền mặt" active />
        <PaymentItem icon="wallet-outline" title="Ví MoMo" />
        <PaymentItem icon="card-outline" title="Thẻ ngân hàng" />

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={22} color="orange" />
          <Text style={styles.addText}>Thêm phương thức thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function PaymentItem({
  icon,
  title,
  active,
}: {
  icon: any;
  title: string;
  active?: boolean;
}) {
  return (
    <View style={[styles.item, active && styles.active]}>
      <Ionicons name={icon} size={22} color="orange" />
      <Text style={styles.itemText}>{title}</Text>
      {active && <Text style={styles.activeText}>Đang dùng</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    paddingHorizontal: 14,
  },

  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 8,
  },

  active: {
    borderWidth: 1,
    borderColor: "orange",
    backgroundColor: "#fff4e6",
  },

  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  activeText: {
    fontSize: 12,
    color: "orange",
    fontWeight: "600",
  },

  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "orange",
    marginTop: 12,
  },

  addText: {
    marginLeft: 6,
    color: "orange",
    fontSize: 14,
    fontWeight: "600",
  },
});
