"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    router.push("/login");
  };

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
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:text-blue-200 transition-colors"
                >
                  <User size={18} />
                  <span className="max-w-[150px] truncate">{user.email}</span>
                  <ChevronDown size={16} className={`transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hover:text-blue-200 transition-colors">Login</Link>
            )}
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
<div className="pt-3 border-t border-blue-500">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-200">
                    <User size={16} />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 hover:text-blue-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-300 hover:text-red-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hover:text-blue-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 hover:text-blue-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-300 hover:text-red-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hover:text-blue-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}