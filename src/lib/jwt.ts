import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function createToken(userId: string, email: string, isAdmin: boolean = false, type: "teacher" | "student" = "teacher"): string {
  return jwt.sign({ userId, email, isAdmin, type }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; email: string; isAdmin?: boolean; type?: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; isAdmin?: boolean; type?: string };
  } catch {
    return null;
  }
}