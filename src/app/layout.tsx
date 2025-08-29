import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProviderWrapper } from "@/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "NextAuth App",
  description: "Application d'authentification moderne avec NextAuth.js v5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProviderWrapper>
          <ThemeProvider>
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
