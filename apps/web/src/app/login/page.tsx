"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginPage as UI_LoginPage } from "@repo/ui/views/LoginView";
import { useAuth } from "@repo/ui/components/AuthContext";
import { api } from "@repo/ui/lib/api";

export default function NextJsLoginRoute() {
  const router = useRouter();
  const { login } = useAuth();
  const [globalError, setGlobalError] = useState("");

  const handleAuthSubmit = async (formData: any) => {
    try {
      setGlobalError("");
      
      if (formData.mode === "signin") {
        // ─── SIGN IN LOGIC ───
        const data: any = await api.getUserByEmail(formData.email);
        
        const userSessionData = {
          email: data.user.email,
          name: `${data.profile.firstName} ${data.profile.lastName}`.trim(),
          candidateId: data.profile.id,
          county: data.profile.county,
          state: data.profile.state,
          phone: data.profile.phone,
          bio: data.profile.bio,
          skills: data.skills,
        };

        login(userSessionData);
        router.push("/"); // Send to dashboard

      } else if (formData.mode === "signup") {
        // ─── SIGN UP LOGIC ───
        // Split name for the backend
        const [firstName, ...lastNames] = formData.name.split(" ");
        
        // Call your Hono POST /candidates endpoint
        const response: any = await api.createCandidate({
          email: formData.email,
          passwordHash: formData.password, // In a real app, hash this first!
          firstName: firstName || "",
          lastName: lastNames.join(" ") || "",
          county: "King County", // Default fallback
          state: "WA",
          skills: "",
          languages: ""
        });

        const userSessionData = {
          email: response.user.email,
          name: formData.name,
          candidateId: response.candidate.id,
          county: response.candidate.county,
          state: response.candidate.state,
          skills: [],
        };

        login(userSessionData);
        router.push("/profile"); // Direct new users to finish their profile!
      }
      
    } catch (error) {
      console.error("Auth failed:", error);
      
      if (formData.mode === "signin") {
        setGlobalError("Account not found. Please switch to 'Create Account' to sign up.");
      } else {
        setGlobalError("Failed to create account. This email may already be in use.");
      }
    }
  };

  return (
    <div className="relative">
      {globalError && (
        <div className="absolute top-0 left-0 w-full bg-brand-orange text-white text-center py-2.5 z-50 text-sm font-semibold animate-in slide-in-from-top-2">
          {globalError}
        </div>
      )}
      
      <UI_LoginPage onLogin={handleAuthSubmit} />
    </div>
  );
}