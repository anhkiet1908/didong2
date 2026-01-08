<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome, MaterialIcons, Feather, Entypo } from "@expo/vector-icons";
import { useCart } from "../../components/ui/CartContext";
import Toast from "react-native-toast-message";
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e

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
<<<<<<< HEAD
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  /* ================= FETCH DATA ================= */
=======
  const { id } = useLocalSearchParams(); // ✅ lấy restaurantId từ URL
  const [restaurant, setRestaurant] = useState<any>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(
          `https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/restaurants/${id}?key=YOUR_API_KEY`
        );
        const result = await res.json();
<<<<<<< HEAD
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
=======
        const fields = result.fields;
        if (!fields) return;

        // ✅ Lấy Document ID từ name
        const docId = result.name.split("/").pop();

        setRestaurant({
          id: docId, // dùng Document ID
          name: fields.name?.stringValue || "",
          category: fields.category?.stringValue || "",
          image: fields.image?.stringValue || "",
          rating: parseFloat(fields.rating?.doubleValue || fields.rating?.integerValue || "0"),
          deliveryTime: fields.deliveryTime?.stringValue || "",
          deliveryFee: fields.deliveryFee?.stringValue || "",
          distance: fields.distance?.stringValue || "",
          featured: fields.featured?.booleanValue || false,
        });
      } catch (err) {
        console.log("❌ Lỗi fetch restaurant:", err);
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/product?key=YOUR_API_KEY"
        );
        const result = await res.json();
<<<<<<< HEAD

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
=======
        const data: Product[] = result.documents
          ? result.documents.map((doc: any) => {
              const fields = doc.fields;
              return {
                id: doc.name.split("/").pop(),
                name: fields.name?.stringValue || "",
                description: fields.description?.stringValue || "",
                price: fields.price?.doubleValue
                  ? parseFloat(fields.price.doubleValue)
                  : fields.price?.integerValue
                  ? parseInt(fields.price.integerValue) / 100
                  : 0,
                image: fields.image?.stringValue || "",
                popular: fields.popular?.booleanValue || false,
                restaurantId: fields.restaurantId?.stringValue || "", // ✅ lấy Document ID từ product
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
              };
            })
          : [];

<<<<<<< HEAD
        setItems(data.filter((i) => i.restaurantId === id));
      } catch (e) {
        console.log("Fetch product error", e);
=======
        // ✅ So sánh bằng Document ID
        setItems(data.filter((item) => item.restaurantId === id));
      } catch (err) {
        console.log("❌ Lỗi fetch products:", err);
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
      }
    };

    fetchRestaurant();
    fetchProducts();
  }, [id]);

<<<<<<< HEAD
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
=======
  if (!restaurant) return <Text style={{ padding: 16 }}>Đang tải nhà hàng...</Text>;

  const popularItems = items.filter((item) => item.popular);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        {/* Header Image */}
        <View style={{ position: "relative" }}>
          <Image source={{ uri: restaurant.image }} style={{ width, height: 200 }} />
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
              <Ionicons name="arrow-back" size={20} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
<<<<<<< HEAD
              onPress={toggleFavorite}
              style={styles.iconButton}
            >
              <FontAwesome
                name="heart"
                size={20}
                color={isFavorite ? "red" : "#333"}
              />
=======
              onPress={() => setIsFavorite(!isFavorite)}
              style={styles.iconButton}
            >
              <FontAwesome name="heart" size={20} color={isFavorite ? "red" : "#333"} />
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
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
<<<<<<< HEAD

=======
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
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
<<<<<<< HEAD
              <Text style={styles.metaText}>
                {restaurant.deliveryFee} delivery
              </Text>
=======
              <Text style={styles.metaText}>{restaurant.deliveryFee} delivery</Text>
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
            </View>
          </View>
        </View>

<<<<<<< HEAD
        {/* Menu */}
=======
        {/* Popular Items */}
        {popularItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Items</Text>
            {popularItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* All Items */}
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
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

<<<<<<< HEAD
/* ================= MENU ITEM ================= */

const MenuItem = ({ item }: { item: Product }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(item);

    Toast.show({
      type: "success",
      text1: "Đã thêm vào giỏ hàng",
      text2: `${item.name} đã được thêm 👌`,
=======
// ✅ MenuItem với addToCart từ CartContext
const MenuItem = ({ item }: { item: Product }) => {
  const { addToCart } = useCart();
const handleAdd = () => {
    // ✅ thêm vào giỏ hàng
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: item.restaurantId,
    });

    // ✅ hiển thị toast thông báo
    Toast.show({
      type: "success",
      text1: "Đã thêm vào giỏ hàng",
      text2: `${item.name} đã được thêm thành công 👌`,
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
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

<<<<<<< HEAD
/* ================= STYLES ================= */

const styles = StyleSheet.create({
  headerButtons: {
    position: "absolute",
    top: 16,
=======



const styles = StyleSheet.create({
  container: { backgroundColor: "#f9fafb" },
  headerImageWrapper: { height: 240, position: "relative" },
  headerImage: { width: "100%", height: "100%" },
  headerButtons: {
    position: "absolute",
    top: 20,
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
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
<<<<<<< HEAD
  title: { fontSize: 22, fontWeight: "600" },
=======
  title: { fontSize: 22, fontWeight: "600", marginBottom: 4 },
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
  category: { color: "#666" },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7ed",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
<<<<<<< HEAD
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
=======
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
  // menuItem: { flexDirection: "row", marginBottom: 16 },
  // menuImage: {
  //   width: 96,
  //   height: 96,
  //   borderRadius: 12,
  //   backgroundColor: "#eee",
  // },
  // menuContent: { flex: 1 },
  // menuTitle: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  // menuDesc: { fontSize: 13, color: "#666", marginBottom: 8 },
  // menuBottom: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  // menuPrice: { color: "#f97316", fontWeight: "600" },
  // addButton: {
  //   backgroundColor: "#f97316",
  //   paddingHorizontal: 12,
  //   paddingVertical: 6,
  //   borderRadius: 8,
  // },
  menuItem: { flexDirection: "row", marginBottom: 16 },
  menuImage: { width: 96, height: 96, borderRadius: 12, backgroundColor: "#eee" },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  menuDesc: { fontSize: 13, color: "#666", marginBottom: 8 },
  menuBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
  menuPrice: { color: "#f97316", fontWeight: "600" },
  addButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
<<<<<<< HEAD
  addButtonText: { color: "#fff", fontSize: 13 },
});
=======
  addButtonText: { color: "#fff", fontSize: 13, fontWeight: "500" },
});
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
