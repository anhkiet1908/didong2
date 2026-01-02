<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
export interface CartItem {
  id: string;          // ✅ Firestore document ID (product)
  name: string;
  price: number;
  image: string;
  restaurantId: string; // ✅ liên kết bằng ID nhà hàng
<<<<<<< HEAD
=======
=======
// types/CartItem.ts
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  restaurant: string;
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  quantity: number;
}