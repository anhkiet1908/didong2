import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  { id: 1, name: "All", emoji: "🍽️" },
  { id: 2, name: "Burgers", emoji: "🍔" },
  { id: 3, name: "Pizza", emoji: "🍕" },
  { id: 4, name: "Sushi", emoji: "🍱" },
  { id: 5, name: "Pasta", emoji: "🍝" },
  { id: 6, name: "Salad", emoji: "🥗" },
];

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          "https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/restaurants?key=AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4"
        );
        const result = await response.json();
        console.log("✅ Firestore restaurants result:", result);

        if (!result.documents) {
          console.log("❌ Không có documents trong restaurants");
          setRestaurants([]);
          setLoading(false);
          return;
        }

        const data = result.documents.map((doc: any) => {
          const fields = doc.fields || {};
          return {
            id: doc.name.split("/").pop(),
            name: fields.name?.stringValue || "",
            category: fields.category?.stringValue || "",
            image: fields.image?.stringValue || "",
            rating: parseFloat(fields.rating?.doubleValue || fields.rating?.integerValue || "0"),
            deliveryTime: fields.deliveryTime?.stringValue || "",
            deliveryFee: fields.deliveryFee?.stringValue || "",
            distance: fields.distance?.stringValue || "",
            featured: fields.featured?.booleanValue || false,
          };
        });

        setRestaurants(data);
      } catch (error) {
        console.log("❌ Lỗi fetch restaurants:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesCategory =
      selectedCategory === "All" || restaurant.category === selectedCategory;
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredRestaurants = filteredRestaurants.filter((r) => r.featured);

  const handleRestaurantClick = (id: string) => {
    router.push(`/restaurant-detail/${id}`);
  };

  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
    
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="location" size={20} color="orange" />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 12, color: "gray" }}>Giao hàng đến</Text>
              <Text style={{ fontSize: 14 }}>123 Đường Tăng Nhơn Phú, Căn hộ 4B</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.flashButton}>
            <Ionicons name="flash" size={20} color="orange" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="gray"
            style={{ position: "absolute", left: 12, top: 12 }}
          />
          <TextInput
            placeholder="Search restaurants or dishes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.name)}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.categorySelected,
            ]}
          >
            <Text style={{ fontSize: 20 }}>{category.emoji}</Text>
            <Text
              style={{
                fontSize: 12,
                color: selectedCategory === category.name ? "white" : "black",
              }}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Loading */}
      {loading && (
        <View style={{ padding: 16 }}>
          <Text style={{ textAlign: "center", color: "gray" }}>Đang tải dữ liệu...</Text>
        </View>
      )}

      {/* Featured Section */}
      {!loading && featuredRestaurants.length > 0 && selectedCategory === "All" && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nhà hàng nổi bật</Text>
            <TouchableOpacity>
              <Text style={{ color: "orange" }}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredRestaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                onPress={() => handleRestaurantClick(restaurant.id)}
                style={styles.featuredCard}
              >
                <Image source={{ uri: restaurant.image }} style={styles.featuredImage} />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="gold" />
                  <Text style={{ fontSize: 12 }}>{restaurant.rating}</Text>
                </View>
                <View style={{ padding: 8 }}>
                  <Text style={{ fontWeight: "600" }}>{restaurant.name}</Text>
                  <Text style={{ fontSize: 12, color: "gray" }}>{restaurant.category}</Text>
                  <View style={styles.infoRow}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="time" size={14} color="gray" />
                      <Text style={{ fontSize: 12, marginLeft: 4 }}>{restaurant.deliveryTime}</Text>
                    </View>
                    <Text style={{ fontSize: 12 }}>{restaurant.deliveryFee} vận chuyển</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* All Restaurants */}
      {!loading && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tất cả các nhà hàng</Text>
          {filteredRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              onPress={() => handleRestaurantClick(restaurant.id)}
              style={styles.restaurantCard}
            >
              <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
              <View style={{ flex: 1, padding: 8 }}>
                <View style={styles.restaurantHeader}>
                  <View>
                    <Text style={{ fontWeight: "600" }}>{restaurant.name}</Text>
                    <Text style={{ fontSize: 12, color: "gray" }}>{restaurant.category}</Text>
                  </View>
                  <View style={styles.ratingSmall}>
                    <Ionicons name="star" size={12} color="orange" />
                    <Text style={{ fontSize: 12 }}>{restaurant.rating}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="time" size={14} color="gray" />
                    <Text style={{ fontSize: 12, marginLeft: 4 }}>{restaurant.deliveryTime}</Text>
                  </View>
                  <Text style={{ fontSize: 12 }}> {restaurant.deliveryFee}</Text>
                  <Text style={{ fontSize: 12 }}> {restaurant.distance}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
        </SafeAreaView>
    
  );
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  flashButton: {
    backgroundColor: "#fff3e0",
    padding: 8,
    borderRadius: 20,
  },
  searchWrapper: {
    marginTop: 8,
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 12,
  },
  searchInput: {
    height: 40,
    fontSize: 14,
  },
  categories: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f3f3f3",
  },
  categorySelected: {
    backgroundColor: "orange",
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  featuredCard: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImage: {
    width: "100%",
    height: 120,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: 100,
    height: 100,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  ratingSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
});

   