import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
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

// Dữ liệu Banner
const banners = [
  {
    id: 1,
    title: "Giảm 50%",
    subtitle: "Cho đơn đầu tiên",
    color: "#FF8A65",
    image: "https://img.freepik.com/free-photo/delicious-burger-with-fresh-ingredients_23-2150857908.jpg",
  },
  {
    id: 2,
    title: "FreeShip",
    subtitle: "Mọi đơn từ 100k",
    color: "#4DB6AC",
    image: "https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg",
  },
  {
    id: 3,
    title: "Mua 1 Tặng 1",
    subtitle: "Trà sữa cuối tuần",
    color: "#9575CD",
    image: "https://img.freepik.com/free-photo/bubble-tea-glass_23-2150493899.jpg",
  },
];

// Cấu hình kích thước banner để tính toán khoảng cách cuộn
const CARD_WIDTH = 280;
const SPACING = 12;
const SNAP_INTERVAL = CARD_WIDTH + SPACING; // Khoảng cách mỗi lần lướt

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIC AUTO SCROLL BANNER ---
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef<FlatList>(null);

  useEffect(() => {
    // Tạo bộ đếm thời gian
    const intervalId = setInterval(() => {
      let nextIndex = bannerIndex + 1;
      
      // Nếu hết danh sách thì quay về đầu (0)
      if (nextIndex >= banners.length) {
        nextIndex = 0;
      }

      setBannerIndex(nextIndex);

      // Ra lệnh cho FlatList cuộn đến vị trí tiếp theo
      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

    }, 5000); // 5000ms = 5 giây

    // Dọn dẹp bộ nhớ khi thoát màn hình
    return () => clearInterval(intervalId);
  }, [bannerIndex]); // Chạy lại mỗi khi bannerIndex thay đổi
  // --------------------------------

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          "https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/restaurants?key=AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4"
        );
        const result = await response.json();

        if (!result.documents) {
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

  // Component render từng Banner
  const renderBanner = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.bannerCard, { backgroundColor: item.color }]}
    >
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        <View style={styles.bannerButton}>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: item.color }}>
            Dùng ngay
          </Text>
        </View>
      </View>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }} nestedScrollEnabled={true}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location" size={20} color="orange" />
              <View style={{ marginLeft: 8 }}>
                <Text style={{ fontSize: 12, color: "gray" }}>Giao hàng đến</Text>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>123 Đường Tăng Nhơn Phú, TP.HCM</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.flashButton}>
              <Ionicons name="notifications-outline" size={20} color="orange" />
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
              placeholder="Tìm món ăn, nhà hàng..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* 🔥 AUTO-SCROLL BANNER SECTION */}
        <View style={{ paddingTop: 16 }}>
          <Text style={[styles.sectionTitle, { paddingLeft: 16 }]}>Ưu đãi hôm nay 🔥</Text>
          
          <FlatList
            ref={bannerRef}
            data={banners}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 4, marginTop: 10 }}
            // Các thuộc tính giúp cuộn mượt mà
            snapToInterval={SNAP_INTERVAL} // Dừng đúng vị trí thẻ
            decelerationRate="fast"
            // Hàm này giúp FlatList tính toán vị trí chính xác để không bị lỗi khi scroll tự động
            getItemLayout={(data, index) => (
              { length: SNAP_INTERVAL, offset: SNAP_INTERVAL * index, index }
            )}
            // Cập nhật lại index nếu người dùng tự tay lướt
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SNAP_INTERVAL
              );
              setBannerIndex(index);
            }}
          />
        </View>

        {/* Categories */}
        <View style={{ marginTop: 16 }}>
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
                <Text style={{ fontSize: 22 }}>{category.emoji}</Text>
                <Text
                    style={{
                    fontSize: 12,
                    marginTop: 4,
                    fontWeight: "500",
                    color: selectedCategory === category.name ? "white" : "black",
                    }}
                >
                    {category.name}
                </Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
        </View>

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
              <Text style={styles.sectionTitle}>Nhà hàng nổi bật ⭐</Text>
              <TouchableOpacity>
                <Text style={{ color: "orange", fontSize: 12 }}>Xem tất cả</Text>
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
                    <Ionicons name="star" size={12} color="gold" />
                    <Text style={{ fontSize: 10, fontWeight: "bold", marginLeft: 2 }}>{restaurant.rating}</Text>
                  </View>
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 14 }} numberOfLines={1}>{restaurant.name}</Text>
                    <Text style={{ fontSize: 12, color: "gray", marginTop: 2 }}>{restaurant.category}</Text>
                    <View style={styles.infoRow}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="time-outline" size={12} color="gray" />
                        <Text style={{ fontSize: 11, marginLeft: 2, color: "gray" }}>{restaurant.deliveryTime}</Text>
                      </View>
                      <Text style={{ fontSize: 11, color: "orange", fontWeight: "600" }}>{restaurant.deliveryFee}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Restaurants */}
        {!loading && (
          <View style={[styles.section, { paddingBottom: 40 }]}>
            <Text style={styles.sectionTitle}>Gợi ý quanh bạn</Text>
            {filteredRestaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                onPress={() => handleRestaurantClick(restaurant.id)}
                style={styles.restaurantCard}
              >
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <View style={{ flex: 1, padding: 10, justifyContent: "space-between" }}>
                  <View>
                    <View style={styles.restaurantHeader}>
                      <Text style={{ fontWeight: "bold", fontSize: 15, flex: 1 }} numberOfLines={1}>{restaurant.name}</Text>
                      <View style={styles.ratingSmall}>
                        <Ionicons name="star" size={10} color="orange" />
                        <Text style={{ fontSize: 10, marginLeft: 2, fontWeight: "bold" }}>{restaurant.rating}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, color: "gray", marginTop: 2 }}>{restaurant.category} • {restaurant.distance}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                      <Ionicons name="time-outline" size={12} color="#555" />
                      <Text style={{ fontSize: 11, marginLeft: 4, color: "#555" }}>{restaurant.deliveryTime}</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: "orange", fontWeight: "bold" }}>{restaurant.deliveryFee}</Text>
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
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  flashButton: {
    backgroundColor: "#fff3e0",
    padding: 8,
    borderRadius: 50,
  },
  searchWrapper: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 12,
    height: 45,
    justifyContent: "center",
  },
  searchInput: {
    height: "100%",
    fontSize: 14,
  },
  // 🔥 Style cho Banner (Không thay đổi)
  bannerCard: {
    width: CARD_WIDTH, // Sử dụng biến hằng số
    height: 140,
    borderRadius: 16,
    marginRight: SPACING, // Sử dụng biến hằng số
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    paddingLeft: 16,
  },
  bannerContent: {
    flex: 1,
    zIndex: 1,
  },
  bannerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  bannerImage: {
    width: 120,
    height: 140,
    resizeMode: "cover",
    marginLeft: -20,
    opacity: 0.9,
  },
  categories: {
    paddingLeft: 16,
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    width: 70, 
    height: 80,
    borderRadius: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  categorySelected: {
    backgroundColor: "orange",
    borderColor: "orange",
  },
  section: {
    padding: 16,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  featuredCard: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 5, 
  },
  featuredImage: {
    width: "100%",
    height: 110,
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  restaurantImage: {
    width: 100,
    height: 110,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  ratingSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});