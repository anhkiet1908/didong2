import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top / 2 }]}>
        <Text style={styles.header}>Trợ giúp Và Hỗ trợ</Text>

        <HelpItem
          icon="chatbubble-outline"
          text="Chat với trợ lý AI"
          onPress={() => router.push("/chat-ai")}
        />
        <HelpItem
          icon="call-outline"
          text="Gọi tổng đài 1900 1234"
        />
        <HelpItem
          icon="mail-outline"
          text="Email hỗ trợ"
        />
      </View>
    </SafeAreaView>
  );
}

function HelpItem({
  icon,
  text,
  onPress,
}: {
  icon: any;
  text: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={22} color="orange" />
      <Text style={styles.itemText}>{text}</Text>
      <Ionicons name="chevron-forward" size={18} color="gray" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
});
