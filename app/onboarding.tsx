// File: app/onboarding.tsx
import { Onboarding } from "../components/Onboarding";
import { useRouter } from "expo-router";
import React from "react";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    // Khi chạy xong slide cuối cùng, nó sẽ gọi hàm này để chuyển trang
    <Onboarding onComplete={() => router.replace("/(auth)/login")} />
  );
}