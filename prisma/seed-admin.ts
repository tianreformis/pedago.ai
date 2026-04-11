import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@rpp-mendalam.id";
  const adminPassword = "adminRPP2024!"; // Change this!
  
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (existingAdmin) {
    console.log("Admin user already exists");
    await prisma.user.update({ where: { email: adminEmail }, data: { isAdmin: true } });
    console.log("Admin status updated");
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Administrator",
        isAdmin: true,
      },
    });
    console.log("Admin user created");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());