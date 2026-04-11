import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Generator RPP Pembelajaran Mendalam",
  description: "AI-powered RPP Generator berbasis format Kemendikdasmen Indonesia",
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
          <nav className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-8">
                  <Link href="/" className="font-bold text-xl">RPM Generator</Link>
                  <div className="hidden md:flex items-center gap-6">
                    <Link href="/generate" className="hover:text-blue-200 transition-colors">Generate RPP</Link>
                    <Link href="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <Link href="/login" className="hover:text-blue-200 transition-colors">Login</Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1">{children}</main>
          <footer className="bg-gray-800 dark:bg-gray-950 text-gray-400 dark:text-gray-500 py-6 text-center">
            <p>Generator RPP Pembelajaran Mendalam · Powered by Mistral AI</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}