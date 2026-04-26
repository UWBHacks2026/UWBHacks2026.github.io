"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@repo/ui/components/navbar";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null); // Replace with your Next.js auth logic
  const [searchQuery, setSearchQuery] = useState("");

  // Don't show Navbar on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        user={user} 
        onLogout={() => setUser(null)} 
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