"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl">PedagoAI</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/generate" className="hover:text-blue-200 transition-colors">RPP</Link>
              <Link href="/generate-prota" className="hover:text-blue-200 transition-colors">Prota</Link>
              <Link href="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="hover:text-blue-200 transition-colors">Login</Link>
          </div>
          <button
            className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-blue-500">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/generate"
              className="block hover:text-blue-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              RPP
            </Link>
            <Link
              href="/generate-prota"
              className="block hover:text-blue-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Prota
            </Link>
            <Link
              href="/dashboard"
              className="block hover:text-blue-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <div className="pt-3 border-t border-blue-500 flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/login"
                className="hover:text-blue-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}