<<<<<<< HEAD
import { Onboarding } from "@/components/Onboarding"; // đường dẫn đúng tới file bạn vừa viết
import { useRouter } from "expo-router";
import React from "react";
=======
import React from "react";
import { useRouter } from "expo-router";
import { Onboarding } from "@/components/Onboarding"; // đường dẫn đúng tới file bạn vừa viết
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40

export default function OnboardingScreen() {
  const router = useRouter();

  return (
<<<<<<< HEAD
    <Onboarding onComplete={() => router.replace("/(auth)/login")} />
=======
    <Onboarding onComplete={() => router.replace("/(tabs)/home")} />
>>>>>>> 6f2b526d7526b32a3ef58bec694f196ec4989b40
  );
}