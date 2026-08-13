import { prisma } from "../lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      emailVerified: true,
    },
  });

  console.log("\n=== USERS ===");
  for (const u of users) {
    console.log(`  email: ${u.email} | username: ${u.username ?? "(none)"} | verified: ${u.emailVerified}`);
  }

  const accounts = await prisma.account.findMany({
    select: {
      userId: true,
      providerId: true,
      accountId: true,
      password: true,
    },
  });

  console.log("\n=== ACCOUNTS ===");
  for (const a of accounts) {
    console.log(`  userId: ${a.userId} | provider: ${a.providerId} | accountId: ${a.accountId} | hasPassword: ${!!a.password}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
