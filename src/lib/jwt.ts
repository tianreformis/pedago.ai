import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function createToken(userId: string, email: string, isAdmin: boolean = false): string {
  return jwt.sign({ userId, email, isAdmin }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; email: string; isAdmin?: boolean } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; isAdmin?: boolean };
  } catch {
    return null;
  }
}