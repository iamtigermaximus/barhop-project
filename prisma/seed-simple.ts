import { PrismaClient, BarType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting seed...");

  try {
    // Create Helsinki city first
    const helsinki = await prisma.city.upsert({
      where: { name: "Helsinki" },
      update: {},
      create: {
        name: "Helsinki",
        country: "Finland",
      },
    });
    console.log("✅ Helsinki city created:", helsinki.id);

    // Create just 2 test bars
    const bar1 = await prisma.bar.create({
      data: {
        name: "Test Club Helsinki",
        description: "A test club for development",
        address: "Testikatu 1, 00100 Helsinki",
        district: "Kamppi",
        type: BarType.CLUB,
        latitude: 60.1699,
        longitude: 24.9384,
        vipEnabled: true,
        vipPrice: 10.0,
        cityId: helsinki.id,
      },
    });
    console.log("✅ Bar 1 created:", bar1.name);

    const bar2 = await prisma.bar.create({
      data: {
        name: "Test Pub Helsinki",
        description: "A test pub for development",
        address: "Testikatu 2, 00100 Helsinki",
        district: "Kallio",
        type: BarType.PUB,
        latitude: 60.184,
        longitude: 24.95,
        vipEnabled: false,
        cityId: helsinki.id,
      },
    });
    console.log("✅ Bar 2 created:", bar2.name);

    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
