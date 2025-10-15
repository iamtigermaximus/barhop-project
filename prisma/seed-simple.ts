import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional - be careful in production!)
  // await prisma.crawlChatMessage.deleteMany()
  // await prisma.crawlParticipant.deleteMany()
  // await prisma.crawlBar.deleteMany()
  // await prisma.crawl.deleteMany()
  // await prisma.bar.deleteMany()
  // await prisma.city.deleteMany()
  // await prisma.user.deleteMany()

  // Create Cities
  console.log("🏙️ Creating cities...");
  const helsinki = await prisma.city.upsert({
    where: { name: "Helsinki" },
    update: {},
    create: {
      name: "Helsinki",
      country: "Finland",
      isActive: true,
    },
  });

  const tampere = await prisma.city.upsert({
    where: { name: "Tampere" },
    update: {},
    create: {
      name: "Tampere",
      country: "Finland",
      isActive: true,
    },
  });

  const turku = await prisma.city.upsert({
    where: { name: "Turku" },
    update: {},
    create: {
      name: "Turku",
      country: "Finland",
      isActive: true,
    },
  });

  // Create Users
  console.log("👥 Creating users...");
  const hashedPassword = await hash("password123", 12);

  const user1 = await prisma.user.upsert({
    where: { email: "alex.johnson@example.com" },
    update: {},
    create: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "sarah.miller@example.com" },
    update: {},
    create: {
      name: "Sarah Miller",
      email: "sarah.miller@example.com",
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "mikko.korhonen@example.com" },
    update: {},
    create: {
      name: "Mikko Korhonen",
      email: "mikko.korhonen@example.com",
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  // Create Bars for Helsinki
  console.log("🍻 Creating bars...");
  const helsinkiBars = await Promise.all([
    prisma.bar.upsert({
      where: { name: "The Old Irish Pub" },
      update: {},
      create: {
        name: "The Old Irish Pub",
        description: "Cozy Irish pub with live music and great beer selection",
        address: "Mannerheimintie 5, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kampii",
        type: "PUB",
        latitude: 60.1699,
        longitude: 24.9384,
        imageUrl:
          "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=500",
        phone: "+358 10 1234567",
        website: "https://oldirishpub.fi",
        vipEnabled: true,
        vipPrice: 15.0,
        vipCapacity: 20,
        isActive: true,
      },
    }),

    prisma.bar.upsert({
      where: { name: "Nightclub Aurora" },
      update: {},
      create: {
        name: "Nightclub Aurora",
        description: "Trendy nightclub with DJs and cocktail bar",
        address: "Eerikinkatu 11, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kamppi",
        type: "CLUB",
        latitude: 60.1685,
        longitude: 24.9328,
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
        phone: "+358 10 1234568",
        website: "https://auroranightclub.fi",
        vipEnabled: true,
        vipPrice: 25.0,
        vipCapacity: 15,
        isActive: true,
      },
    }),

    prisma.bar.upsert({
      where: { name: "Cocktail Lounge 56" },
      update: {},
      create: {
        name: "Cocktail Lounge 56",
        description: "Sophisticated cocktail bar with expert mixologists",
        address: "Pohjoisesplanadi 33, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kluuvi",
        type: "COCKTAIL_BAR",
        latitude: 60.1678,
        longitude: 24.9456,
        imageUrl:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500",
        phone: "+358 10 1234569",
        website: "https://lounge56.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),

    prisma.bar.upsert({
      where: { name: "Sports Bar Helsinki" },
      update: {},
      create: {
        name: "Sports Bar Helsinki",
        description: "The best place to watch sports with friends",
        address: "Kaivokatu 8, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Keskusta",
        type: "SPORTS_BAR",
        latitude: 60.1699,
        longitude: 24.9417,
        imageUrl:
          "https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=500",
        phone: "+358 10 1234570",
        website: "https://sportsbarhelsinki.fi",
        vipEnabled: true,
        vipPrice: 10.0,
        vipCapacity: 30,
        isActive: true,
      },
    }),
  ]);

  // Create Bars for Tampere
  const tampereBars = await Promise.all([
    prisma.bar.upsert({
      where: { name: "Tampere Pub Crawl Hub" },
      update: {},
      create: {
        name: "Tampere Pub Crawl Hub",
        description: "Popular student pub with great atmosphere",
        address: "Hämeenkatu 10, 33100 Tampere",
        cityId: tampere.id,
        district: "Keskusta",
        type: "PUB",
        latitude: 61.4978,
        longitude: 23.761,
        imageUrl:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500",
        phone: "+358 10 1234571",
        website: "https://tamperepubs.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),

    prisma.bar.upsert({
      where: { name: "Klubi Tampere" },
      update: {},
      create: {
        name: "Klubi Tampere",
        description: "Live music venue and club in the heart of Tampere",
        address: "Tullikamarin aukio 2, 33100 Tampere",
        cityId: tampere.id,
        district: "Tulli",
        type: "LIVE_MUSIC",
        latitude: 61.4991,
        longitude: 23.7612,
        imageUrl:
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500",
        phone: "+358 10 1234572",
        website: "https://klubi.net",
        vipEnabled: true,
        vipPrice: 12.0,
        vipCapacity: 25,
        isActive: true,
      },
    }),
  ]);

  // Create Crawls
  console.log("🗺️ Creating crawls...");

  // Helsinki Weekend Crawl
  const helsinkiCrawl = await prisma.crawl.create({
    data: {
      name: "Helsinki Weekend Adventure",
      description:
        "Explore the best bars in Helsinki city center. Perfect for groups and solo travelers looking to meet new people!",
      creatorId: user1.id,
      cityId: helsinki.id,
      date: new Date("2024-02-15T19:00:00Z"),
      startTime: new Date("2024-02-15T19:00:00Z"),
      endTime: new Date("2024-02-16T01:00:00Z"),
      maxParticipants: 15,
      isPublic: true,
      status: "UPCOMING",
      crawlBars: {
        create: [
          {
            barId: helsinkiBars[0].id,
            orderIndex: 1,
            duration: 90,
            startTime: new Date("2024-02-15T19:00:00Z"),
          },
          {
            barId: helsinkiBars[1].id,
            orderIndex: 2,
            duration: 60,
            startTime: new Date("2024-02-15T20:30:00Z"),
          },
          {
            barId: helsinkiBars[2].id,
            orderIndex: 3,
            duration: 75,
            startTime: new Date("2024-02-15T21:30:00Z"),
          },
        ],
      },
      participants: {
        create: [
          { userId: user1.id }, // Creator
          { userId: user2.id },
        ],
      },
    },
    include: {
      participants: true,
      crawlBars: {
        include: { bar: true },
      },
    },
  });

  // Tampere Student Crawl
  const tampereCrawl = await prisma.crawl.create({
    data: {
      name: "Tampere Student Night",
      description:
        "Student-friendly bar crawl through Tampere city center. Affordable drinks and great company!",
      creatorId: user3.id,
      cityId: tampere.id,
      date: new Date("2024-02-16T20:00:00Z"),
      startTime: new Date("2024-02-16T20:00:00Z"),
      endTime: new Date("2024-02-17T02:00:00Z"),
      maxParticipants: 12,
      isPublic: true,
      status: "PLANNING",
      crawlBars: {
        create: [
          {
            barId: tampereBars[0].id,
            orderIndex: 1,
            duration: 80,
            startTime: new Date("2024-02-16T20:00:00Z"),
          },
          {
            barId: tampereBars[1].id,
            orderIndex: 2,
            duration: 120,
            startTime: new Date("2024-02-16T21:20:00Z"),
          },
        ],
      },
      participants: {
        create: [
          { userId: user3.id }, // Creator
        ],
      },
    },
    include: {
      participants: true,
      crawlBars: {
        include: { bar: true },
      },
    },
  });

  // Helsinki VIP Experience
  const helsinkiVIPCrawl = await prisma.crawl.create({
    data: {
      name: "Helsinki VIP Experience",
      description:
        "Premium bar crawl with VIP access and skip-the-line privileges. Luxury experience!",
      creatorId: user2.id,
      cityId: helsinki.id,
      date: new Date("2024-02-20T18:30:00Z"),
      startTime: new Date("2024-02-20T18:30:00Z"),
      endTime: new Date("2024-02-21T00:00:00Z"),
      maxParticipants: 8,
      isPublic: true,
      status: "PLANNING",
      crawlBars: {
        create: [
          {
            barId: helsinkiBars[1].id, // Nightclub Aurora
            orderIndex: 1,
            duration: 60,
            startTime: new Date("2024-02-20T18:30:00Z"),
          },
          {
            barId: helsinkiBars[3].id, // Sports Bar Helsinki
            orderIndex: 2,
            duration: 90,
            startTime: new Date("2024-02-20T19:30:00Z"),
          },
          {
            barId: helsinkiBars[2].id, // Cocktail Lounge 56
            orderIndex: 3,
            duration: 90,
            startTime: new Date("2024-02-20T21:00:00Z"),
          },
        ],
      },
      participants: {
        create: [
          { userId: user2.id }, // Creator
          { userId: user1.id },
        ],
      },
    },
    include: {
      participants: true,
      crawlBars: {
        include: { bar: true },
      },
    },
  });

  // Create some chat messages
  console.log("💬 Creating chat messages...");
  await prisma.crawlChatMessage.createMany({
    data: [
      {
        crawlId: helsinkiCrawl.id,
        userId: user1.id,
        content: "Hey everyone! Looking forward to our crawl this weekend! 🎉",
      },
      {
        crawlId: helsinkiCrawl.id,
        userId: user2.id,
        content: "Me too! What should we wear? Is it casual or dressy?",
      },
      {
        crawlId: tampereCrawl.id,
        userId: user3.id,
        content:
          "Welcome to the Tampere crawl! We'll meet at the first bar 15 minutes before start time.",
      },
    ],
  });

  // Create some groups and group chats
  console.log("👥 Creating groups...");
  const helsinkiGroup = await prisma.group.create({
    data: {
      name: "Helsinki Nightlife Explorers",
      description: "For people who love exploring Helsinki nightlife",
      creatorId: user1.id,
      cityId: helsinki.id,
      isPublic: true,
      maxMembers: 20,
      members: {
        create: [{ userId: user1.id }, { userId: user2.id }],
      },
      chats: {
        create: [
          {
            userId: user1.id,
            content: "Welcome to the group! Anyone up for drinks this weekend?",
          },
          {
            userId: user2.id,
            content: "I'm in! Which area are we thinking?",
          },
        ],
      },
    },
  });

  // Create some VIP passes
  console.log("🎫 Creating VIP passes...");
  await prisma.vIPPass.create({
    data: {
      userId: user1.id,
      barId: helsinkiBars[0].id, // The Old Irish Pub
      qrCode: "VIP-HELS-001",
      startTime: new Date("2024-02-15T19:00:00Z"),
      endTime: new Date("2024-02-16T01:00:00Z"),
    },
  });

  console.log("✅ Seed completed!");
  console.log(`📊 Created:`);
  console.log(`   - ${await prisma.user.count()} users`);
  console.log(`   - ${await prisma.city.count()} cities`);
  console.log(`   - ${await prisma.bar.count()} bars`);
  console.log(`   - ${await prisma.crawl.count()} crawls`);
  console.log(
    `   - ${await prisma.crawlParticipant.count()} crawl participants`
  );
  console.log(`   - ${await prisma.crawlBar.count()} crawl bars`);
  console.log(
    `   - ${await prisma.crawlChatMessage.count()} crawl chat messages`
  );
  console.log(`   - ${await prisma.group.count()} groups`);
  console.log(`   - ${await prisma.vIPPass.count()} VIP passes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
