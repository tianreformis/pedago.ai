import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Generator RPP & Prota Pembelajaran Mendalam",
  description: "AI-powered RPP & Program Tahunan Generator berbasis format Kemendikdasmen Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${poppins.className} min-h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-gray-800 dark:bg-gray-950 text-gray-400 dark:text-gray-500 py-6 text-center">
            <p>Generator RPP Pembelajaran Mendalam</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}