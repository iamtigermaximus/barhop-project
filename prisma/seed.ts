import {
  PrismaClient,
  SocialVibe,
  SocialStatus,
  InteractionType,
  InteractionStatus,
  BarType,
  CrawlStatus,
  MeetupStatus,
  ParticipantStatus,
  MessageType,
  VIPPassType,
  VIPPassStatus,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data in correct order to respect foreign key constraints
  console.log("🧹 Clearing existing data...");
  await prisma.socialChatMessage.deleteMany();
  await prisma.meetupParticipant.deleteMany();
  await prisma.socialInteraction.deleteMany();
  await prisma.socialMeetup.deleteMany();
  await prisma.userSocialStats.deleteMany();
  await prisma.barSocialActivity.deleteMany();
  await prisma.userSocialProfile.deleteMany();
  await prisma.crawlChatMessage.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.crawlParticipant.deleteMany();
  await prisma.userGroup.deleteMany();
  await prisma.phoneVerification.deleteMany();
  await prisma.userVIPPass.deleteMany();
  await prisma.vIPPassEnhanced.deleteMany();
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

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Miller",
        email: "sarah.miller@example.com",
        hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Mikko Korhonen",
        email: "mikko.korhonen@example.com",
        hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Emma Virtanen",
        email: "emma.virtanen@example.com",
        hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "David Chen",
        email: "david.chen@example.com",
        hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Lisa Park",
        email: "lisa.park@example.com",
        hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Jari Nieminen",
        email: "jari.nieminen@example.com",
        hashedPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Sofia Karlsson",
        email: "sofia.karlsson@example.com",
        hashedPassword,
        emailVerified: new Date(),
      },
    }),
  ]);

  const [user1, user2, user3, user4, user5, user6, user7, user8] = users;

  // Create Bars for Helsinki - 3 for each BarType
  console.log("🍻 Creating Helsinki bars...");
  const helsinkiBars = await Promise.all([
    // PUB (3 bars)
    prisma.bar.create({
      data: {
        name: "The Old Irish Pub",
        description: "Cozy Irish pub with live music and great beer selection",
        address: "Mannerheimintie 5, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kampii",
        type: BarType.PUB,
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
        name: "Helsinki Beer House",
        description: "Traditional Finnish pub with local craft beers",
        address: "Mikonkatu 13, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kampii",
        type: BarType.PUB,
        latitude: 60.1682,
        longitude: 24.9378,
        imageUrl:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500",
        phone: "+358 10 1234568",
        website: "https://helsinkibeerhouse.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "The English Pub",
        description: "Authentic British pub with imported beers and pub food",
        address: "Kaisaniemenkatu 3, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kaisaniemi",
        type: BarType.PUB,
        latitude: 60.1712,
        longitude: 24.9456,
        imageUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        phone: "+358 10 1234569",
        website: "https://englishpubhelsinki.fi",
        vipEnabled: true,
        vipPrice: 12.0,
        vipCapacity: 15,
        isActive: true,
      },
    }),

    // CLUB (3 bars)
    prisma.bar.create({
      data: {
        name: "Nightclub Aurora",
        description: "Trendy nightclub with DJs and cocktail bar",
        address: "Eerikinkatu 11, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kamppi",
        type: BarType.CLUB,
        latitude: 60.1685,
        longitude: 24.9328,
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
        phone: "+358 10 1234570",
        website: "https://auroranightclub.fi",
        vipEnabled: true,
        vipPrice: 25.0,
        vipCapacity: 15,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Club Helsinki",
        description: "Multi-level club with different music genres",
        address: "Annankatu 14, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kamppi",
        type: BarType.CLUB,
        latitude: 60.1678,
        longitude: 24.9352,
        imageUrl:
          "https://images.unsplash.com/photo-1566737238752-1c3e1cf6b9ba?w=500",
        phone: "+358 10 1234571",
        website: "https://clubhelsinki.fi",
        vipEnabled: true,
        vipPrice: 20.0,
        vipCapacity: 25,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Dance Factory",
        description: "Electronic music club with international DJs",
        address: "Fredrikinkatu 34, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Punavuori",
        type: BarType.CLUB,
        latitude: 60.1634,
        longitude: 24.9398,
        imageUrl:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500",
        phone: "+358 10 1234572",
        website: "https://dancefactory.fi",
        vipEnabled: true,
        vipPrice: 18.0,
        vipCapacity: 30,
        isActive: true,
      },
    }),

    // LOUNGE (3 bars)
    prisma.bar.create({
      data: {
        name: "Sky Lounge Helsinki",
        description: "Rooftop lounge with amazing city views",
        address: "Mikonkatu 15, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kampii",
        type: BarType.LOUNGE,
        latitude: 60.1689,
        longitude: 24.9334,
        imageUrl:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500",
        phone: "+358 10 1234573",
        website: "https://skyloungehelsinki.fi",
        vipEnabled: true,
        vipPrice: 20.0,
        vipCapacity: 15,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Velvet Lounge",
        description: "Sophisticated lounge with jazz evenings",
        address: "Pohjoisesplanadi 25, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kluuvi",
        type: BarType.LOUNGE,
        latitude: 60.1682,
        longitude: 24.9448,
        imageUrl:
          "https://images.unsplash.com/photo-1449247613801-ab06418e2861?w=500",
        phone: "+358 10 1234574",
        website: "https://velvetlounge.fi",
        vipEnabled: true,
        vipPrice: 15.0,
        vipCapacity: 12,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Urban Retreat Lounge",
        description: "Modern lounge with creative cocktails",
        address: "Kasarmikatu 44, 00130 Helsinki",
        cityId: helsinki.id,
        district: "Kaartinkaupunki",
        type: BarType.LOUNGE,
        latitude: 60.1628,
        longitude: 24.9462,
        imageUrl:
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500",
        phone: "+358 10 1234575",
        website: "https://urbanretreat.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),

    // COCKTAIL_BAR (3 bars)
    prisma.bar.create({
      data: {
        name: "Cocktail Lounge 56",
        description: "Sophisticated cocktail bar with expert mixologists",
        address: "Pohjoisesplanadi 33, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kluuvi",
        type: BarType.COCKTAIL_BAR,
        latitude: 60.1678,
        longitude: 24.9456,
        imageUrl:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500",
        phone: "+358 10 1234576",
        website: "https://lounge56.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Spirit Society",
        description: "Craft cocktail bar with rare spirits",
        address: "Iso Roobertinkatu 16, 00120 Helsinki",
        cityId: helsinki.id,
        district: "Punavuori",
        type: BarType.COCKTAIL_BAR,
        latitude: 60.1621,
        longitude: 24.9402,
        imageUrl:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500",
        phone: "+358 10 1234577",
        website: "https://spiritsociety.fi",
        vipEnabled: true,
        vipPrice: 25.0,
        vipCapacity: 8,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "The Alchemist",
        description: "Molecular mixology and creative cocktails",
        address: "Eerikinkatu 27, 00180 Helsinki",
        cityId: helsinki.id,
        district: "Kamppi",
        type: BarType.COCKTAIL_BAR,
        latitude: 60.1662,
        longitude: 24.9318,
        imageUrl:
          "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500",
        phone: "+358 10 1234578",
        website: "https://alchemisthelsinki.fi",
        vipEnabled: true,
        vipPrice: 30.0,
        vipCapacity: 10,
        isActive: true,
      },
    }),

    // RESTAURANT_BAR (3 bars)
    prisma.bar.create({
      data: {
        name: "Grill & Wine Helsinki",
        description: "Fine dining restaurant with extensive wine bar",
        address: "Korkeavuorenkatu 27, 00130 Helsinki",
        cityId: helsinki.id,
        district: "Kaartinkaupunki",
        type: BarType.RESTAURANT_BAR,
        latitude: 60.1632,
        longitude: 24.9478,
        imageUrl:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500",
        phone: "+358 10 1234579",
        website: "https://grillwine.fi",
        vipEnabled: true,
        vipPrice: 15.0,
        vipCapacity: 20,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Sea View Restaurant & Bar",
        description: "Seafood restaurant with harbor views and cocktail bar",
        address: "Kanavaranta 7, 00160 Helsinki",
        cityId: helsinki.id,
        district: "Katajanokka",
        type: BarType.RESTAURANT_BAR,
        latitude: 60.1672,
        longitude: 24.9618,
        imageUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
        phone: "+358 10 1234580",
        website: "https://seaviewhelsinki.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Urban Kitchen & Bar",
        description: "Modern fusion cuisine with craft cocktail bar",
        address: "Mannerheimintie 22, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kamppi",
        type: BarType.RESTAURANT_BAR,
        latitude: 60.1692,
        longitude: 24.9338,
        imageUrl:
          "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=500",
        phone: "+358 10 1234581",
        website: "https://urbankitchen.fi",
        vipEnabled: true,
        vipPrice: 12.0,
        vipCapacity: 18,
        isActive: true,
      },
    }),

    // SPORTS_BAR (3 bars)
    prisma.bar.create({
      data: {
        name: "Sports Bar Helsinki",
        description: "The best place to watch sports with friends",
        address: "Kaivokatu 8, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Keskusta",
        type: BarType.SPORTS_BAR,
        latitude: 60.1699,
        longitude: 24.9417,
        imageUrl:
          "https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=500",
        phone: "+358 10 1234582",
        website: "https://sportsbarhelsinki.fi",
        vipEnabled: true,
        vipPrice: 10.0,
        vipCapacity: 30,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "The Goal Post",
        description: "Sports bar with multiple big screens and pub food",
        address: "Mikonkatu 9, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kamppi",
        type: BarType.SPORTS_BAR,
        latitude: 60.1688,
        longitude: 24.9342,
        imageUrl:
          "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=500",
        phone: "+358 10 1234583",
        website: "https://goalpost.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Champions Sports Bar",
        description: "Premium sports viewing experience with VIP areas",
        address: "Kaisaniemenkatu 5, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kaisaniemi",
        type: BarType.SPORTS_BAR,
        latitude: 60.1718,
        longitude: 24.9462,
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
        phone: "+358 10 1234584",
        website: "https://championssports.fi",
        vipEnabled: true,
        vipPrice: 15.0,
        vipCapacity: 25,
        isActive: true,
      },
    }),

    // KARAOKE (3 bars)
    prisma.bar.create({
      data: {
        name: "Karaoke Box Helsinki",
        description: "Private karaoke rooms with extensive song selection",
        address: "Annankatu 22, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kamppi",
        type: BarType.KARAOKE,
        latitude: 60.1672,
        longitude: 24.9356,
        imageUrl:
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
        phone: "+358 10 1234585",
        website: "https://karaokebox.fi",
        vipEnabled: false,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Sing Along Bar",
        description: "Public karaoke stage and private rooms",
        address: "Iso Roobertinkatu 21, 00120 Helsinki",
        cityId: helsinki.id,
        district: "Punavuori",
        type: BarType.KARAOKE,
        latitude: 60.1618,
        longitude: 24.9412,
        imageUrl:
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500",
        phone: "+358 10 1234586",
        website: "https://singalong.fi",
        vipEnabled: true,
        vipPrice: 8.0,
        vipCapacity: 20,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Voice Factory Karaoke",
        description: "High-tech karaoke with professional sound systems",
        address: "Fredrikinkatu 45, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Punavuori",
        type: BarType.KARAOKE,
        latitude: 60.1624,
        longitude: 24.9386,
        imageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
        phone: "+358 10 1234587",
        website: "https://voicefactory.fi",
        vipEnabled: true,
        vipPrice: 12.0,
        vipCapacity: 15,
        isActive: true,
      },
    }),

    // LIVE_MUSIC (3 bars)
    prisma.bar.create({
      data: {
        name: "Helsinki Jazz Club",
        description: "Intimate jazz venue with live performances",
        address: "Pohjoisesplanadi 21, 00100 Helsinki",
        cityId: helsinki.id,
        district: "Kluuvi",
        type: BarType.LIVE_MUSIC,
        latitude: 60.1685,
        longitude: 24.9442,
        imageUrl:
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500",
        phone: "+358 10 1234588",
        website: "https://helsinkijazz.fi",
        vipEnabled: true,
        vipPrice: 20.0,
        vipCapacity: 12,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "Rock Arena Helsinki",
        description: "Live rock music venue with local and international bands",
        address: "Siltasaarenkatu 6, 00530 Helsinki",
        cityId: helsinki.id,
        district: "Sörnäinen",
        type: BarType.LIVE_MUSIC,
        latitude: 60.1872,
        longitude: 24.9678,
        imageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
        phone: "+358 10 1234589",
        website: "https://rockarena.fi",
        vipEnabled: true,
        vipPrice: 15.0,
        vipCapacity: 50,
        isActive: true,
      },
    }),
    prisma.bar.create({
      data: {
        name: "The Blues Corner",
        description: "Authentic blues bar with nightly live music",
        address: "Albertinkatu 25, 00150 Helsinki",
        cityId: helsinki.id,
        district: "Punavuori",
        type: BarType.LIVE_MUSIC,
        latitude: 60.1598,
        longitude: 24.9384,
        imageUrl:
          "https://images.unsplash.com/photo-1571974599782-87624638275f?w=500",
        phone: "+358 10 1234590",
        website: "https://bluescorner.fi",
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
        type: BarType.PUB,
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
        type: BarType.LIVE_MUSIC,
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
        name: "Tampere Sports Arena Bar",
        description: "Sports bar with big screens and game day specials",
        address: "Rautatienkatu 25, 33100 Tampere",
        cityId: tampere.id,
        district: "Keskusta",
        type: BarType.SPORTS_BAR,
        latitude: 61.4985,
        longitude: 23.7734,
        imageUrl:
          "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=500",
        phone: "+358 10 1234574",
        website: "https://tamperesports.fi",
        vipEnabled: true,
        vipPrice: 8.0,
        vipCapacity: 20,
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
        type: BarType.COCKTAIL_BAR,
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
        type: BarType.PUB,
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
    prisma.bar.create({
      data: {
        name: "Turku Harbor Lounge",
        description: "Lounge bar with beautiful harbor views",
        address: "Linnankatu 32, 20100 Turku",
        cityId: turku.id,
        district: "Portsa",
        type: BarType.LOUNGE,
        latitude: 60.4345,
        longitude: 22.2334,
        imageUrl:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500",
        phone: "+358 10 1234577",
        website: "https://turkuharborlounge.fi",
        vipEnabled: true,
        vipPrice: 15.0,
        vipCapacity: 15,
        isActive: true,
      },
    }),
  ]);

  // Create Enhanced VIP passes (for the new VIP system)
  console.log("⭐ Creating enhanced VIP passes...");

  const enhancedVIPPasses = await Promise.all([
    // Club Helsinki - Friday Night Fast Pass
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[4].id, // Club Helsinki
        name: "Friday Night Fast Pass",
        description:
          "Skip the line and get priority entry on Friday nights at Helsinki's hottest club",
        type: VIPPassType.SKIP_LINE,
        priceCents: 1500, // €15.00
        originalPriceCents: 2000, // Original €20.00 - showing discount
        benefits: [
          "Skip 45min line",
          "Priority entry",
          "Cover fee included",
          "Express coat check",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 1000, // €10 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["friday", "saturday"],
        validHours: { start: "20:00", end: "02:00" },
        totalQuantity: 50,
        soldCount: 12,
        maxPerUser: 2,
        isActive: true,
      },
    }),
    // Nightclub Aurora - VIP Experience
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[3].id, // Nightclub Aurora
        name: "VIP Club Experience",
        description:
          "Premium VIP treatment with reserved seating and bottle service access",
        type: VIPPassType.PREMIUM_ENTRY,
        priceCents: 2500, // €25.00
        benefits: [
          "Skip 60min line",
          "Reserved seating area",
          "Bottle service priority",
          "VIP host",
          "Complimentary champagne",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 1500, // €15 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["friday", "saturday"],
        validHours: { start: "22:00", end: "04:00" },
        totalQuantity: 20,
        soldCount: 8,
        maxPerUser: 1,
        isActive: true,
      },
    }),
    // Sky Lounge Helsinki - Sunset Pass
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[6].id, // Sky Lounge Helsinki
        name: "Sunset VIP Pass",
        description:
          "Enjoy Helsinki's best sunset views with premium lounge access",
        type: VIPPassType.COVER_INCLUDED,
        priceCents: 2000, // €20.00
        originalPriceCents: 2500, // Original €25.00
        benefits: [
          "Priority rooftop access",
          "Cover fee included",
          "Complimentary welcome drink",
          "Best sunset views",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 1200, // €12 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-10-31"), // Seasonal (until winter)
        validDays: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        validHours: { start: "17:00", end: "21:00" },
        totalQuantity: 30,
        soldCount: 5,
        maxPerUser: 4,
        isActive: true,
      },
    }),
    // The Alchemist - Mixology Experience
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[11].id, // The Alchemist
        name: "Mixology VIP Pass",
        description:
          "Exclusive access to molecular mixology experience with master mixologists",
        type: VIPPassType.PREMIUM_ENTRY,
        priceCents: 3000, // €30.00
        benefits: [
          "Guaranteed seating",
          "Molecular cocktail tasting",
          "Meet the mixologist",
          "VIP cocktail menu",
        ],
        skipLinePriority: true,
        coverFeeIncluded: false,
        coverFeeAmount: 0,
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["thursday", "friday", "saturday"],
        validHours: { start: "19:00", end: "23:00" },
        totalQuantity: 12,
        soldCount: 3,
        maxPerUser: 2,
        isActive: true,
      },
    }),
    // Sports Bar Helsinki - Game Day Pass
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[15].id, // Sports Bar Helsinki
        name: "Game Day VIP Pass",
        description:
          "Best seats in the house for major sports events with drink specials",
        type: VIPPassType.PREMIUM_ENTRY,
        priceCents: 1200, // €12.00
        benefits: [
          "Reserved premium seating",
          "Game day drink specials",
          "Skip entry line",
          "Priority service",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 500, // €5 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["saturday", "sunday"],
        validHours: { start: "12:00", end: "23:00" },
        totalQuantity: 25,
        soldCount: 15,
        maxPerUser: 4,
        isActive: true,
      },
    }),
    // Helsinki Jazz Club - Weekend VIP
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[21].id, // Helsinki Jazz Club
        name: "Weekend Jazz VIP",
        description:
          "Premium seating for weekend jazz performances with cocktail package",
        type: VIPPassType.COVER_INCLUDED,
        priceCents: 3500, // €35.00
        originalPriceCents: 4500, // Original €45.00
        benefits: [
          "Front row seating",
          "Cover fee included",
          "Welcome cocktail",
          "Meet the artists (when available)",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 2000, // €20 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["friday", "saturday"],
        validHours: { start: "19:00", end: "01:00" },
        totalQuantity: 15,
        soldCount: 7,
        maxPerUser: 2,
        isActive: true,
      },
    }),
    // Rock Arena Helsinki - Concert Fast Pass
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[22].id, // Rock Arena Helsinki
        name: "Concert Fast Pass",
        description:
          "Skip the line and get early entry for live concerts and events",
        type: VIPPassType.SKIP_LINE,
        priceCents: 1800, // €18.00
        benefits: [
          "Skip 30min entry line",
          "Early venue access",
          "Cover fee included",
          "Merchandise discount",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 1000, // €10 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["friday", "saturday"],
        validHours: { start: "19:00", end: "02:00" },
        totalQuantity: 40,
        soldCount: 22,
        maxPerUser: 4,
        isActive: true,
      },
    }),
    // Velvet Lounge - Weekday Executive Pass
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[7].id, // Velvet Lounge
        name: "Executive Weekday Pass",
        description:
          "Perfect for business meetings and after-work networking sessions",
        type: VIPPassType.PREMIUM_ENTRY,
        priceCents: 1500, // €15.00
        benefits: [
          "Reserved quiet area",
          "Complimentary appetizer",
          "Priority service",
          "Business networking events access",
        ],
        skipLinePriority: false,
        coverFeeIncluded: false,
        coverFeeAmount: 0,
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["monday", "tuesday", "wednesday", "thursday"],
        validHours: { start: "16:00", end: "22:00" },
        totalQuantity: 20,
        soldCount: 6,
        maxPerUser: 6,
        isActive: true,
      },
    }),
    // Spirit Society - Cocktail Masterclass Pass
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[10].id, // Spirit Society
        name: "Cocktail Masterclass VIP",
        description:
          "Includes cocktail masterclass session with professional mixologists",
        type: VIPPassType.PREMIUM_ENTRY,
        priceCents: 4500, // €45.00
        benefits: [
          "Private cocktail masterclass",
          "Tasting of 5 premium spirits",
          "Take-home recipe book",
          "VIP seating for the evening",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 1500, // €15 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["tuesday", "wednesday"],
        validHours: { start: "18:00", end: "21:00" },
        totalQuantity: 8,
        soldCount: 3,
        maxPerUser: 2,
        isActive: true,
      },
    }),
    // Tampere Sports Arena Bar - Match Day VIP
    prisma.vIPPassEnhanced.create({
      data: {
        barId: tampereBars[2].id, // Tampere Sports Arena Bar
        name: "Match Day VIP Experience",
        description:
          "Premium viewing experience for local sports matches with all-inclusive package",
        type: VIPPassType.COVER_INCLUDED,
        priceCents: 2200, // €22.00
        benefits: [
          "Best screen views",
          "Cover fee included",
          "2 drink tokens",
          "Match day food special",
          "Reserved seating",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 800, // €8 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["saturday", "sunday"],
        validHours: { start: "14:00", end: "22:00" },
        totalQuantity: 30,
        soldCount: 18,
        maxPerUser: 6,
        isActive: true,
      },
    }),
    // Turku Harbor Lounge - Weekend Brunch Pass
    prisma.vIPPassEnhanced.create({
      data: {
        barId: turkuBars[2].id, // Turku Harbor Lounge
        name: "Weekend Brunch VIP",
        description:
          "Exclusive brunch experience with harbor views and bottomless mimosas",
        type: VIPPassType.COVER_INCLUDED,
        priceCents: 2800, // €28.00
        originalPriceCents: 3500, // Original €35.00
        benefits: [
          "Priority brunch reservation",
          "Bottomless mimosas (2 hours)",
          "Cover fee included",
          "Best harbor view table",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 1200, // €12 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["saturday", "sunday"],
        validHours: { start: "11:00", end: "15:00" },
        totalQuantity: 25,
        soldCount: 12,
        maxPerUser: 4,
        isActive: true,
      },
    }),
    // Sing Along Bar - Karaoke Party Pass
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[17].id, // Sing Along Bar
        name: "Karaoke Party VIP",
        description:
          "Private karaoke room reservation with drink package for groups",
        type: VIPPassType.PREMIUM_ENTRY,
        priceCents: 4000, // €40.00
        benefits: [
          "2-hour private room rental",
          "4 drink tokens",
          "Priority song selection",
          "Dedicated server",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 1500, // €15 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["friday", "saturday"],
        validHours: { start: "19:00", end: "01:00" },
        totalQuantity: 10,
        soldCount: 4,
        maxPerUser: 1,
        isActive: true,
      },
    }),
    // Dance Factory - Saturday Night VIP
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[5].id, // Dance Factory
        name: "Saturday Night VIP",
        description:
          "Ultimate Saturday night experience at Helsinki's top electronic music venue",
        type: VIPPassType.PREMIUM_ENTRY,
        priceCents: 3200, // €32.00
        benefits: [
          "Skip 60min line",
          "VIP balcony access",
          "Complimentary bottle service",
          "Meet & greet with DJs",
          "Express coat check",
        ],
        skipLinePriority: true,
        coverFeeIncluded: true,
        coverFeeAmount: 1800, // €18 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: ["saturday"],
        validHours: { start: "22:00", end: "04:00" },
        totalQuantity: 15,
        soldCount: 9,
        maxPerUser: 2,
        isActive: true,
      },
    }),
    // The English Pub - Traditional Experience
    prisma.vIPPassEnhanced.create({
      data: {
        barId: helsinkiBars[2].id, // The English Pub
        name: "Traditional Pub Experience",
        description:
          "Authentic British pub experience with traditional food and drink pairing",
        type: VIPPassType.COVER_INCLUDED,
        priceCents: 1800, // €18.00
        benefits: [
          "Traditional pub platter",
          "2 pint tokens",
          "Cover fee included",
          "Reserved booth seating",
        ],
        skipLinePriority: false,
        coverFeeIncluded: true,
        coverFeeAmount: 800, // €8 cover included
        validityStart: new Date("2025-10-01"),
        validityEnd: new Date("2025-12-31"),
        validDays: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ],
        validHours: { start: "17:00", end: "23:00" },
        totalQuantity: 20,
        soldCount: 11,
        maxPerUser: 4,
        isActive: true,
      },
    }),
  ]);

  // Create some purchased User VIP passes for testing
  console.log("🎟️ Creating user VIP pass purchases...");

  await prisma.userVIPPass.createMany({
    data: [
      {
        userId: user1.id,
        vipPassId: enhancedVIPPasses[0].id,
        barId: helsinkiBars[4].id,
        qrCode: "HOPPR-VIP-ALEX-001",
        purchasePriceCents: 1500,
        status: VIPPassStatus.ACTIVE,
        expiresAt: new Date("2025-12-31T23:59:59Z"),
      },
      {
        userId: user2.id,
        vipPassId: enhancedVIPPasses[1].id,
        barId: helsinkiBars[3].id,
        qrCode: "HOPPR-VIP-SARAH-001",
        purchasePriceCents: 2500,
        status: VIPPassStatus.ACTIVE,
        expiresAt: new Date("2025-12-31T23:59:59Z"),
      },
      {
        userId: user6.id,
        vipPassId: enhancedVIPPasses[3].id,
        barId: helsinkiBars[11].id,
        qrCode: "HOPPR-VIP-LISA-001",
        purchasePriceCents: 3000,
        status: VIPPassStatus.ACTIVE,
        expiresAt: new Date("2025-12-31T23:59:59Z"),
      },
      {
        userId: user3.id,
        vipPassId: enhancedVIPPasses[4].id,
        barId: helsinkiBars[15].id,
        qrCode: "HOPPR-VIP-MIKKO-001",
        purchasePriceCents: 1200,
        status: VIPPassStatus.ACTIVE,
        expiresAt: new Date("2025-12-31T23:59:59Z"),
      },
      {
        userId: user4.id,
        vipPassId: enhancedVIPPasses[11].id,
        barId: turkuBars[2].id,
        qrCode: "HOPPR-VIP-EMMA-001",
        purchasePriceCents: 2800,
        status: VIPPassStatus.ACTIVE,
        expiresAt: new Date("2025-12-31T23:59:59Z"),
      },
      {
        userId: user5.id,
        vipPassId: enhancedVIPPasses[10].id,
        barId: tampereBars[2].id,
        qrCode: "HOPPR-VIP-DAVID-001",
        purchasePriceCents: 2200,
        status: VIPPassStatus.ACTIVE,
        expiresAt: new Date("2025-12-31T23:59:59Z"),
      },
      {
        userId: user7.id,
        vipPassId: enhancedVIPPasses[6].id,
        barId: helsinkiBars[21].id,
        qrCode: "HOPPR-VIP-JARI-001",
        purchasePriceCents: 3500,
        status: VIPPassStatus.ACTIVE,
        expiresAt: new Date("2025-12-31T23:59:59Z"),
      },
      {
        userId: user8.id,
        vipPassId: enhancedVIPPasses[12].id,
        barId: helsinkiBars[17].id,
        qrCode: "HOPPR-VIP-SOFIA-001",
        purchasePriceCents: 4000,
        status: VIPPassStatus.ACTIVE,
        expiresAt: new Date("2025-12-31T23:59:59Z"),
      },
      {
        userId: user1.id,
        vipPassId: enhancedVIPPasses[8].id,
        barId: helsinkiBars[7].id,
        qrCode: "HOPPR-VIP-ALEX-002",
        purchasePriceCents: 1500,
        status: VIPPassStatus.USED,
        expiresAt: new Date("2025-12-31T23:59:59Z"),
      },
      {
        userId: user2.id,
        vipPassId: enhancedVIPPasses[13].id,
        barId: helsinkiBars[5].id,
        qrCode: "HOPPR-VIP-SARAH-002",
        purchasePriceCents: 3200,
        status: VIPPassStatus.EXPIRED,
        expiresAt: new Date("2024-12-31T23:59:59Z"), // Past date for expired
      },
    ],
  });

  // Create Social Profiles for Users
  console.log("🎭 Creating social profiles...");

  const socialProfiles = await Promise.all([
    // User 1: Alex - Active in social mode (Helsinki)
    prisma.userSocialProfile.create({
      data: {
        userId: user1.id,
        bio: "Digital nomad and nightlife enthusiast. Always up for meeting new people and exploring hidden bars!",
        vibe: SocialVibe.ADVENTUROUS,
        interests: ["Craft Beer", "Live Music", "Cocktails", "Networking"],
        isSocialMode: true,
        socialStatus: SocialStatus.SOCIAL_MODE,
        lastActive: new Date(),
        locationLat: 60.1699,
        locationLng: 24.9384,
        currentBarId: helsinkiBars[0].id,
        isVisibleOnMap: true,
        maxDistance: 1000,
      },
    }),
    // User 2: Sarah - Active in social mode at a bar (Helsinki)
    prisma.userSocialProfile.create({
      data: {
        userId: user2.id,
        bio: "Cocktail connoisseur and jazz lover. Looking for sophisticated company for evening drinks.",
        vibe: SocialVibe.NETWORKING,
        interests: ["Cocktails", "Jazz Music", "Wine Tasting", "Fine Dining"],
        isSocialMode: true,
        socialStatus: SocialStatus.SOCIAL_MODE,
        lastActive: new Date(),
        locationLat: 60.1685,
        locationLng: 24.9328,
        currentBarId: helsinkiBars[1].id,
        isVisibleOnMap: true,
        maxDistance: 800,
      },
    }),
    // User 3: Mikko - Not in social mode (inactive)
    prisma.userSocialProfile.create({
      data: {
        userId: user3.id,
        bio: "Sports fan and pub regular. Love watching games with good company and cold beer.",
        vibe: SocialVibe.CASUAL,
        interests: ["Sports", "Craft Beer", "Pub Food", "Watching Games"],
        isSocialMode: false,
        socialStatus: SocialStatus.OFFLINE,
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
        locationLat: 61.4978,
        locationLng: 23.761,
        currentBarId: null,
        isVisibleOnMap: false,
        maxDistance: 500,
      },
    }),
    // User 4: Emma - Active in social mode (Turku)
    prisma.userSocialProfile.create({
      data: {
        userId: user4.id,
        bio: "History student who loves exploring historic pubs and hearing local stories. Always curious!",
        vibe: SocialVibe.CHILL,
        interests: [
          "History",
          "Local Culture",
          "Traditional Pubs",
          "Storytelling",
        ],
        isSocialMode: true,
        socialStatus: SocialStatus.SOCIAL_MODE,
        lastActive: new Date(),
        locationLat: 60.4518,
        locationLng: 22.2666,
        currentBarId: turkuBars[0].id,
        isVisibleOnMap: true,
        maxDistance: 1500,
      },
    }),
    // User 5: David - Active in social mode (Tampere)
    prisma.userSocialProfile.create({
      data: {
        userId: user5.id,
        bio: "Tech professional who enjoys craft beers and intellectual conversations.",
        vibe: SocialVibe.CASUAL,
        interests: ["Technology", "Craft Beer", "Board Games", "Philosophy"],
        isSocialMode: true,
        socialStatus: SocialStatus.SOCIAL_MODE,
        lastActive: new Date(),
        locationLat: 61.4978,
        locationLng: 23.761,
        currentBarId: tampereBars[0].id,
        isVisibleOnMap: true,
        maxDistance: 1200,
      },
    }),
    // User 6: Lisa - Active in social mode (Helsinki) - PARTY vibe
    prisma.userSocialProfile.create({
      data: {
        userId: user6.id,
        bio: "Always ready to dance! Love meeting new people and having fun nights out.",
        vibe: SocialVibe.PARTY,
        interests: [
          "Dancing",
          "Electronic Music",
          "Cocktails",
          "Meeting People",
        ],
        isSocialMode: true,
        socialStatus: SocialStatus.SOCIAL_MODE,
        lastActive: new Date(),
        locationLat: 60.1678,
        locationLng: 24.9456,
        currentBarId: helsinkiBars[2].id,
        isVisibleOnMap: true,
        maxDistance: 2000,
      },
    }),
    // User 7: Jari - Active in social mode (Helsinki)
    prisma.userSocialProfile.create({
      data: {
        userId: user7.id,
        bio: "Jazz musician and cocktail enthusiast. Enjoy good conversations and live music.",
        vibe: SocialVibe.CHILL,
        interests: ["Jazz", "Classic Cocktails", "Live Music", "Art"],
        isSocialMode: true,
        socialStatus: SocialStatus.SOCIAL_MODE,
        lastActive: new Date(),
        locationLat: 60.1685,
        locationLng: 24.9442,
        currentBarId: helsinkiBars[21].id,
        isVisibleOnMap: true,
        maxDistance: 800,
      },
    }),
    // User 8: Sofia - Active in social mode (Helsinki)
    prisma.userSocialProfile.create({
      data: {
        userId: user8.id,
        bio: "Marketing professional who loves karaoke nights and meeting new friends.",
        vibe: SocialVibe.PARTY,
        interests: ["Karaoke", "Pop Music", "Cocktails", "Social Events"],
        isSocialMode: true,
        socialStatus: SocialStatus.SOCIAL_MODE,
        lastActive: new Date(),
        locationLat: 60.1618,
        locationLng: 24.9412,
        currentBarId: helsinkiBars[17].id,
        isVisibleOnMap: true,
        maxDistance: 1000,
      },
    }),
  ]);

  // Create Social Interactions
  console.log("🤝 Creating social interactions...");

  await prisma.socialInteraction.createMany({
    data: [
      {
        initiatorId: user1.id,
        targetUserId: user2.id,
        interactionType: InteractionType.HOP_IN,
        status: InteractionStatus.PENDING,
        message:
          "Hey Sarah! I see you're at Aurora too. Mind if I join you for a drink?",
        createdAt: new Date(),
      },
      {
        initiatorId: user3.id,
        targetUserId: user4.id,
        interactionType: InteractionType.HOP_IN,
        status: InteractionStatus.PENDING,
        message:
          "Emma, your profile looks interesting! I'd love to hear more about historic pubs sometime.",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        initiatorId: user2.id,
        targetUserId: user1.id,
        interactionType: InteractionType.HOP_IN,
        status: InteractionStatus.ACCEPTED,
        message: "Alex, let's meet up at the cocktail lounge next weekend!",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        initiatorId: user5.id,
        targetUserId: user6.id,
        interactionType: InteractionType.HOP_IN,
        status: InteractionStatus.PENDING,
        message:
          "Lisa, I see we both enjoy cocktails! Would love to chat about your favorite spots.",
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        initiatorId: user7.id,
        targetUserId: user2.id,
        interactionType: InteractionType.HOP_IN,
        status: InteractionStatus.ACCEPTED,
        message:
          "Sarah, I noticed you love jazz too! Would you like to join me for the live performance tonight?",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        initiatorId: user8.id,
        targetUserId: user6.id,
        interactionType: InteractionType.HOP_IN,
        status: InteractionStatus.PENDING,
        message:
          "Lisa, you seem like so much fun! Want to join our karaoke session this Friday?",
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
      },
    ],
  });

  // Create Social Meetups
  console.log("👥 Creating social meetups...");

  const meetups = await Promise.all([
    prisma.socialMeetup.create({
      data: {
        name: "Friday Night Cocktails",
        description: "Casual meetup for cocktail enthusiasts",
        barId: helsinkiBars[2].id,
        creatorId: user1.id,
        status: MeetupStatus.ACTIVE,
        maxParticipants: 6,
        startTime: new Date(),
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        isPublic: true,
        participants: {
          create: [
            {
              userId: user1.id,
              status: ParticipantStatus.JOINED,
            },
            {
              userId: user2.id,
              status: ParticipantStatus.JOINED,
            },
          ],
        },
      },
    }),
    prisma.socialMeetup.create({
      data: {
        name: "Jazz Night Gathering",
        description: "Enjoy live jazz music with fellow enthusiasts",
        barId: helsinkiBars[21].id,
        creatorId: user7.id,
        status: MeetupStatus.ACTIVE,
        maxParticipants: 8,
        startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        isPublic: true,
        participants: {
          create: [
            {
              userId: user7.id,
              status: ParticipantStatus.JOINED,
            },
            {
              userId: user2.id,
              status: ParticipantStatus.JOINED,
            },
          ],
        },
      },
    }),
    prisma.socialMeetup.create({
      data: {
        name: "Karaoke Fun Night",
        description: "Let's sing our hearts out! All skill levels welcome",
        barId: helsinkiBars[17].id,
        creatorId: user8.id,
        status: MeetupStatus.ACTIVE,
        maxParticipants: 10,
        startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        isPublic: true,
        participants: {
          create: [
            {
              userId: user8.id,
              status: ParticipantStatus.JOINED,
            },
            {
              userId: user6.id,
              status: ParticipantStatus.INVITED,
            },
          ],
        },
      },
    }),
  ]);

  // Create Social Chat Messages
  console.log("💬 Creating social chat messages...");

  await prisma.socialChatMessage.createMany({
    data: [
      {
        meetupId: meetups[0].id,
        userId: user1.id,
        content: "Hey everyone! Thanks for joining the meetup!",
        messageType: MessageType.TEXT,
        createdAt: new Date(),
      },
      {
        meetupId: meetups[0].id,
        userId: user2.id,
        content: "Glad to be here! The cocktails look amazing 🍸",
        messageType: MessageType.TEXT,
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        meetupId: meetups[1].id,
        userId: user7.id,
        content: "Welcome to jazz night! The band starts in 15 minutes 🎷",
        messageType: MessageType.TEXT,
        createdAt: new Date(),
      },
      {
        meetupId: meetups[1].id,
        userId: user2.id,
        content: "Excited for the performance! Got a great seat near the stage",
        messageType: MessageType.TEXT,
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ],
  });

  // Create User Social Stats
  console.log("📊 Creating user social stats...");

  await prisma.userSocialStats.createMany({
    data: [
      {
        userId: user1.id,
        totalMeetups: 5,
        successfulMeetups: 4,
        hopInCount: 12,
        socialScore: 95,
        badges: ["Social Butterfly", "Crawl Master"],
      },
      {
        userId: user2.id,
        totalMeetups: 3,
        successfulMeetups: 3,
        hopInCount: 8,
        socialScore: 88,
        badges: ["Cocktail Expert"],
      },
      {
        userId: user3.id,
        totalMeetups: 2,
        successfulMeetups: 1,
        hopInCount: 5,
        socialScore: 72,
        badges: ["Sports Fan"],
      },
      {
        userId: user4.id,
        totalMeetups: 4,
        successfulMeetups: 3,
        hopInCount: 7,
        socialScore: 81,
        badges: ["History Buff"],
      },
      {
        userId: user5.id,
        totalMeetups: 3,
        successfulMeetups: 2,
        hopInCount: 6,
        socialScore: 76,
        badges: ["Tech Guru"],
      },
      {
        userId: user6.id,
        totalMeetups: 6,
        successfulMeetups: 5,
        hopInCount: 15,
        socialScore: 92,
        badges: ["Party Starter", "Social Butterfly"],
      },
      {
        userId: user7.id,
        totalMeetups: 4,
        successfulMeetups: 4,
        hopInCount: 9,
        socialScore: 89,
        badges: ["Jazz Lover"],
      },
      {
        userId: user8.id,
        totalMeetups: 5,
        successfulMeetups: 4,
        hopInCount: 11,
        socialScore: 87,
        badges: ["Karaoke Star"],
      },
    ],
  });

  // Create Bar Social Activities
  console.log("🏢 Creating bar social activities...");

  await prisma.barSocialActivity.createMany({
    data: [
      {
        barId: helsinkiBars[1].id,
        activeUsersCount: 3,
        socialMeetupsCount: 2,
        isHotspot: true,
        heatLevel: 8,
      },
      {
        barId: helsinkiBars[2].id,
        activeUsersCount: 2,
        socialMeetupsCount: 1,
        isHotspot: true,
        heatLevel: 6,
      },
      {
        barId: helsinkiBars[21].id,
        activeUsersCount: 2,
        socialMeetupsCount: 1,
        isHotspot: true,
        heatLevel: 7,
      },
      {
        barId: helsinkiBars[17].id,
        activeUsersCount: 2,
        socialMeetupsCount: 1,
        isHotspot: true,
        heatLevel: 5,
      },
      {
        barId: tampereBars[0].id,
        activeUsersCount: 1,
        socialMeetupsCount: 0,
        isHotspot: false,
        heatLevel: 2,
      },
      {
        barId: turkuBars[0].id,
        activeUsersCount: 1,
        socialMeetupsCount: 0,
        isHotspot: false,
        heatLevel: 2,
      },
    ],
  });

  // Create Crawls
  console.log("🗺️ Creating crawls...");

  const crawls = await Promise.all([
    // Helsinki Weekend Adventure - UPCOMING
    prisma.crawl.create({
      data: {
        name: "Helsinki Weekend Adventure",
        description:
          "Explore the best bars in Helsinki city center. Perfect for groups and solo travelers looking to meet new people!",
        creatorId: user1.id,
        cityId: helsinki.id,
        date: new Date("2025-10-25T19:00:00Z"),
        startTime: new Date("2025-10-25T19:00:00Z"),
        endTime: new Date("2025-10-26T01:00:00Z"),
        maxParticipants: 15,
        isPublic: true,
        status: CrawlStatus.UPCOMING,
        crawlBars: {
          create: [
            {
              barId: helsinkiBars[0].id,
              orderIndex: 1,
              duration: 90,
              startTime: new Date("2025-10-25T19:00:00Z"),
            },
            {
              barId: helsinkiBars[1].id,
              orderIndex: 2,
              duration: 60,
              startTime: new Date("2025-10-25T20:30:00Z"),
            },
            {
              barId: helsinkiBars[2].id,
              orderIndex: 3,
              duration: 75,
              startTime: new Date("2025-10-25T21:30:00Z"),
            },
          ],
        },
        participants: {
          create: [
            { userId: user1.id },
            { userId: user2.id },
            { userId: user3.id },
          ],
        },
      },
    }),
    // Tampere Student Night - ACTIVE
    prisma.crawl.create({
      data: {
        name: "Tampere Student Night",
        description: "Student-friendly bar crawl through Tampere's best spots",
        creatorId: user5.id,
        cityId: tampere.id,
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        maxParticipants: 12,
        isPublic: true,
        status: CrawlStatus.ACTIVE,
        crawlBars: {
          create: [
            {
              barId: tampereBars[0].id,
              orderIndex: 1,
              duration: 60,
              startTime: new Date(),
            },
            {
              barId: tampereBars[1].id,
              orderIndex: 2,
              duration: 90,
              startTime: new Date(Date.now() + 60 * 60 * 1000),
            },
          ],
        },
        participants: {
          create: [{ userId: user5.id }, { userId: user3.id }],
        },
      },
    }),
    // Turku Historic Pubs - COMPLETED
    prisma.crawl.create({
      data: {
        name: "Turku Historic Pubs Tour",
        description: "Explore Turku's most historic and charming pubs",
        creatorId: user4.id,
        cityId: turku.id,
        date: new Date("2025-10-18T18:00:00Z"),
        startTime: new Date("2025-10-18T18:00:00Z"),
        endTime: new Date("2025-10-18T23:00:00Z"),
        maxParticipants: 8,
        isPublic: true,
        status: CrawlStatus.COMPLETED,
        crawlBars: {
          create: [
            {
              barId: turkuBars[1].id,
              orderIndex: 1,
              duration: 90,
              startTime: new Date("2025-10-18T18:00:00Z"),
            },
            {
              barId: turkuBars[0].id,
              orderIndex: 2,
              duration: 120,
              startTime: new Date("2025-10-18T19:30:00Z"),
            },
          ],
        },
        participants: {
          create: [{ userId: user4.id }, { userId: user6.id }],
        },
      },
    }),
  ]);

  // Create Groups
  console.log("👥 Creating groups...");

  await prisma.group.create({
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
          { userId: user6.id },
          { userId: user7.id },
          { userId: user8.id },
        ],
      },
    },
  });

  await prisma.group.create({
    data: {
      name: "Tampere Social Club",
      description: "Social events and meetups in Tampere area",
      creatorId: user5.id,
      cityId: tampere.id,
      isPublic: true,
      maxMembers: 15,
      members: {
        create: [{ userId: user5.id }, { userId: user3.id }],
      },
    },
  });

  // Create VIP passes (old system)
  console.log("🎫 Creating VIP passes...");

  await prisma.vIPPass.createMany({
    data: [
      {
        userId: user1.id,
        barId: helsinkiBars[0].id,
        qrCode: "VIP-HELS-001",
        startTime: new Date("2025-10-25T19:00:00Z"),
        endTime: new Date("2025-10-26T01:00:00Z"),
      },
      {
        userId: user2.id,
        barId: helsinkiBars[1].id,
        qrCode: "VIP-HELS-002",
        startTime: new Date("2025-11-05T18:30:00Z"),
        endTime: new Date("2025-11-06T00:00:00Z"),
      },
    ],
  });

  // Create Featured Bars
  console.log("🌟 Creating featured bars...");

  await prisma.featuredBar.createMany({
    data: [
      {
        barId: helsinkiBars[3].id, // Nightclub Aurora
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-31"),
        priority: 1,
      },
      {
        barId: helsinkiBars[4].id, // Club Helsinki
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-31"),
        priority: 2,
      },
      {
        barId: helsinkiBars[11].id, // The Alchemist
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-31"),
        priority: 3,
      },
      {
        barId: tampereBars[1].id, // Klubi Tampere
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-31"),
        priority: 4,
      },
      {
        barId: turkuBars[0].id, // Uusi Apteekki
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-31"),
        priority: 5,
      },
    ],
  });

  console.log("✅ Seed completed!");
  console.log(`📊 Created:`);
  console.log(`   - ${await prisma.user.count()} users`);
  console.log(`   - ${await prisma.userSocialProfile.count()} social profiles`);
  console.log(
    `   - ${await prisma.socialInteraction.count()} social interactions`
  );
  console.log(`   - ${await prisma.socialMeetup.count()} social meetups`);
  console.log(
    `   - ${await prisma.meetupParticipant.count()} meetup participants`
  );
  console.log(
    `   - ${await prisma.socialChatMessage.count()} social chat messages`
  );
  console.log(`   - ${await prisma.userSocialStats.count()} user social stats`);
  console.log(
    `   - ${await prisma.barSocialActivity.count()} bar social activities`
  );
  console.log(`   - ${await prisma.city.count()} cities`);
  console.log(`   - ${await prisma.bar.count()} bars`);
  console.log(`   - ${await prisma.crawl.count()} crawls`);
  console.log(`   - ${await prisma.group.count()} groups`);
  console.log(`   - ${await prisma.vIPPass.count()} VIP passes (old)`);
  console.log(
    `   - ${await prisma.vIPPassEnhanced.count()} enhanced VIP passes`
  );
  console.log(
    `   - ${await prisma.userVIPPass.count()} user VIP pass purchases`
  );
  console.log(`   - ${await prisma.featuredBar.count()} featured bars`);

  console.log("\n🔑 Test User Logins:");
  console.log("   Email: alex.johnson@example.com");
  console.log("   Email: sarah.miller@example.com");
  console.log("   Email: mikko.korhonen@example.com");
  console.log("   Password for all: password123");

  console.log("\n⭐ VIP Pass Highlights:");
  console.log(`   - Created ${enhancedVIPPasses.length} enhanced VIP passes`);
  console.log("   - Various types: Skip Line, Premium Entry, Cover Included");
  console.log("   - Different price points from €12 to €45");
  console.log("   - Multiple validity patterns (weekdays, weekends, seasonal)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
