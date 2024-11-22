import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "@/Components/themes/provider";
import Navbar from "@/Components/navbar";
import { Toaster } from "@/Components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "chessmate",
  description: "A chess game built with Nextjs and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/logo2.png" />
      <body className={inter.className}>
        <Provider>
          <Navbar />
          {children}
          <Toaster position="top-center" />
        </Provider>
      </body>
    </html>
  );
}
