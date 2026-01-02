import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useCart } from "./CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  restaurantId: string;

}

export const MenuItem = ({ item }: { item: Product }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: item.restaurantId,
    });
  };

  return (
    <View style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuImage} />
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.name}</Text>
        <Text style={styles.menuDesc}>{item.description}</Text>
        <View style={styles.menuBottom}>
          <Text style={styles.menuPrice}>${item.price}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: { flexDirection: "row", marginBottom: 16 },
  menuImage: { width: 96, height: 96, borderRadius: 12, backgroundColor: "#eee" },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  menuDesc: { fontSize: 13, color: "#666", marginBottom: 8 },
  menuBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  menuPrice: { color: "#f97316", fontWeight: "600" },
  addButton: { backgroundColor: "#f97316", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addButtonText: { color: "#fff", fontSize: 13, fontWeight: "500" },
});