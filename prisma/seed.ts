import { RoleEnum } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

// ---------------------------------------------------------------------------
// Pre-approved users
// Each entry maps to exactly one allowed login:
//   - credential login via username + password
//   - Google OAuth ONLY if the google_email below is the signing-in account
// ---------------------------------------------------------------------------
const PRIVILEGED_USERS = [
  {
    name: "Super Administrator",
    username: "admin@vsc",
    password: "admin@vsc2026",
    // Internal system email (used as the auth identifier for credential login)
    email: "admin@vistaraconnect.internal",
    // The real Google account allowed to sign in via OAuth
    googleEmail: "mg5661639@gmail.com",
    role: RoleEnum.SUPER_ADMIN,
    emailVerified: true,
  },
  {
    name: "President",
    username: "president@vsc",
    password: "president@vsc1999",
    email: "president@vistaraconnect.internal",
    googleEmail: "mukeshveralevel@gmail.com",
    role: RoleEnum.ADMIN,
    emailVerified: true,
  },
  {
    name: "Vice President",
    username: "vicepresident@vsc",
    password: "vicepresident@vsc1999",
    email: "vicepresident@vistaraconnect.internal",
    googleEmail: "mukeshg.csbs24@veltechmultitech.org",
    role: RoleEnum.ADMIN,
    emailVerified: true,
  },
] as const;

async function main() {
  console.log("Seeding database...");

  // ── 1. Settings ────────────────────────────────────────────────────────────
  const settingsToCreate = [
    { key: "SITE_NAME", value: "Vistara Connect", description: "The name of the application" },
    { key: "ALLOW_REGISTRATION", value: "false", description: "Public registration is disabled — admin-invite only" },
  ];

  for (const s of settingsToCreate) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("✅ Settings seeded");

  // ── 2. Roles ───────────────────────────────────────────────────────────────
  const roleNames = [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.MODERATOR, RoleEnum.USER];
  const roleMap: Record<string, string> = {};

  for (const roleName of roleNames) {
    let role = await prisma.role.findFirst({ where: { name: roleName } });
    if (!role) {
      role = await prisma.role.create({
        data: { name: roleName, description: `${roleName} role` },
      });
    }
    roleMap[roleName] = role.id;
  }
  console.log("✅ Roles seeded");

  // ── 3. Club & SubClub ──────────────────────────────────────────────────────
  const club = await prisma.club.upsert({
    where: { slug: "vistara" },
    update: {},
    create: { name: "Vistara", slug: "vistara", description: "The main club" },
  });

  await prisma.subClub.upsert({
    where: { slug: "development" },
    update: {},
    create: {
      name: "Development",
      slug: "development",
      clubId: club.id,
      description: "Software Development Team",
    },
  });
  console.log("✅ Club & SubClub seeded");

  // ── 4. Privileged users (credential accounts) ─────────────────────────────
  //
  // We create the credential (username/password) account using Better Auth's
  // ctx so passwords are hashed consistently with Better Auth's algorithm.
  // The google_email is stored as a *separate* User row whose email exactly
  // matches the Gmail address — that is the account Better Auth creates when
  // the Google OAuth flow completes.
  //
  for (const u of PRIVILEGED_USERS) {
    const roleId = roleMap[u.role];

    // --- Credential user (username + password login) ---
    const existingCredUser = await prisma.user.findUnique({
      where: { email: u.email },
    });

    if (!existingCredUser) {
      // Use Better Auth's internal ctx to hash the password properly
      const ctx = await auth.$context;
      const hashed = await ctx.password.hash(u.password);

      const credUser = await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          username: u.username,
          displayUsername: u.username,
          emailVerified: u.emailVerified,
          roleId,
        },
      });

      // Create the credential Account record Better Auth expects.
      // accountId MUST be the username — that's how the username plugin looks it up.
      await prisma.account.create({
        data: {
          id: crypto.randomUUID(),
          accountId: u.username,   // ← must match username, not userId
          providerId: "credential",
          userId: credUser.id,
          password: hashed,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`  ✅ Credential user created: ${u.username}`);
    } else {
      console.log(`  ⏭  Credential user already exists: ${u.username}`);
    }

    // --- Google allowlist user (pre-seeded so OAuth callback finds them) ---
    const existingGoogleUser = await prisma.user.findUnique({
      where: { email: u.googleEmail },
    });

    if (!existingGoogleUser) {
      await prisma.user.create({
        data: {
          name: u.name,
          email: u.googleEmail,
          emailVerified: true,
          roleId,
        },
      });
      console.log(`  ✅ Google-allowlist user created: ${u.googleEmail}`);
    } else {
      // Make sure the role is set in case it was created without one
      if (!existingGoogleUser.roleId) {
        await prisma.user.update({
          where: { id: existingGoogleUser.id },
          data: { roleId },
        });
      }
      console.log(`  ⏭  Google-allowlist user already exists: ${u.googleEmail}`);
    }
  }

  console.log("\n✅ All privileged users seeded");
  console.log("\nDatabase seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
