import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@rpp-mendalam.id";
  const adminPassword = process.env.ADMIN_PASSWORD || "adminRPP2024!";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const byEmail = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (byEmail) {
    await prisma.user.update({
      where: { id: byEmail.id },
      data: { password: hashedPassword, isAdmin: true },
    });
    console.log(`Admin updated: ${adminEmail}`);
    return;
  }

  const anyAdmin = await prisma.user.findFirst({ where: { isAdmin: true } });
  if (anyAdmin) {
    await prisma.user.update({
      where: { id: anyAdmin.id },
      data: { email: adminEmail, password: hashedPassword },
    });
    console.log(`Admin reassigned to: ${adminEmail}`);
    return;
  }

  await prisma.user.create({
    data: { email: adminEmail, password: hashedPassword, name: "Administrator", isAdmin: true },
  });
  console.log(`Admin created: ${adminEmail}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());