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

const categories = [
  { id: 1, name: "All", emoji: "🍽️" },
  { id: 2, name: "Burgers", emoji: "🍔" },
  { id: 3, name: "Pizza", emoji: "🍕" },
  { id: 4, name: "Sushi", emoji: "🍱" },
  { id: 5, name: "Pasta", emoji: "🍝" },
  { id: 6, name: "Salad", emoji: "🥗" },
];

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

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesCategory =
      selectedCategory === "All" || restaurant.category === selectedCategory;
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredRestaurants = filteredRestaurants.filter((r) => r.featured);


 return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="location" size={20} color="orange" />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 12, color: "gray" }}>Deliver to</Text>
              <Text style={{ fontSize: 14 }}>Current Location</Text>
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      >
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

      {/* Featured Section */}
      {featuredRestaurants.length > 0 && selectedCategory === "All" && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity>
              <Text style={{ color: "orange" }}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredRestaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                onPress={() => onRestaurantClick(restaurant.id)}
                style={styles.featuredCard}
              >
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.featuredImage}
                />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="gold" />
                  <Text style={{ fontSize: 12 }}>{restaurant.rating}</Text>
                </View>
                <View style={{ padding: 8 }}>
                  <Text style={{ fontWeight: "600" }}>{restaurant.name}</Text>
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
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* All Restaurants */}
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

   