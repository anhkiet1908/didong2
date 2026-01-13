import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const categories = [
  { id: 1, name: "All", emoji: "🍽️" },
  { id: 2, name: "Burgers", emoji: "🍔" },
  { id: 3, name: "Pizza", emoji: "🍕" },
  { id: 4, name: "Sushi", emoji: "🍱" },
  { id: 5, name: "Pasta", emoji: "🍝" },
  { id: 6, name: "Salad", emoji: "🥗" },
];

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

const CARD_WIDTH = 280;
const SPACING = 12;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 🔥 STATE BỘ LỌC NÂNG CAO ---
  const [filterVisible, setFilterVisible] = useState(false); // Ẩn/Hiện Modal
  const [sortBy, setSortBy] = useState<"default" | "rating" | "time">("default"); // Sắp xếp
  const [isFreeShip, setIsFreeShip] = useState(false); // Chỉ hiện FreeShip

  // --- LOGIC BANNER ---
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef<FlatList>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let nextIndex = bannerIndex + 1;
      if (nextIndex >= banners.length) nextIndex = 0;
      setBannerIndex(nextIndex);
      bannerRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 5000);
    return () => clearInterval(intervalId);
  }, [bannerIndex]);

  // --- FETCH DATA ---
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
            deliveryTime: fields.deliveryTime?.stringValue || "30 min",
            deliveryFee: fields.deliveryFee?.stringValue || "$0.00",
            distance: fields.distance?.stringValue || "",
            featured: fields.featured?.booleanValue || false,
          };
        });

        setRestaurants(data);
      } catch (error) {
        console.log("❌ Lỗi fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // --- 🔥 LOGIC LỌC & SẮP XẾP (ĐÃ SỬA) ---
  const getFilteredRestaurants = () => {
    let result = restaurants;

    // 1. LỌC THEO TỪ KHÓA TÌM KIẾM (SEARCH) - Phần bị thiếu
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(query));
    }

    // 2. LỌC THEO DANH MỤC (CATEGORY) - Phần bị thiếu
    if (selectedCategory !== "All") {
      result = result.filter(r => r.category === selectedCategory);
    }

    // 3. LỌC FREESHIP
    if (isFreeShip) {
      result = result.filter(r => 
        r.deliveryFee.toLowerCase().includes("free") || 
        r.deliveryFee.includes("0.00")
      );
    }

    // 4. SẮP XẾP (SORT)
    if (sortBy === "rating") {
        // Vừa lọc điểm cao, vừa sắp xếp
        result = result.filter(r => r.rating >= 4.8); // Chỉ lấy quán > 4 sao
        result = [...result].sort((a, b) => b.rating - a.rating);
    } 
    else if (sortBy === "time") {
        // Sắp xếp thời gian giao hàng tăng dần
        result = [...result].sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    }

    return result;
  };

  const filteredData = getFilteredRestaurants();
  const featuredRestaurants = filteredData.filter((r) => r.featured);

  const handleRestaurantClick = (id: string) => {
    router.push(`/restaurant-detail/${id}`);
  };

  const renderBanner = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.bannerCard, { backgroundColor: item.color }]}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        <View style={styles.bannerButton}>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: item.color }}>Dùng ngay</Text>
        </View>
      </View>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="location" size={20} color="orange" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 12, color: "gray" }}>Giao hàng đến</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600' }}>123 Đường Tăng Nhơn Phú</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.flashButton}
                onPress={() => router.push("/notification")} 
              >
                <Ionicons name="notifications-outline" size={20} color="orange" />
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* Search Bar */}
                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={20} color="gray" style={{ position: "absolute", left: 12 }} />
                    <TextInput
                        placeholder="Tìm món ngon..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>

                {/* 🔥 NÚT LỌC (FILTER BUTTON) */}
                <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
                    <Ionicons name="options-outline" size={22} color="white" />
                </TouchableOpacity>
            </View>
          </View>

          {/* BANNER */}
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
              snapToInterval={SNAP_INTERVAL}
              decelerationRate="fast"
              getItemLayout={(data, index) => ({ length: SNAP_INTERVAL, offset: SNAP_INTERVAL * index, index })}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL);
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
                  style={[styles.categoryButton, selectedCategory === category.name && styles.categorySelected]}
                  >
                  <Text style={{ fontSize: 22 }}>{category.emoji}</Text>
                  <Text style={{ fontSize: 12, marginTop: 4, fontWeight: "500", color: selectedCategory === category.name ? "white" : "black" }}>
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

          {/* Kết quả lọc */}
          {!loading && (
            <View style={[styles.section, { paddingBottom: 80 }]}>
              
              {/* Tiêu đề thay đổi theo ngữ cảnh */}
              <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                      {searchQuery ? "Kết quả tìm kiếm" : "Gợi ý quanh bạn"}
                  </Text>
                  {/* Hiển thị badge nếu đang lọc */}
                  {(sortBy !== 'default' || isFreeShip) && (
                      <View style={styles.activeFilterBadge}>
                          <Text style={{fontSize: 10, color: 'orange', fontWeight: 'bold'}}>Đang lọc</Text>
                      </View>
                  )}
              </View>

              {filteredData.length === 0 ? (
                  <View style={{alignItems: 'center', marginTop: 20}}>
                      <Ionicons name="search-outline" size={40} color="#ccc" />
                      <Text style={{color: '#999', marginTop: 10}}>Không tìm thấy quán nào phù hợp</Text>
                  </View>
              ) : (
                  filteredData.map((restaurant) => (
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
                  ))
              )}
            </View>
          )}

        </ScrollView>
      </SafeAreaView>

      {/* 🔥 NÚT CHATBOT FAB */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.chatButton, { bottom: insets.bottom + 90 }]}
        onPress={() => router.push("/chat-ai")} 
      >
        <MaterialCommunityIcons name="robot-happy-outline" size={32} color="white" />
        <View style={styles.chatBadge} />
      </TouchableOpacity>

      {/* 🔥🔥🔥 MODAL BỘ LỌC (ADVANCED FILTER) 🔥🔥🔥 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Bộ lọc & Sắp xếp</Text>
                    <TouchableOpacity onPress={() => setFilterVisible(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Sắp xếp */}
                <Text style={styles.filterLabel}>Sắp xếp theo</Text>
                <View style={styles.sortOptions}>
                    <TouchableOpacity 
                        style={[styles.sortBtn, sortBy === 'default' && styles.sortBtnActive]} 
                        onPress={() => setSortBy('default')}
                    >
                        <Text style={[styles.sortText, sortBy === 'default' && styles.sortTextActive]}>Mặc định</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.sortBtn, sortBy === 'rating' && styles.sortBtnActive]} 
                        onPress={() => setSortBy('rating')}
                    >
                        <Text style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>Đánh giá cao ⭐</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.sortBtn, sortBy === 'time' && styles.sortBtnActive]} 
                        onPress={() => setSortBy('time')}
                    >
                        <Text style={[styles.sortText, sortBy === 'time' && styles.sortTextActive]}>Giao nhanh ⚡</Text>
                    </TouchableOpacity>
                </View>

                {/* Tùy chọn khác */}
                <View style={styles.switchRow}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="truck-delivery-outline" size={22} color="#4DB6AC" />
                        <Text style={styles.switchLabel}>Chỉ hiện FreeShip</Text>
                    </View>
                    <Switch 
                        value={isFreeShip} 
                        onValueChange={setIsFreeShip} 
                        trackColor={{ false: "#eee", true: "#FF8A65" }}
                        thumbColor={isFreeShip ? "#FF6B00" : "#f4f3f4"}
                    />
                </View>

                {/* Nút Áp dụng */}
                <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterVisible(false)}>
                    <Text style={styles.applyBtnText}>Áp dụng ({filteredData.length} kết quả)</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  flashButton: { backgroundColor: "#fff3e0", padding: 8, borderRadius: 50 },
  
  // 🔥 Search & Filter Button
  searchWrapper: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    height: 45,
    justifyContent: "center",
    marginRight: 10, // Cách nút lọc ra
  },
  searchInput: { height: "100%", fontSize: 14, paddingLeft: 40, paddingRight: 12 },
  filterBtn: {
      width: 45, height: 45,
      backgroundColor: "#FF6B00",
      borderRadius: 12,
      justifyContent: 'center', alignItems: 'center',
      shadowColor: "#FF6B00", shadowOpacity: 0.3, shadowRadius: 5, elevation: 5
  },

  // Banner
  bannerCard: { width: CARD_WIDTH, height: 140, borderRadius: 16, marginRight: SPACING, flexDirection: "row", alignItems: "center", overflow: "hidden", paddingLeft: 16 },
  bannerContent: { flex: 1, zIndex: 1 },
  bannerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  bannerSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 12, marginBottom: 12 },
  bannerButton: { backgroundColor: "white", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: "flex-start" },
  bannerImage: { width: 120, height: 140, resizeMode: "cover", marginLeft: -20, opacity: 0.9 },
  
  // Categories
  categories: { paddingLeft: 16 },
  categoryButton: { alignItems: "center", justifyContent: "center", marginRight: 12, width: 70, height: 80, borderRadius: 16, backgroundColor: "white", borderWidth: 1, borderColor: "#f0f0f0" },
  categorySelected: { backgroundColor: "orange", borderColor: "orange" },
  
  // Content
  section: { padding: 16, paddingBottom: 0 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  activeFilterBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },

  // Restaurant Card
  featuredCard: { width: 200, backgroundColor: "white", borderRadius: 16, marginRight: 12, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginBottom: 5 },
  featuredImage: { width: "100%", height: 110 },
  ratingBadge: { position: "absolute", top: 10, left: 10, flexDirection: "row", alignItems: "center", backgroundColor: "white", paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 },
  
  restaurantCard: { flexDirection: "row", backgroundColor: "white", borderRadius: 16, marginBottom: 16, overflow: "hidden", elevation: 1, borderWidth: 1, borderColor: "#f0f0f0" },
  restaurantImage: { width: 100, height: 110 },
  restaurantHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  ratingSmall: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff3e0", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },

  // Chat Button
  chatButton: { position: "absolute", right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: "#FF6B00", justifyContent: "center", alignItems: "center", shadowColor: "#FF6B00", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 5, elevation: 10, zIndex: 999 },
  chatBadge: { position: "absolute", top: 14, right: 14, width: 10, height: 10, borderRadius: 5, backgroundColor: "#4ade80", borderWidth: 2, borderColor: "#FF6B00" },

  // 🔥 MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  filterLabel: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 10 },
  sortOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  sortBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#eee', backgroundColor: '#f9f9f9' },
  sortBtnActive: { backgroundColor: '#FFF3E0', borderColor: '#FF6B00' },
  sortText: { color: '#666', fontWeight: '500' },
  sortTextActive: { color: '#FF6B00', fontWeight: 'bold' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom: 20 },
  switchLabel: { fontSize: 16, marginLeft: 10, fontWeight: '500', color: '#333' },
  applyBtn: { backgroundColor: '#FF6B00', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  applyBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});