import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons, Feather, Entypo } from "@expo/vector-icons";
import { restaurants } from "./home"; // giữ nguyên nếu bạn có dữ liệu ở đây
import { CartItem } from "../../app/types/CartItem";

const { width } = Dimensions.get("window");

// Menu items dữ liệu mẫu
const menuItems: Record<number, any[]> = {
  1: [
    {
      id: 101,
      name: "Classic Beef Burger",
      description: "Juicy beef patty with lettuce, tomato, onion, and special sauce",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1671106672702-5626deb87b0e?...",
      popular: true,
    },
    {
      id: 102,
      name: "Cheese Burger Deluxe",
      description: "Double cheese, bacon, and crispy onion rings",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1671106672702-5626deb87b0e?...",
      popular: false,
    },
    {
      id: 103,
      name: "Veggie Burger",
      description: "Plant-based patty with fresh vegetables",
      price: 10.99,
      image:
        "https://images.unsplash.com/photo-1671106672702-5626deb87b0e?...",
      popular: false,
    },
  ],
  // ... các restaurant khác giữ nguyên như bạn đã khai báo
};

interface RestaurantDetailProps {
  restaurantId: number;
  onBack: () => void;
  onAddToCart: (item: Omit<CartItem, "quantity">) => void;
}
interface MenuItemProps {
  item: Omit<CartItem, "quantity" | "restaurant"> & { description: string };
  restaurant: {
    id: number;
    name: string;
    category: string;
    image: string;
    rating: number;
    deliveryTime: string;
    deliveryFee: string;
    distance: string;
    featured: boolean;
  };
  onAddToCart: (item: Omit<CartItem, "quantity">) => void;
}


export default function RestaurantDetail({
  restaurantId,
  onBack,
  onAddToCart,
}: RestaurantDetailProps) {
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const items = menuItems[restaurantId] || [];
  const [isFavorite, setIsFavorite] = useState(false);

  if (!restaurant) return null;

  const popularItems = items.filter((item) => item.popular);

  // 👉 phần return bạn sẽ viết bằng React Native (View, Text, TouchableOpacity, Image)
  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImageWrapper}>
        <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            style={styles.iconButton}
          >
            <FontAwesome
              name="heart"
              size={20}
              color={isFavorite ? "red" : "#333"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Restaurant Info */}
      <View style={styles.infoWrapper}>
        <View style={styles.infoTop}>
          <View>
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text style={styles.category}>{restaurant.category}</Text>
          </View>
          <View style={styles.ratingBox}>
            <MaterialIcons name="star" size={20} color="#f97316" />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
        </View>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={16} color="#666" />
            <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Entypo name="location-pin" size={16} color="#666" />
            <Text style={styles.metaText}>{restaurant.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="info" size={16} color="#666" />
            <Text style={styles.metaText}>{restaurant.deliveryFee} delivery</Text>
          </View>
        </View>
      </View>

      {/* Popular Items */}
      {popularItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          {popularItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              restaurant={restaurant}
              onAddToCart={onAddToCart}
            />
          ))}
        </View>
      )}

      {/* All Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        {items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            restaurant={restaurant}
            onAddToCart={onAddToCart}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const MenuItem: React.FC<MenuItemProps> = ({ item, restaurant, onAddToCart }) => {
  return (
    <View style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuImage} />
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.name}</Text>
        <Text style={styles.menuDesc}>{item.description}</Text>
        <View style={styles.menuBottom}>
          <Text style={styles.menuPrice}>${item.price}</Text>
          <TouchableOpacity
            onPress={() =>
              onAddToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                restaurant: restaurant.name, // ✅ giờ là string
              })
            }
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f9fafb" },
  headerImageWrapper: { height: 240, position: "relative" },
  headerImage: { width: "100%", height: "100%" },
  headerButtons: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  infoWrapper: {
    backgroundColor: "#fff",
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  infoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 4 },
  category: { color: "#666" },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: { marginLeft: 4, fontSize: 16 },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 12,
  },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { marginLeft: 4, color: "#666", fontSize: 14 },
  section: { backgroundColor: "#fff", padding: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  menuItem: { flexDirection: "row", marginBottom: 16 },
  menuImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  menuDesc: { fontSize: 13, color: "#666", marginBottom: 8 },
  menuBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuPrice: { color: "#f97316", fontWeight: "600" },
  addButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  
  addButtonText: { color: "#fff", fontSize: 13, fontWeight: "500" },
});