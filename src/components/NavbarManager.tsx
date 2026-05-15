"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDE_PATHS = ["/", "/login", "/register", "/exam"];

export default function NavbarManager() {
  const pathname = usePathname();
  const hide = HIDE_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (hide) return null;
  return <Navbar />;
}
