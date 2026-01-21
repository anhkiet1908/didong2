import { Onboarding } from "../components/Onboarding";
import { Onboarding } from "@/components/Onboarding"; // đường dẫn đúng tới file bạn vừa viết
import { useRouter } from "expo-router";
import React from "react";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <Onboarding onComplete={() => router.replace("/(auth)/login")} />
  );
}