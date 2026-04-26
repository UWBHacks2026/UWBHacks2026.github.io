import type { Metadata } from "next";
import "@repo/ui/globals.css";
import { ClientLayoutWrapper } from "@/app/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Second Chapter",
  description: "Fair-chance employment platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-bg min-h-screen antialiased">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}