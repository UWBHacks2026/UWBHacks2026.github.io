"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@repo/ui/components/navbar";
import { AuthProvider, useAuth } from "@repo/ui/components/AuthContext";

function InnerClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {user, logout} = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Don't show Navbar on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        user={user} 
        onLogout={logout} 
        searchQuery={searchQuery} 
        onSearch={setSearchQuery} 
        LinkComponent={Link} // Inject Next.js Link
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <InnerClient>{children}</InnerClient>
    </AuthProvider>
  )
}