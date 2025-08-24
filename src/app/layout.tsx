import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/Components/themes/theme-provider";
import { Toaster } from "@/Components/ui/sonner";
import { Navbar } from "@/Components/common/navbar";
import { SessionProvider } from "next-auth/react";
import { generatePageSEO } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generatePageSEO({
  title: "Online Chess Game",
  description:
    "Play chess online against global players, challenge AI opponents, or enjoy local matches with friends. Real-time multiplayer chess with smart AI, beautiful themes, and competitive matchmaking.",
  image: "chess.png",
  path: "",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/logo2.png" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Navbar />
            {children}
          </SessionProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
