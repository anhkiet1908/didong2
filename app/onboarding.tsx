<<<<<<< HEAD
// File: app/onboarding.tsx
import { Onboarding } from "../components/Onboarding";
import { useRouter } from "expo-router";
import React from "react";
=======
<<<<<<< HEAD
import { Onboarding } from "@/components/Onboarding"; // đường dẫn đúng tới file bạn vừa viết
import { useRouter } from "expo-router";
import React from "react";
=======
import React from "react";
import { useRouter } from "expo-router";
import { Onboarding } from "@/components/Onboarding"; // đường dẫn đúng tới file bạn vừa viết
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575

export default function OnboardingScreen() {
  const router = useRouter();

  return (
<<<<<<< HEAD
    // Khi chạy xong slide cuối cùng, nó sẽ gọi hàm này để chuyển trang
    <Onboarding onComplete={() => router.replace("/(auth)/login")} />
=======
<<<<<<< HEAD
    <Onboarding onComplete={() => router.replace("/(auth)/login")} />
=======
    <Onboarding onComplete={() => router.replace("/(tabs)/home")} />
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
>>>>>>> 4c115ce663d979ab39e8ac430b0cd2c7b2867575
  );
}