<<<<<<< HEAD
// File: app/onboarding.tsx
import { Onboarding } from "../components/Onboarding";
=======
import { Onboarding } from "@/components/Onboarding"; // đường dẫn đúng tới file bạn vừa viết
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
import { useRouter } from "expo-router";
import React from "react";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
<<<<<<< HEAD
    // Khi chạy xong slide cuối cùng, nó sẽ gọi hàm này để chuyển trang
=======
>>>>>>> 97b1ddbf8f813b632991c0a96bf4260d9170c09e
    <Onboarding onComplete={() => router.replace("/(auth)/login")} />
  );
}