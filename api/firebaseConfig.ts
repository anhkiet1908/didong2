// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAn3CAbb21GsyLEAWalgRqb_ox_fwKu1E4",
  authDomain: "anhkiet-61730.firebaseapp.com",
  projectId: "anhkiet-61730",
  storageBucket: "anhkiet-61730.appspot.com", // ✅ sửa lại đuôi đúng là .appspot.com
  messagingSenderId: "331164136094",
  appId: "1:331164136094:web:90ca27f50d2d444b4c418f",
  measurementId: "G-HCXCK7ZEG9",
};

const app = initializeApp(firebaseConfig);

// ✅ Thêm các dòng sau để export auth và firestore
export const auth = getAuth(app);
export const db = getFirestore(app);