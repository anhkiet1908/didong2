import {
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useCart } from "../../components/ui/CartContext";

const { width } = Dimensions.get("window");

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  popular: boolean;
  restaurantId: string;
}

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(
          `https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/restaurants/${id}?key=YOUR_API_KEY`
        );
        const result = await res.json();
        if (!result.fields) return;

        const fields = result.fields;
        const docId = result.name.split("/").pop();

        setRestaurant({
          id: docId,
          name: fields.name?.stringValue || "",
          category: fields.category?.stringValue || "",
          image: fields.image?.stringValue || "",
          rating: parseFloat(
            fields.rating?.doubleValue ||
              fields.rating?.integerValue ||
              "0"
          ),
          deliveryTime: fields.deliveryTime?.stringValue || "",
          deliveryFee: fields.deliveryFee?.stringValue || "",
          distance: fields.distance?.stringValue || "",
        });
      } catch (e) {
        console.log("Fetch restaurant error", e);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/product?key=YOUR_API_KEY"
        );
        const result = await res.json();

        const data: Product[] = result.documents
          ? result.documents.map((doc: any) => {
              const f = doc.fields;
              return {
                id: doc.name.split("/").pop(),
                name: f.name?.stringValue || "",
                description: f.description?.stringValue || "",
                price: f.price?.doubleValue
                  ? parseFloat(f.price.doubleValue)
                  : f.price?.integerValue
                  ? parseInt(f.price.integerValue) / 100
                  : 0,
                image: f.image?.stringValue || "",
                popular: f.popular?.booleanValue || false,
                restaurantId: f.restaurantId?.stringValue || "",
              };
            })
          : [];

        setItems(data.filter((i) => i.restaurantId === id));
      } catch (e) {
        console.log("Fetch product error", e);
      }
    };

    fetchRestaurant();
    fetchProducts();
  }, [id]);

  /* ================= FAVORITE ================= */

  const toggleFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem("favorites");
      let favorites = stored ? JSON.parse(stored) : [];

      const exists = favorites.find(
        (item: any) => item.id === restaurant.id
      );

      if (exists) {
        favorites = favorites.filter(
          (item: any) => item.id !== restaurant.id
        );
        setIsFavorite(false);
      } else {
        favorites.push(restaurant);
        setIsFavorite(true);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (e) {
      console.log("Favorite error", e);
    }
  };

  useEffect(() => {
    if (!restaurant) return;

    const checkFavorite = async () => {
      const stored = await AsyncStorage.getItem("favorites");
      if (!stored) return;

      const favorites = JSON.parse(stored);
      if (favorites.find((f: any) => f.id === restaurant.id)) {
        setIsFavorite(true);
      }
    };

    checkFavorite();
  }, [restaurant]);

  /* ================= LOADING ================= */

  if (!restaurant) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Đang tải nhà hàng...</Text>
      </SafeAreaView>
    );
  }

  const popularItems = items.filter((i) => i.popular);

  /* ================= RENDER ================= */

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView contentInsetAdjustmentBehavior="never">
        {/* Header Image */}
        <View style={{ marginTop: insets.top /2}}>
          <Image
            source={{ uri: restaurant.image }}
            style={{ width, height: 200 }}
          />

          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
            >
              <Ionicons name="arrow-back" size={20} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleFavorite}
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

        {/* Info */}
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
              <Text style={styles.metaText}>
                {restaurant.deliveryFee} delivery
              </Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {items.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= MENU ITEM ================= */

const MenuItem = ({ item }: { item: Product }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(item);

    Toast.show({
      type: "success",
      text1: "Đã thêm vào giỏ hàng",
      text2: `${item.name} đã được thêm 👌`,
      position: "bottom",
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

/* ================= STYLES ================= */

const styles = StyleSheet.create({
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
  title: { fontSize: 22, fontWeight: "600" },
  category: { color: "#666" },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: { marginLeft: 4 },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { marginLeft: 4, color: "#666" },
  section: { backgroundColor: "#fff", padding: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  menuItem: { flexDirection: "row", marginBottom: 16 },
  menuImage: { width: 96, height: 96, borderRadius: 12 },
  menuContent: { flex: 1, marginLeft: 12 },
  menuTitle: { fontSize: 16, fontWeight: "500" },
  menuDesc: { fontSize: 13, color: "#666", marginVertical: 6 },
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
  addButtonText: { color: "#fff", fontSize: 13 },
});
