import { RoleEnum } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

// ---------------------------------------------------------------------------
// Privileged users — credential (username + password) login only.
// Google SSO is temporarily disabled; these are the only active accounts.
// ---------------------------------------------------------------------------

const ADMIN_USERS = [
  {
    name: "Super Administrator",
    username: "admin@vsc",
    password: "admin@vsc2026",
    email: "admin@vistaraconnect.internal",
    googleEmail: "mg5661639@gmail.com",
    role: RoleEnum.SUPER_ADMIN,
  },
  {
    name: "President",
    username: "president@vsc",
    password: "president@vsc1999",
    email: "president@vistaraconnect.internal",
    googleEmail: "mukeshveralevel@gmail.com",
    role: RoleEnum.ADMIN,
  },
  {
    name: "Vice President",
    username: "vicepresident@vsc",
    password: "vicepresident@vsc1999",
    email: "vicepresident@vistaraconnect.internal",
    googleEmail: "mukeshg.csbs24@veltechmultitech.org",
    role: RoleEnum.ADMIN,
  },
] as const;

// Secretary for each sub-club.
// username pattern : <slug>sec@vsc
// password pattern : <slug>@vsc2026
const SECRETARY_USERS: {
  name: string;
  username: string;
  password: string;
  email: string;
  subClubSlug: string;
}[] = [
  {
    name: "Dance Secretary",
    username: "dancesec@vsc",
    password: "dance@vsc2026",
    email: "dance.secretary@vistaraconnect.internal",
    subClubSlug: "dance",
  },
  {
    name: "Music Secretary",
    username: "musicsec@vsc",
    password: "music@vsc2026",
    email: "music.secretary@vistaraconnect.internal",
    subClubSlug: "music",
  },
  {
    name: "Media Secretary",
    username: "mediasec@vsc",
    password: "media@vsc2026",
    email: "media.secretary@vistaraconnect.internal",
    subClubSlug: "media",
  },
  {
    name: "Tech Secretary",
    username: "techsec@vsc",
    password: "tech@vsc2026",
    email: "tech.secretary@vistaraconnect.internal",
    subClubSlug: "tech",
  },
  {
    name: "Compering Secretary",
    username: "comperingsec@vsc",
    password: "compering@vsc2026",
    email: "compering.secretary@vistaraconnect.internal",
    subClubSlug: "compering",
  },
  {
    name: "Fashion Secretary",
    username: "fashionsec@vsc",
    password: "fashion@vsc2026",
    email: "fashion.secretary@vistaraconnect.internal",
    subClubSlug: "fashion",
  },
  {
    name: "Art Secretary",
    username: "artsec@vsc",
    password: "art@vsc2026",
    email: "art.secretary@vistaraconnect.internal",
    subClubSlug: "art",
  },
];

// ---------------------------------------------------------------------------
// Helper — create a credential user + hashed account record if not present
// ---------------------------------------------------------------------------
async function upsertCredentialUser({
  name,
  username,
  password,
  email,
  roleId,
}: {
  name: string;
  username: string;
  password: string;
  email: string;
  roleId: string;
}): Promise<string> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`  ⏭  Already exists: ${username}`);
    return existing.id;
  }

  const ctx = await auth.$context;
  const hashed = await ctx.password.hash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
      displayUsername: username,
      emailVerified: true,
      roleId,
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: username,   // Better Auth username plugin uses this as the lookup key
      providerId: "credential",
      userId: user.id,
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`  ✅ Created: ${username}`);
  return user.id;
}

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------
async function main() {
  console.log("Seeding database…\n");

  // ── 1. Settings ────────────────────────────────────────────────────────────
  for (const s of [
    { key: "SITE_NAME",           value: "Vistara Connect",  description: "Application name" },
    { key: "ALLOW_REGISTRATION",  value: "false",            description: "Public registration disabled — invite only" },
  ]) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log("✅ Settings seeded");

  // ── 2. Roles ───────────────────────────────────────────────────────────────
  const roleMap: Record<string, string> = {};
  for (const name of [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.MODERATOR, RoleEnum.USER]) {
    let role = await prisma.role.findFirst({ where: { name } });
    if (!role) role = await prisma.role.create({ data: { name, description: `${name} role` } });
    roleMap[name] = role.id;
  }
  console.log("✅ Roles seeded");

  // ── 3. Club & SubClubs ─────────────────────────────────────────────────────
  const club = await prisma.club.upsert({
    where:  { slug: "vistara" },
    update: {},
    create: { name: "Vistara", slug: "vistara", description: "The main club" },
  });

  const SUB_CLUBS = [
    { name: "Dance",     slug: "dance",     description: "Dance sub-club" },
    { name: "Music",     slug: "music",     description: "Music sub-club" },
    { name: "Media",     slug: "media",     description: "Media & Content sub-club" },
    { name: "Tech",      slug: "tech",      description: "Technology & Development sub-club" },
    { name: "Compering", slug: "compering", description: "Compering & Anchoring sub-club" },
    { name: "Fashion",   slug: "fashion",   description: "Fashion sub-club" },
    { name: "Art",       slug: "art",       description: "Art & Design sub-club" },
  ];

  const subClubMap: Record<string, string> = {}; // slug → id
  for (const sc of SUB_CLUBS) {
    const row = await prisma.subClub.upsert({
      where:  { slug: sc.slug },
      update: { name: sc.name, description: sc.description },
      create: { ...sc, clubId: club.id },
    });
    subClubMap[sc.slug] = row.id;
  }
  console.log("✅ Sub-clubs seeded: Dance, Music, Media, Tech, Compering, Fashion, Art");

  // ── 4. Admin / privileged users ────────────────────────────────────────────
  console.log("\n── Admin accounts ──");
  for (const u of ADMIN_USERS) {
    const roleId = roleMap[u.role];
    await upsertCredentialUser({ ...u, roleId });

    // Keep Google allowlist row so OAuth can still be re-enabled later
    const existingGoogle = await prisma.user.findUnique({ where: { email: u.googleEmail } });
    if (!existingGoogle) {
      await prisma.user.create({
        data: { name: u.name, email: u.googleEmail, emailVerified: true, roleId },
      });
    } else if (!existingGoogle.roleId) {
      await prisma.user.update({ where: { id: existingGoogle.id }, data: { roleId } });
    }
  }

  // ── 5. Secretary accounts (one per sub-club) ───────────────────────────────
  console.log("\n── Secretary accounts ──");
  const moderatorRoleId = roleMap[RoleEnum.MODERATOR];

  for (const sec of SECRETARY_USERS) {
    const subClubId = subClubMap[sec.subClubSlug];
    if (!subClubId) {
      console.warn(`  ⚠️  Sub-club not found for slug: ${sec.subClubSlug} — skipping`);
      continue;
    }

    const userId = await upsertCredentialUser({
      name:     sec.name,
      username: sec.username,
      password: sec.password,
      email:    sec.email,
      roleId:   moderatorRoleId,
    });

    // Ensure secretary has a Member row linked to their sub-club so
    // the dashboard can resolve subClub → name and scope their data.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { member: true },
    });

    if (!user?.member) {
      // Generate a unique membership ID
      const year = new Date().getFullYear();
      let membershipId = `VSC-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      // Collision guard
      while (await prisma.member.findUnique({ where: { membershipId } })) {
        membershipId = `VSC-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      }

      const slug = sec.subClubSlug.toUpperCase().slice(0, 3);
      const member = await prisma.member.create({
        data: {
          firstName:      sec.name.split(" ")[0],
          lastName:       "Secretary",
          email:          sec.email,
          registerNumber: `SEC-${slug}-001`,
          vmNumber:       `VM-SEC-${slug}-001`,
          department:     "Club Administration",
          gender:         "OTHER",
          year:           "ALUMNI",
          membershipId,
          subClubId,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data:  { memberId: member.id },
      });

      console.log(`     ↳ Member record created for ${sec.name} (${subClubId})`);
    } else {
      // Make sure existing member is linked to correct sub-club
      if (user.member.subClubId !== subClubId) {
        await prisma.member.update({
          where: { id: user.member.id },
          data:  { subClubId },
        });
        console.log(`     ↳ Sub-club updated for ${sec.name}`);
      }
    }
  }

  // ── Done ───────────────────────────────────────────────────────────────────
  console.log("\n✅ Seed complete.\n");
  console.log("═══════════════════════════════════════════════════════");
  console.log("  LOGIN CREDENTIALS");
  console.log("═══════════════════════════════════════════════════════");
  console.log("  ROLE          USERNAME              PASSWORD");
  console.log("───────────────────────────────────────────────────────");
  console.log("  Super Admin   admin@vsc             admin@vsc2026");
  console.log("  President     president@vsc         president@vsc1999");
  console.log("  Vice Pres.    vicepresident@vsc     vicepresident@vsc1999");
  console.log("───────────────────────────────────────────────────────");
  console.log("  Dance Sec.    dancesec@vsc          dance@vsc2026");
  console.log("  Music Sec.    musicsec@vsc          music@vsc2026");
  console.log("  Media Sec.    mediasec@vsc          media@vsc2026");
  console.log("  Tech Sec.     techsec@vsc           tech@vsc2026");
  console.log("  Compering     comperingsec@vsc      compering@vsc2026");
  console.log("  Fashion Sec.  fashionsec@vsc        fashion@vsc2026");
  console.log("  Art Sec.      artsec@vsc            art@vsc2026");
  console.log("═══════════════════════════════════════════════════════");
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
