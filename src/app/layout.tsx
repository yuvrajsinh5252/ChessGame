import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/Components/themes/theme-provider";
import { Toaster } from "@/Components/ui/sonner";
import { Navbar } from "@/Components/common/navbar";

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
      <body
        className={inter.className}
        data-new-gr-c-s-check-loaded="14.1215.0"
        data-gr-ext-installed=""
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
