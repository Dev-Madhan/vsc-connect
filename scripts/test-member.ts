import { MemberService } from "../lib/services/member.service";
import { prisma } from "../lib/prisma";

async function test() {
  try {
    const sc = await prisma.subClub.findFirst();
    console.log("Using SubClub:", sc?.id, sc?.name);
    
    // Try registering a test member
    const testMember = await MemberService.registerMember({
      firstName: "Test",
      lastName: "User",
      email: "test.random" + Date.now() + "@test.com",
      phoneNumber: "9876543210",
      registerNumber: "REG" + Date.now().toString().slice(-6),
      vmNumber: "VM" + Date.now().toString().slice(-6),
      department: "CSE",
      gender: "MALE" as any,
      year: "FIRST" as any,
      subClubId: sc?.id,
    });
    console.log("Success registering member:", testMember);

    // Clean up
    await prisma.member.delete({ where: { id: testMember.id } });
    console.log("Cleaned up test member");
  } catch (err: any) {
    console.error("Error registering member:", err);
  }
}

test().finally(() => prisma.$disconnect());
