import React from "react";
import { useRouter } from "expo-router";
import { Onboarding } from "@/components/Onboarding"; // đường dẫn đúng tới file bạn vừa viết

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <Onboarding onComplete={() => router.replace("/(tabs)/home")} />
  );
}