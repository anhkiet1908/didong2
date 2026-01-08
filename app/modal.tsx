import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      {/* Tiêu đề Modal */}
      <Text style={styles.title}>Màn hình Modal</Text>
      
      <View style={styles.separator} />

      {/* Nội dung mô tả */}
      <Text style={styles.description}>
        Đây là một cửa sổ Modal. Bạn có thể dùng để hiện thông tin chi tiết hoặc cài đặt nhanh.
      </Text>

      {/* Nút quay về trang chủ */}
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Quay về trang chủ</Text>
      </Link>

      {/* Chỉnh thanh status bar cho đẹp trên iOS */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Màu nền trắng
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#eee', // Đường kẻ mờ
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#2e78b7', // Màu xanh dương giống link
    fontWeight: '600',
  },
});