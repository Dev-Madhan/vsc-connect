import { prisma } from "../lib/prisma";

async function main() {
  console.log("--- CLUBS ---");
  const clubs = await prisma.club.findMany();
  console.log(clubs);

  console.log("--- SUB-CLUBS ---");
  const subClubs = await prisma.subClub.findMany();
  console.log(subClubs);

  console.log("--- EVENTS ---");
  const events = await prisma.event.findMany({
    include: { club: true }
  });
  console.log(events);

  console.log("--- MEMBERS ---");
  const members = await prisma.member.findMany({
    include: { subClub: true }
  });
  console.log(`Total members: ${members.length}`);
  console.log(members.map(m => ({ id: m.id, name: `${m.firstName} ${m.lastName}`, email: m.email, subClub: m.subClub?.name })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
