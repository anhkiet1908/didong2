export interface CartItem {
  id: string;          // ✅ Firestore document ID (product)
  name: string;
  price: number;
  image: string;
  restaurantId: string; // ✅ liên kết bằng ID nhà hàng
  quantity: number;
}