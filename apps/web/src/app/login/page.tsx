"use client";

import { LoginPage } from "@repo/ui/views/LoginView";
import { useRouter } from "next/navigation";

export default function LoginRoute() {
  const router = useRouter();

  const handleLogin = (userData: any) => {
    // Handle auth (e.g., set cookies, update context)
    console.log("Logged in:", userData);
    router.push("/");
  };

  return <LoginPage onLogin={handleLogin} />;
}
