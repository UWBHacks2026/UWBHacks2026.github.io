"use client";

import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { RoutingContextType, RoutingProvider } from "@repo/ui/components/RoutingContext";
import { Navbar } from "@repo/ui/components/navbar";

import "./index.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const nextRouting: RoutingContextType = {
    Link: ({ href, children, ...props }: any) => <NextLink href={href} {...props}>{children}</NextLink>,
    useNavigate: () => (path: string) => router.push(path),
    usePathname: () => pathname,
  };

  return (
	<html lang="en">
	  <body>
      <RoutingProvider value={nextRouting}>
        <Navbar />

        <main>{children}</main>
      </RoutingProvider>
	  </body>
	</html>
  );
}
