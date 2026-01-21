import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Màn hình Modal</Text>
      
      <View style={styles.separator} />

      <Text style={styles.description}>
        Đây là một cửa sổ Modal. Bạn có thể dùng để hiện thông tin chi tiết hoặc cài đặt nhanh.
      </Text>

      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Quay về trang chủ</Text>
      </Link>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>

import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
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
=======
    padding: 20,
  },
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
<<<<<<< HEAD
  linkText: {
    fontSize: 16,
    color: '#2e78b7', // Màu xanh dương giống link
    fontWeight: '600',
  },
});
=======
});
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
