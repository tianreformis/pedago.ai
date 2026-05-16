import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function createToken(userId: string, email: string, isAdmin: boolean = false, type: string = "teacher"): string {
  return jwt.sign({ userId, email, isAdmin, type, role: type }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; email: string; isAdmin?: boolean; type?: string; role?: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; isAdmin?: boolean; type?: string; role?: string };
  } catch {
    return null;
  }
}