import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Navbar from "@/components/navbar";
import { Provider } from "@/components/themes/provider";

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
      <link rel="icon" href="/logo.png" />
      <body className={inter.className}>
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
