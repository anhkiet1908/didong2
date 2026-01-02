<<<<<<< HEAD
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
=======
<<<<<<< HEAD
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
<<<<<<< HEAD
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
=======
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
=======
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575

const categories = [
  { id: 1, name: "All", emoji: "🍽️" },
  { id: 2, name: "Burgers", emoji: "🍔" },
  { id: 3, name: "Pizza", emoji: "🍕" },
  { id: 4, name: "Sushi", emoji: "🍱" },
  { id: 5, name: "Pasta", emoji: "🍝" },
  { id: 6, name: "Salad", emoji: "🥗" },
];

<<<<<<< HEAD
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

=======
<<<<<<< HEAD
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
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

=======
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          "https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/restaurants?key=AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4"
        );
        const result = await response.json();
<<<<<<< HEAD

        if (!result.documents) {
=======
        console.log("✅ Firestore restaurants result:", result);

        if (!result.documents) {
          console.log("❌ Không có documents trong restaurants");
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
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
<<<<<<< HEAD
=======
=======
export const restaurants = [
  {
    id: 1,
    name: "The Burger House",
    category: "Burgers",
    image:
      "https://images.unsplash.com/photo-1671106672702-5626deb87b0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 4.8,
    deliveryTime: "20-30 min",
    deliveryFee: "$2.99",
    distance: "1.2 km",
    featured: true,
  },
  {
    id: 2,
    name: "Pizza Paradise",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1634435334343-27e5d92a7870?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 4.6,
    deliveryTime: "25-35 min",
    deliveryFee: "$3.49",
    distance: "2.1 km",
    featured: true,
  },
  {
    id: 3,
    name: "Sushi Master",
    category: "Sushi",
    image:
      "https://images.unsplash.com/photo-1625937751876-4515cd8e78bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 4.9,
    deliveryTime: "30-40 min",
    deliveryFee: "$4.99",
    distance: "3.5 km",
    featured: false,
  },
  {
    id: 4,
    name: "Pasta Italia",
    category: "Pasta",
    image:
      "https://images.unsplash.com/photo-1749169337822-d875fd6f4c9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: "$2.49",
    distance: "1.8 km",
    featured: false,
  },
  {
    id: 5,
    name: "Fresh Salad Bar",
    category: "Salad",
    image:
      "https://images.unsplash.com/photo-1640718153995-db4d3f0a6337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 4.5,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    distance: "0.9 km",
    featured: false,
  },
];

interface HomeProps {
  onRestaurantClick: (id: number) => void;
}


export default function Home({ onRestaurantClick }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesCategory =
      selectedCategory === "All" || restaurant.category === selectedCategory;
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredRestaurants = filteredRestaurants.filter((r) => r.featured);

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  const handleRestaurantClick = (id: string) => {
    router.push(`/restaurant-detail/${id}`);
  };

<<<<<<< HEAD
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
=======
  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
    
=======

 return (
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="location" size={20} color="orange" />
            <View style={{ marginLeft: 8 }}>
<<<<<<< HEAD
              <Text style={{ fontSize: 12, color: "gray" }}>Giao hàng đến</Text>
              <Text style={{ fontSize: 14 }}>123 Đường Tăng Nhơn Phú, Căn hộ 4B</Text>
=======
              <Text style={{ fontSize: 12, color: "gray" }}>Deliver to</Text>
              <Text style={{ fontSize: 14 }}>Current Location</Text>
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
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
<<<<<<< HEAD
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
=======
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      >
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
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

<<<<<<< HEAD
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
=======
      {/* Featured Section */}
      {featuredRestaurants.length > 0 && selectedCategory === "All" && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity>
              <Text style={{ color: "orange" }}>See All</Text>
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredRestaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
<<<<<<< HEAD
                onPress={() => handleRestaurantClick(restaurant.id)}
                style={styles.featuredCard}
              >
                <Image source={{ uri: restaurant.image }} style={styles.featuredImage} />
=======
                onPress={() => onRestaurantClick(restaurant.id)}
                style={styles.featuredCard}
              >
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.featuredImage}
                />
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="gold" />
                  <Text style={{ fontSize: 12 }}>{restaurant.rating}</Text>
                </View>
                <View style={{ padding: 8 }}>
                  <Text style={{ fontWeight: "600" }}>{restaurant.name}</Text>
<<<<<<< HEAD
                  <Text style={{ fontSize: 12, color: "gray" }}>{restaurant.category}</Text>
                  <View style={styles.infoRow}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="time" size={14} color="gray" />
                      <Text style={{ fontSize: 12, marginLeft: 4 }}>{restaurant.deliveryTime}</Text>
                    </View>
                    <Text style={{ fontSize: 12 }}>{restaurant.deliveryFee} vận chuyển</Text>
=======
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    {restaurant.category}
                  </Text>
                  <View style={styles.infoRow}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="time" size={14} color="gray" />
                      <Text style={{ fontSize: 12, marginLeft: 4 }}>
                        {restaurant.deliveryTime}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 12 }}>
                      {restaurant.deliveryFee} delivery
                    </Text>
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
                  </View>
                </View>
              </TouchableOpacity>
            ))}
<<<<<<< HEAD
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
=======
          </ScrollView>
        </View>
      )}

      {/* All Restaurants */}
<<<<<<< HEAD
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


=======
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Restaurants</Text>
        {filteredRestaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            onPress={() => onRestaurantClick(restaurant.id)}
            style={styles.restaurantCard}
          >
            <Image
              source={{ uri: restaurant.image }}
              style={styles.restaurantImage}
            />
            <View style={{ flex: 1, padding: 8 }}>
              <View style={styles.restaurantHeader}>
                <View>
                  <Text style={{ fontWeight: "600" }}>{restaurant.name}</Text>
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    {restaurant.category}
                  </Text>
                </View>
                <View style={styles.ratingSmall}>
                  <Ionicons name="star" size={12} color="orange" />
                  <Text style={{ fontSize: 12 }}>{restaurant.rating}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="time" size={14} color="gray" />
                  <Text style={{ fontSize: 12, marginLeft: 4 }}>
                    {restaurant.deliveryTime}
                  </Text>
                </View>
                <Text style={{ fontSize: 12 }}>• {restaurant.deliveryFee}</Text>
                <Text style={{ fontSize: 12 }}>• {restaurant.distance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
<<<<<<< HEAD
    marginBottom: 16,
=======
    marginBottom: 12,
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  },
  flashButton: {
    backgroundColor: "#fff3e0",
    padding: 8,
<<<<<<< HEAD
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
=======
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
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
<<<<<<< HEAD
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
=======
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
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
<<<<<<< HEAD
    fontWeight: "700",
    color: "#333",
  },
  featuredCard: {
    width: 200,
=======
    fontWeight: "600",
  },
  featuredCard: {
    width: 220,
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
    backgroundColor: "white",
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
<<<<<<< HEAD
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
=======
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
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 6,
<<<<<<< HEAD
    paddingVertical: 4,
    borderRadius: 8,
=======
    paddingVertical: 2,
    borderRadius: 12,
    elevation: 2,
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
<<<<<<< HEAD
    alignItems: "center",
=======
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
    marginTop: 6,
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
<<<<<<< HEAD
    marginBottom: 16,
    overflow: "hidden",
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  restaurantImage: {
    width: 100,
    height: 110,
=======
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
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
<<<<<<< HEAD
    alignItems: "flex-start",
=======
    marginBottom: 6,
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  },
  ratingSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 6,
    paddingVertical: 2,
<<<<<<< HEAD
    borderRadius: 6,
  },
});
=======
    borderRadius: 8,
  },
});

   
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
