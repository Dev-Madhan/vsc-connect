/**
 * Fix script — re-creates credential Account rows with the correct accountId.
 *
 * Better Auth's username plugin looks up accounts by:
 *   providerId = "credential"  AND  accountId = <username>
 *
 * Our seed incorrectly set accountId = userId (UUID). This script corrects that.
 */
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

const USERS = [
  { username: "admin@vsc",         password: "admin@vsc2026" },
  { username: "president@vsc",     password: "president@vsc1999" },
  { username: "vicepresident@vsc", password: "vicepresident@vsc1999" },
];

async function main() {
  const ctx = await auth.$context;

  for (const u of USERS) {
    const user = await prisma.user.findUnique({ where: { username: u.username } });
    if (!user) {
      console.log(`  ⚠  User not found: ${u.username}`);
      continue;
    }

    // Delete old credential account(s) for this user
    const deleted = await prisma.account.deleteMany({
      where: { userId: user.id, providerId: "credential" },
    });
    console.log(`  🗑  Deleted ${deleted.count} old credential account(s) for ${u.username}`);

    // Hash the password with Better Auth's hasher
    const hashed = await ctx.password.hash(u.password);

    // Re-create with accountId = username (what Better Auth expects)
    await prisma.account.create({
      data: {
        id:          crypto.randomUUID(),
        accountId:   u.username,   // ← this is the fix
        providerId:  "credential",
        userId:      user.id,
        password:    hashed,
        createdAt:   new Date(),
        updatedAt:   new Date(),
      },
    });

    console.log(`  ✅ Fixed account for ${u.username}`);
  }

  console.log("\nDone.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
