import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data in correct order to respect foreign key constraints
  console.log("🧹 Clearing existing data...");
  await prisma.crawlChatMessage.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.crawlParticipant.deleteMany();
  await prisma.userGroup.deleteMany();
  await prisma.phoneVerification.deleteMany();
  await prisma.vIPPass.deleteMany();
  await prisma.featuredBar.deleteMany();
  await prisma.crawlBar.deleteMany();
  await prisma.crawl.deleteMany();
  await prisma.group.deleteMany();
  await prisma.bar.deleteMany();
  await prisma.city.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create Cities
  console.log("🏙️ Creating cities...");
  const helsinki = await prisma.city.create({
    data: {
      name: "Helsinki",
      country: "Finland",
      isActive: true,
    },
  });

  const tampere = await prisma.city.create({
    data: {
      name: "Tampere",
      country: "Finland",
      isActive: true,
    },
  });

  const turku = await prisma.city.create({
    data: {
      name: "Turku",
      country: "Finland",
      isActive: true,
    },
  });

  // Create Users
  console.log("👥 Creating users...");
  const hashedPassword = await hash("password123", 12);

  const user1 = await prisma.user.create({
    data: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Sarah Miller",
      email: "sarah.miller@example.com",
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Mikko Korhonen",
      email: "mikko.korhonen@example.com",
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: "Emma Virtanen",
      email: "emma.virtanen@example.com",
      hashedPassword,
      emailVerified: new Date(),
    },
  });

  // Create Bars for Helsinki
  console.log("🍻 Creating Helsinki bars...");
  const helsinkiBars = await Promise.all([
    prisma.bar.create({
      data: {
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

    prisma.bar.create({
      data: {
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

    prisma.bar.create({
      data: {
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

    prisma.bar.create({
      data: {
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

    prisma.bar.create({
      data: {
        name: "Beer Garden Helsinki",
        description: "Outdoor beer garden with craft beers and snacks",
        address: "Kasarmikatu 26, 00130 Helsinki",
        cityId: helsinki.id,
        district: "Kaartinkaupunki",
        type: "PUB",
        latitude: 60.1631,
        longitude: 24.9452,
        imageUrl:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500",
        phone: "+358 10 1234571",
        website: "https://beergardenhelsinki.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),

    // Additional Helsinki bars to ensure uniqueness
    prisma.bar.create({
      data: {
        name: "Helsinki Jazz Club",
        description: "Intimate jazz venue with live performances",
        address: "Pohjoisesplanadi 21, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kluuvi",
        type: "LIVE_MUSIC",
        latitude: 60.1685,
        longitude: 24.9442,
        imageUrl:
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500",
        phone: "+358 10 1234577",
        website: "https://helsinkijazz.fi",
        vipEnabled: true,
        vipPrice: 20.0,
        vipCapacity: 12,
        isActive: true,
      },
    }),

    prisma.bar.create({
      data: {
        name: "Sky Lounge Helsinki",
        description: "Rooftop lounge with amazing city views",
        address: "Mikonkatu 15, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kampii",
        type: "LOUNGE",
        latitude: 60.1689,
        longitude: 24.9334,
        imageUrl:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500",
        phone: "+358 10 1234578",
        website: "https://skyloungehelsinki.fi",
        vipEnabled: true,
        vipPrice: 20.0,
        vipCapacity: 15,
        isActive: true,
      },
    }),

    prisma.bar.create({
      data: {
        name: "Karaoke Box Helsinki",
        description: "Private karaoke rooms with extensive song selection",
        address: "Annankatu 22, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kamppi",
        type: "KARAOKE",
        latitude: 60.1672,
        longitude: 24.9356,
        imageUrl:
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
        phone: "+358 10 1234579",
        website: "https://karaokebox.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),
  ]);

  // Create Bars for Tampere
  console.log("🍻 Creating Tampere bars...");
  const tampereBars = await Promise.all([
    prisma.bar.create({
      data: {
        name: "Tampere Pub Crawl Hub",
        description: "Popular student pub with great atmosphere",
        address: "Hämeenkatu 10, 33100 Tampere",
        cityId: tampere.id,
        district: "Keskusta",
        type: "PUB",
        latitude: 61.4978,
        longitude: 23.761,
        imageUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        phone: "+358 10 1234572",
        website: "https://tamperepubs.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),

    prisma.bar.create({
      data: {
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
        phone: "+358 10 1234573",
        website: "https://klubi.net",
        vipEnabled: true,
        vipPrice: 12.0,
        vipCapacity: 25,
        isActive: true,
      },
    }),

    prisma.bar.create({
      data: {
        name: "Panimoravintola Plevna",
        description: "Historic brewery restaurant with craft beers",
        address: "Itäinenkatu 8, 33210 Tampere",
        cityId: tampere.id,
        district: "Tammela",
        type: "RESTAURANT_BAR",
        latitude: 61.4998,
        longitude: 23.7623,
        imageUrl:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500",
        phone: "+358 10 1234574",
        website: "https://plevna.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),

    // Additional Tampere bars
    prisma.bar.create({
      data: {
        name: "Tampere Sports Arena",
        description: "Massive sports bar with multiple big screens",
        address: "Hämeenkatu 5, 33100 Tampere",
        cityId: tampere.id,
        district: "Keskusta",
        type: "SPORTS_BAR",
        latitude: 61.4975,
        longitude: 23.7602,
        imageUrl:
          "https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=500",
        phone: "+358 10 1234580",
        website: "https://tamparesports.fi",
        vipEnabled: true,
        vipPrice: 10.0,
        vipCapacity: 30,
        isActive: true,
      },
    }),
  ]);

  // Create Bars for Turku
  console.log("🍻 Creating Turku bars...");
  const turkuBars = await Promise.all([
    prisma.bar.create({
      data: {
        name: "Uusi Apteekki",
        description: "Stylish pharmacy-themed cocktail bar",
        address: "Kaskenkatu 1, 20700 Turku",
        cityId: turku.id,
        district: "Kaskenranta",
        type: "COCKTAIL_BAR",
        latitude: 60.4518,
        longitude: 22.2666,
        imageUrl:
          "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500",
        phone: "+358 10 1234575",
        website: "https://uusiapteekki.fi",
        vipEnabled: true,
        vipPrice: 18.0,
        vipCapacity: 12,
        isActive: true,
      },
    }),

    prisma.bar.create({
      data: {
        name: "Koulu Brewery",
        description: "Brewpub in a historic school building",
        address: "Eerikinkatu 18, 20100 Turku",
        cityId: turku.id,
        district: "VII",
        type: "PUB",
        latitude: 60.4521,
        longitude: 22.2693,
        imageUrl:
          "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500",
        phone: "+358 10 1234576",
        website: "https://koulu.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),

    // Additional Turku bars
    prisma.bar.create({
      data: {
        name: "Turku River Lounge",
        description: "Elegant lounge overlooking Aura River",
        address: "Linnankatu 5, 20100 Turku",
        cityId: turku.id,
        district: "I",
        type: "LOUNGE",
        latitude: 60.4512,
        longitude: 22.267,
        imageUrl:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500",
        phone: "+358 10 1234581",
        website: "https://turkuriverlounge.fi",
        vipEnabled: true,
        vipPrice: 16.0,
        vipCapacity: 20,
        isActive: true,
      },
    }),
  ]);

  // Create Crawls - UPCOMING EVENTS (2025)
  console.log("🗺️ Creating upcoming crawls...");

  // Helsinki Weekend Adventure - UPCOMING (uses bars 0, 1, 2)
  const helsinkiCrawl = await prisma.crawl.create({
    data: {
      name: "Helsinki Weekend Adventure",
      description:
        "Explore the best bars in Helsinki city center. Perfect for groups and solo travelers looking to meet new people!",
      creatorId: user1.id,
      cityId: helsinki.id,
      date: new Date("2025-02-15T19:00:00Z"),
      startTime: new Date("2025-02-15T19:00:00Z"),
      endTime: new Date("2025-02-16T01:00:00Z"),
      maxParticipants: 15,
      isPublic: true,
      status: "UPCOMING",
      crawlBars: {
        create: [
          {
            barId: helsinkiBars[0].id, // The Old Irish Pub
            orderIndex: 1,
            duration: 90,
            startTime: new Date("2025-02-15T19:00:00Z"),
          },
          {
            barId: helsinkiBars[1].id, // Nightclub Aurora
            orderIndex: 2,
            duration: 60,
            startTime: new Date("2025-02-15T20:30:00Z"),
          },
          {
            barId: helsinkiBars[2].id, // Cocktail Lounge 56
            orderIndex: 3,
            duration: 75,
            startTime: new Date("2025-02-15T21:30:00Z"),
          },
        ],
      },
      participants: {
        create: [
          { userId: user1.id }, // Creator
          { userId: user2.id },
          { userId: user3.id },
        ],
      },
    },
  });

  // Tampere Student Night - UPCOMING (uses bars 0, 1)
  const tampereCrawl = await prisma.crawl.create({
    data: {
      name: "Tampere Student Night",
      description:
        "Student-friendly bar crawl through Tampere city center. Affordable drinks and great company!",
      creatorId: user3.id,
      cityId: tampere.id,
      date: new Date("2025-02-20T20:00:00Z"),
      startTime: new Date("2025-02-20T20:00:00Z"),
      endTime: new Date("2025-02-21T02:00:00Z"),
      maxParticipants: 12,
      isPublic: true,
      status: "UPCOMING",
      crawlBars: {
        create: [
          {
            barId: tampereBars[0].id, // Tampere Pub Crawl Hub
            orderIndex: 1,
            duration: 80,
            startTime: new Date("2025-02-20T20:00:00Z"),
          },
          {
            barId: tampereBars[1].id, // Klubi Tampere
            orderIndex: 2,
            duration: 120,
            startTime: new Date("2025-02-20T21:20:00Z"),
          },
        ],
      },
      participants: {
        create: [
          { userId: user3.id }, // Creator
          { userId: user4.id },
        ],
      },
    },
  });

  // Helsinki VIP Experience - PLANNING (uses bars 5, 6, 7 - NEW bars)
  const helsinkiVIPCrawl = await prisma.crawl.create({
    data: {
      name: "Helsinki VIP Experience",
      description:
        "Premium bar crawl with VIP access and skip-the-line privileges. Luxury experience!",
      creatorId: user2.id,
      cityId: helsinki.id,
      date: new Date("2025-03-05T18:30:00Z"),
      startTime: new Date("2025-03-05T18:30:00Z"),
      endTime: new Date("2025-03-06T00:00:00Z"),
      maxParticipants: 8,
      isPublic: true,
      status: "PLANNING",
      crawlBars: {
        create: [
          {
            barId: helsinkiBars[5].id, // Helsinki Jazz Club
            orderIndex: 1,
            duration: 60,
            startTime: new Date("2025-03-05T18:30:00Z"),
          },
          {
            barId: helsinkiBars[6].id, // Sky Lounge Helsinki
            orderIndex: 2,
            duration: 90,
            startTime: new Date("2025-03-05T19:30:00Z"),
          },
          {
            barId: helsinkiBars[7].id, // Karaoke Box Helsinki
            orderIndex: 3,
            duration: 90,
            startTime: new Date("2025-03-05T21:00:00Z"),
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
  });

  // Turku Historic Pub Crawl - UPCOMING (uses bars 0, 1)
  const turkuCrawl = await prisma.crawl.create({
    data: {
      name: "Turku Historic Pub Crawl",
      description: "Discover Turku's historic bars and pubs with local guides",
      creatorId: user4.id,
      cityId: turku.id,
      date: new Date("2025-02-28T19:00:00Z"),
      startTime: new Date("2025-02-28T19:00:00Z"),
      endTime: new Date("2025-03-01T01:00:00Z"),
      maxParticipants: 20,
      isPublic: true,
      status: "UPCOMING",
      crawlBars: {
        create: [
          {
            barId: turkuBars[0].id, // Uusi Apteekki
            orderIndex: 1,
            duration: 75,
            startTime: new Date("2025-02-28T19:00:00Z"),
          },
          {
            barId: turkuBars[1].id, // Koulu Brewery
            orderIndex: 2,
            duration: 105,
            startTime: new Date("2025-02-28T20:15:00Z"),
          },
        ],
      },
      participants: {
        create: [
          { userId: user4.id }, // Creator
          { userId: user1.id },
          { userId: user2.id },
          { userId: user3.id },
        ],
      },
    },
  });

  // Create PAST crawls for testing history
  console.log("🗺️ Creating past crawls...");

  // Past Helsinki Crawl - COMPLETED (uses bars 3, 4 - NEW bars)
  const pastHelsinkiCrawl = await prisma.crawl.create({
    data: {
      name: "Helsinki New Years Eve 2024",
      description: "Amazing New Years celebration across Helsinki bars",
      creatorId: user1.id,
      cityId: helsinki.id,
      date: new Date("2024-12-31T20:00:00Z"),
      startTime: new Date("2024-12-31T20:00:00Z"),
      endTime: new Date("2025-01-01T04:00:00Z"),
      maxParticipants: 25,
      isPublic: true,
      status: "COMPLETED",
      crawlBars: {
        create: [
          {
            barId: helsinkiBars[3].id, // Sports Bar Helsinki
            orderIndex: 1,
            duration: 90,
            startTime: new Date("2024-12-31T20:00:00Z"),
          },
          {
            barId: helsinkiBars[4].id, // Beer Garden Helsinki
            orderIndex: 2,
            duration: 90,
            startTime: new Date("2024-12-31T21:30:00Z"),
          },
        ],
      },
      participants: {
        create: [
          { userId: user1.id },
          { userId: user2.id },
          { userId: user3.id },
          { userId: user4.id },
        ],
      },
    },
  });

  // Past Tampere Crawl - CANCELLED (uses bars 2, 3 - NEW bars)
  const pastTampereCrawl = await prisma.crawl.create({
    data: {
      name: "Tampere Winter Festival Pub Crawl",
      description: "Winter festival special pub crawl",
      creatorId: user3.id,
      cityId: tampere.id,
      date: new Date("2024-11-15T19:00:00Z"),
      startTime: new Date("2024-11-15T19:00:00Z"),
      endTime: new Date("2024-11-16T01:00:00Z"),
      maxParticipants: 15,
      isPublic: true,
      status: "CANCELLED",
      crawlBars: {
        create: [
          {
            barId: tampereBars[2].id, // Panimoravintola Plevna
            orderIndex: 1,
            duration: 80,
            startTime: new Date("2024-11-15T19:00:00Z"),
          },
          {
            barId: tampereBars[3].id, // Tampere Sports Arena
            orderIndex: 2,
            duration: 100,
            startTime: new Date("2024-11-15T20:20:00Z"),
          },
        ],
      },
      participants: {
        create: [{ userId: user3.id }, { userId: user4.id }],
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
        crawlId: helsinkiCrawl.id,
        userId: user3.id,
        content:
          "Most bars are casual, but Nightclub Aurora might be a bit dressier!",
      },
      {
        crawlId: tampereCrawl.id,
        userId: user3.id,
        content:
          "Welcome to the Tampere crawl! We'll meet at the first bar 15 minutes before start time.",
      },
      {
        crawlId: turkuCrawl.id,
        userId: user4.id,
        content: "Excited to show you all the historic bars of Turku! 🏰",
      },
    ],
  });

  // Create groups
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
        create: [
          { userId: user1.id },
          { userId: user2.id },
          { userId: user4.id },
        ],
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

  // Create VIP passes
  console.log("🎫 Creating VIP passes...");
  await prisma.vIPPass.createMany({
    data: [
      {
        userId: user1.id,
        barId: helsinkiBars[0].id, // The Old Irish Pub
        qrCode: "VIP-HELS-001",
        startTime: new Date("2025-02-15T19:00:00Z"),
        endTime: new Date("2025-02-16T01:00:00Z"),
      },
      {
        userId: user2.id,
        barId: helsinkiBars[1].id, // Nightclub Aurora
        qrCode: "VIP-HELS-002",
        startTime: new Date("2025-03-05T18:30:00Z"),
        endTime: new Date("2025-03-06T00:00:00Z"),
      },
    ],
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
