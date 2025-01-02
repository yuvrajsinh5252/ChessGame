import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "@/Components/themes/provider";
import { Toaster } from "@/Components/ui/sonner";
import NavbarWrapper from "@/Components/common/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chessmate",
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
          <NavbarWrapper />
          {children}
          <Toaster position="top-center" />
        </Provider>
      </body>
    </html>
  );
}
