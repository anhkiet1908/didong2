<<<<<<< HEAD
export interface CartItem {
  id: string;          // ✅ Firestore document ID (product)
  name: string;
  price: number;
  image: string;
  restaurantId: string; // ✅ liên kết bằng ID nhà hàng
=======
// types/CartItem.ts
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  restaurant: string;
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
  quantity: number;
}