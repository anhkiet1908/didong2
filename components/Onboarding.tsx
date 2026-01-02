import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const slides = [
  {
    emoji: "🍔",
    title: "Khám phá nhà hàng",
    description:
      "Hàng trăm quán ăn ngon quanh bạn, đa dạng ẩm thực từ truyền thống đến hiện đại",
  },
  {
    emoji: "🚀",
    title: "Giao hàng siêu tốc",
    description:
      "Món ăn yêu thích sẽ đến tận tay bạn chỉ trong vài phút, nóng hổi và tiện lợi",
  },
  {
    emoji: "💳",
    title: "Thanh toán dễ dàng",
    description:
      "Nhiều phương thức thanh toán an toàn, nhanh chóng cho trải nghiệm mua sắm mượt mà",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const insets = useSafeAreaInsets(); // lấy khoảng trống notch + home indicator

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Skip Button */}
        <View style={[styles.skipWrapper, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{slides[currentSlide].emoji}</Text>
          </View>

          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.description}>
            {slides[currentSlide].description}
          </Text>

          {/* Dots Indicator */}
          <View style={styles.dots}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide
                    ? styles.dotActive
                    : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Next Button */}
        <View style={[styles.nextWrapper, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentSlide < slides.length - 1 ? "Next" : "Get Started"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff7ed" },
  container: {
    flex: 1,
    backgroundColor: "#fff7ed",
    justifyContent: "space-between",
  },
  skipWrapper: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  skipText: {
    color: "#6b7280",
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emojiCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    color: "#111827",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: width * 0.8,
    marginBottom: 32,
  },
  dots: {
    flexDirection: "row",
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 32,
    backgroundColor: "#f97316",
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#d1d5db",
  },
  nextWrapper: {
    paddingHorizontal: 24,
  },
  nextButton: {
    flexDirection: "row",
    backgroundColor: "#f97316",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  nextText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    marginRight: 8,
  },
});