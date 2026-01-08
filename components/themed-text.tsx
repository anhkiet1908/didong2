<<<<<<< HEAD
import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

// Định nghĩa các kiểu props
=======
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
<<<<<<< HEAD
  
  // Mặc định dùng màu đen (bỏ qua logic check theme phức tạp để tránh lỗi)
  const color = '#11181C'; 
=======
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
