// import {
//   PrismaClient,
//   BarType,
//   PriceRange,
//   BarStatus,
//   SocialVibe,
//   SocialStatus,
//   InteractionType,
//   InteractionStatus,
//   CrawlStatus,
//   MeetupStatus,
//   ParticipantStatus,
//   MessageType,
//   VIPPassType,
//   VIPPassStatus,
//   AdminRole,
//   BarStaffRole,
//   PromotionType,
// } from "@prisma/client";
// import { hash } from "bcryptjs";

// const prisma = new PrismaClient();

// async function hashPassword(password: string): Promise<string> {
//   return await hash(password, 12);
// }

// async function main() {
//   console.log("🌱 Starting unified database seed...");

//   // Clear existing data in correct order (child tables first)
//   console.log("🧹 Clearing existing data...");

//   // Social & Chat
//   await prisma.socialChatMessage.deleteMany().catch(() => {});
//   await prisma.meetupParticipant.deleteMany().catch(() => {});
//   await prisma.socialInteraction.deleteMany().catch(() => {});
//   await prisma.socialMeetup.deleteMany().catch(() => {});
//   await prisma.userSocialStats.deleteMany().catch(() => {});
//   await prisma.userSocialProfile.deleteMany().catch(() => {});
//   await prisma.crawlChatMessage.deleteMany().catch(() => {});
//   await prisma.chatMessage.deleteMany().catch(() => {});
//   await prisma.userGroup.deleteMany().catch(() => {});
//   await prisma.group.deleteMany().catch(() => {});

//   // Crawls
//   await prisma.crawlJoinRequest.deleteMany().catch(() => {});
//   await prisma.crawlParticipant.deleteMany().catch(() => {});
//   await prisma.crawlBar.deleteMany().catch(() => {});
//   await prisma.crawl.deleteMany().catch(() => {});

//   // VIP & Promotions
//   await prisma.promotionUsage.deleteMany().catch(() => {});
//   await prisma.userVIPPass.deleteMany().catch(() => {});
//   await prisma.vIPPassEnhanced.deleteMany().catch(() => {});
//   await prisma.vIPPassScan.deleteMany().catch(() => {});
//   await prisma.vIPPass.deleteMany().catch(() => {});
//   await prisma.barPromotion.deleteMany().catch(() => {});

//   // Staff & Bar
//   await prisma.barStaff.deleteMany().catch(() => {});
//   await prisma.barSocialActivity.deleteMany().catch(() => {});
//   await prisma.bar.deleteMany().catch(() => {});

//   // Cities
//   await prisma.city.deleteMany().catch(() => {});

//   // Users & Auth
//   await prisma.phoneVerification.deleteMany().catch(() => {});
//   await prisma.notification.deleteMany().catch(() => {});
//   await prisma.hopIn.deleteMany().catch(() => {});
//   await prisma.chatroomMessage.deleteMany().catch(() => {});
//   await prisma.chatroomParticipant.deleteMany().catch(() => {});
//   await prisma.chatroom.deleteMany().catch(() => {});
//   await prisma.account.deleteMany().catch(() => {});
//   await prisma.session.deleteMany().catch(() => {});
//   await prisma.user.deleteMany().catch(() => {});

//   // Admin
//   await prisma.auditLog.deleteMany().catch(() => {});
//   await prisma.barImport.deleteMany().catch(() => {});
//   await prisma.barInvitation.deleteMany().catch(() => {});
//   await prisma.adminUser.deleteMany().catch(() => {});

//   // ============================================
//   // CREATE CITIES
//   // ============================================
//   console.log("🏙️ Creating cities...");

//   const helsinki = await prisma.city.create({
//     data: { name: "Helsinki", country: "Finland", isActive: true },
//   });

//   const tampere = await prisma.city.create({
//     data: { name: "Tampere", country: "Finland", isActive: true },
//   });

//   const turku = await prisma.city.create({
//     data: { name: "Turku", country: "Finland", isActive: true },
//   });

//   // ============================================
//   // CREATE ADMIN USERS (Business App)
//   // ============================================
//   console.log("👤 Creating admin users...");

//   const admin1 = await prisma.adminUser.create({
//     data: {
//       email: "siegy@hoppr.com",
//       name: "Siegfred Gamboa",
//       role: AdminRole.SUPER_ADMIN,
//       hashedPassword: await hashPassword("superadmin123"),
//       isActive: true,
//     },
//   });

//   const admin2 = await prisma.adminUser.create({
//     data: {
//       email: "pierce@hoppr.com",
//       name: "Pierce Cosgrove",
//       role: AdminRole.SUPER_ADMIN,
//       hashedPassword: await hashPassword("admin123"),
//       isActive: true,
//     },
//   });

//   // ============================================
//   // CREATE REGULAR USERS (User App)
//   // ============================================
//   console.log("👥 Creating regular users...");
//   const userPassword = await hash("password123", 12);

//   const users = await Promise.all([
//     prisma.user.create({
//       data: {
//         name: "Alex Johnson",
//         email: "alex.johnson@example.com",
//         hashedPassword: userPassword,
//         emailVerified: new Date(),
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Sarah Miller",
//         email: "sarah.miller@example.com",
//         hashedPassword: userPassword,
//         emailVerified: new Date(),
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Mikko Korhonen",
//         email: "mikko.korhonen@example.com",
//         hashedPassword: userPassword,
//         emailVerified: new Date(),
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Emma Virtanen",
//         email: "emma.virtanen@example.com",
//         hashedPassword: userPassword,
//         emailVerified: new Date(),
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "David Chen",
//         email: "david.chen@example.com",
//         hashedPassword: userPassword,
//         emailVerified: new Date(),
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Lisa Park",
//         email: "lisa.park@example.com",
//         hashedPassword: userPassword,
//         emailVerified: new Date(),
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Jari Nieminen",
//         email: "jari.nieminen@example.com",
//         hashedPassword: userPassword,
//         emailVerified: new Date(),
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Sofia Karlsson",
//         email: "sofia.karlsson@example.com",
//         hashedPassword: userPassword,
//         emailVerified: new Date(),
//       },
//     }),
//   ]);

//   const [user1, user2, user3, user4, user5, user6, user7, user8] = users;

//   // ============================================
//   // CREATE BARS (Merged from both seeds)
//   // ============================================
//   console.log("🍻 Creating sample bars...");

//   const operatingHours = {
//     Monday: { open: "16:00", close: "02:00" },
//     Tuesday: { open: "16:00", close: "02:00" },
//     Wednesday: { open: "16:00", close: "02:00" },
//     Thursday: { open: "16:00", close: "02:00" },
//     Friday: { open: "16:00", close: "04:00" },
//     Saturday: { open: "14:00", close: "04:00" },
//     Sunday: { open: "14:00", close: "02:00" },
//   };

//   const bar1 = await prisma.bar.create({
//     data: {
//       name: "The Golden Pint",
//       description: "Cozy pub with craft beers and live sports",
//       address: "Main Street 123",
//       cityName: "Helsinki",
//       district: "Kallio",
//       type: BarType.PUB,
//       latitude: 60.1699,
//       longitude: 24.9384,
//       phone: "+358401234567",
//       email: "info@goldenpint.fi",
//       website: "https://goldenpint.fi",
//       instagram: "@goldenpint",
//       priceRange: PriceRange.MODERATE,
//       capacity: 120,
//       amenities: ["Terrace", "Sports TV", "Craft Beer"],
//       operatingHours: operatingHours,
//       vipEnabled: true,
//       coverImage:
//         "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
//       imageUrls: [
//         "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
//       ],
//       status: BarStatus.UNCLAIMED,
//       isVerified: false,
//       isActive: true,
//       createdById: admin1.id,
//     },
//   });

//   const bar2 = await prisma.bar.create({
//     data: {
//       name: "Midnight Club",
//       description: "Premium nightclub with VIP experience",
//       address: "Night Avenue 45",
//       cityName: "Helsinki",
//       district: "Kamppi",
//       type: BarType.CLUB,
//       latitude: 60.1685,
//       longitude: 24.9328,
//       phone: "+358409876543",
//       email: "events@midnightclub.fi",
//       website: "https://midnightclub.fi",
//       instagram: "@midnightclub",
//       priceRange: PriceRange.PREMIUM,
//       capacity: 300,
//       amenities: ["VIP Area", "DJ", "Cocktails"],
//       operatingHours: {
//         Thursday: { open: "22:00", close: "04:00" },
//         Friday: { open: "22:00", close: "04:00" },
//         Saturday: { open: "22:00", close: "04:00" },
//       },
//       vipEnabled: true,
//       vipPrice: 25,
//       coverImage:
//         "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
//       imageUrls: [
//         "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
//       ],
//       status: BarStatus.VERIFIED,
//       isVerified: true,
//       isActive: true,
//       createdById: admin1.id,
//     },
//   });

//   // Create more bars (simplified for brevity - add all 24+ bars here)
//   // ... (you can add all bars from your original seed)

//   // ============================================
//   // CREATE BAR STAFF
//   // ============================================
//   console.log("👥 Creating bar staff...");

//   const staffPassword = await hashPassword("staff123");

//   await prisma.barStaff.create({
//     data: {
//       barId: bar2.id,
//       email: "pierce@midnightclub.com",
//       name: "Pierce Cosgrove",
//       role: BarStaffRole.OWNER,
//       permissions: ["*"],
//       hashedPassword: await hashPassword("owner123"),
//       isActive: true,
//     },
//   });

//   await prisma.barStaff.create({
//     data: {
//       barId: bar2.id,
//       email: "manager@midnightclub.com",
//       name: "Sarah Johnson",
//       role: BarStaffRole.MANAGER,
//       permissions: [
//         "manage_staff",
//         "manage_promotions",
//         "view_analytics",
//         "scan_passes",
//       ],
//       hashedPassword: staffPassword,
//       isActive: true,
//     },
//   });

//   await prisma.barStaff.create({
//     data: {
//       barId: bar2.id,
//       email: "tom@midnightclub.com",
//       name: "Tom Wilson",
//       role: BarStaffRole.STAFF,
//       permissions: ["scan_passes"],
//       hashedPassword: staffPassword,
//       isActive: true,
//     },
//   });

//   // ============================================
//   // CREATE PROMOTIONS
//   // ============================================
//   console.log("🎉 Creating promotions...");

//   const now = new Date();
//   const nextYear = new Date();
//   nextYear.setFullYear(nextYear.getFullYear() + 1);

//   await prisma.barPromotion.create({
//     data: {
//       barId: bar2.id,
//       title: "Friday Night VIP Experience",
//       description: "Skip the line and get 2 complimentary drinks",
//       type: PromotionType.VIP_OFFER,
//       discount: 0,
//       conditions: ["18+ only", "Valid ID required", "Dress code enforced"],
//       startDate: now,
//       endDate: nextYear,
//       validDays: ["Friday"],
//       isActive: true,
//       isApproved: true,
//       priority: 1,
//     },
//   });

//   await prisma.barPromotion.create({
//     data: {
//       barId: bar1.id,
//       title: "Happy Hour Special",
//       description: "50% off all craft beers during happy hour",
//       type: PromotionType.DRINK_SPECIAL,
//       discount: 50,
//       conditions: ["Valid 4pm-7pm", "Monday to Friday"],
//       startDate: now,
//       endDate: nextYear,
//       validDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
//       isActive: true,
//       isApproved: true,
//       priority: 1,
//     },
//   });

//   // ============================================
//   // ADD SAMPLE ANALYTICS DATA
//   // ============================================
//   console.log("\n📊 Adding sample analytics data...");

//   const promotions = await prisma.barPromotion.findMany();

//   for (const promo of promotions) {
//     const cardViews = Math.floor(Math.random() * 500) + 50;
//     const redemptions = Math.floor(cardViews * (Math.random() * 0.5 + 0.2));

//     await prisma.barPromotion.update({
//       where: { id: promo.id },
//       data: {
//         cardViews,
//         redemptions,
//         views: Math.floor(Math.random() * 1000) + 100,
//         clicks: Math.floor(Math.random() * 300) + 30,
//       },
//     });

//     console.log(
//       `   📊 ${promo.title}: ${cardViews} views → ${redemptions} redemptions`,
//     );
//   }

//   // ============================================
//   // CREATE VIP PASSES
//   // ============================================
//   console.log("\n🎫 Creating VIP passes...");

//   await prisma.vIPPassEnhanced.create({
//     data: {
//       barId: bar2.id,
//       name: "Weekend Skip-the-Line Pass",
//       description: "Fast entry for you and 3 friends",
//       type: VIPPassType.SKIP_LINE,
//       priceCents: 4999,
//       originalPriceCents: 7999,
//       benefits: ["Skip the line", "Priority entry", "Complimentary coat check"],
//       validityStart: now,
//       validityEnd: nextYear,
//       validDays: ["Friday", "Saturday"],
//       totalQuantity: 100,
//       soldCount: 0,
//       maxPerUser: 2,
//       isActive: true,
//     },
//   });

//   // ============================================
//   // CREATE SOCIAL PROFILES (Optional - from User App)
//   // ============================================
//   console.log("🎭 Creating social profiles...");

//   await prisma.userSocialProfile.create({
//     data: {
//       userId: user1.id,
//       bio: "Digital nomad and nightlife enthusiast!",
//       vibe: SocialVibe.ADVENTUROUS,
//       interests: ["Craft Beer", "Live Music", "Cocktails"],
//       isSocialMode: true,
//       socialStatus: SocialStatus.SOCIAL_MODE,
//       lastActive: new Date(),
//       locationLat: 60.1699,
//       locationLng: 24.9384,
//       currentBarId: bar1.id,
//       isVisibleOnMap: true,
//       maxDistance: 1000,
//     },
//   });

//   // ============================================
//   // SUMMARY
//   // ============================================
//   console.log("\n✅ Unified seed completed successfully!");
//   console.log("\n📋 TEST ACCOUNTS:");
//   console.log("   === BUSINESS APP (Bar Owners) ===");
//   console.log("   Admin 1: siegy@hoppr.com / superadmin123");
//   console.log("   Admin 2: pierce@hoppr.com / admin123");
//   console.log("   Bar Owner: pierce@midnightclub.com / owner123");
//   console.log("   Bar Manager: manager@midnightclub.com / staff123");
//   console.log("   Bar Staff: tom@midnightclub.com / staff123");
//   console.log("\n   === USER APP (Customers) ===");
//   console.log("   Alex Johnson: alex.johnson@example.com / password123");
//   console.log("   Sarah Miller: sarah.miller@example.com / password123");
//   console.log("   (Password for all customer accounts: password123)");
//   console.log("\n🍻 SAMPLE BARS:");
//   console.log("   • The Golden Pint (Pub) - Helsinki");
//   console.log("   • Midnight Club (Club) - Helsinki");
//   console.log("\n📊 ANALYTICS DATA ADDED:");
//   console.log("   • Card views and redemptions for each promotion");
//   console.log("   • Usage history for multiple users");
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seed failed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
import {
  PrismaClient,
  BarType,
  PriceRange,
  BarStatus,
  SocialVibe,
  SocialStatus,
  InteractionType,
  InteractionStatus,
  CrawlStatus,
  MeetupStatus,
  ParticipantStatus,
  MessageType,
  VIPPassType,
  VIPPassStatus,
  AdminRole,
  BarStaffRole,
  PromotionType,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

async function main() {
  console.log("🌱 Starting unified database seed...");

  // Clear existing data in correct order (child tables first)
  console.log("🧹 Clearing existing data...");

  // Social & Chat
  await prisma.socialChatMessage.deleteMany().catch(() => {});
  await prisma.meetupParticipant.deleteMany().catch(() => {});
  await prisma.socialInteraction.deleteMany().catch(() => {});
  await prisma.socialMeetup.deleteMany().catch(() => {});
  await prisma.userSocialStats.deleteMany().catch(() => {});
  await prisma.userSocialProfile.deleteMany().catch(() => {});
  await prisma.crawlChatMessage.deleteMany().catch(() => {});
  await prisma.chatMessage.deleteMany().catch(() => {});
  await prisma.userGroup.deleteMany().catch(() => {});
  await prisma.group.deleteMany().catch(() => {});

  // Crawls
  await prisma.crawlJoinRequest.deleteMany().catch(() => {});
  await prisma.crawlParticipant.deleteMany().catch(() => {});
  await prisma.crawlBar.deleteMany().catch(() => {});
  await prisma.crawl.deleteMany().catch(() => {});

  // VIP & Promotions
  await prisma.promotionUsage.deleteMany().catch(() => {});
  await prisma.userVIPPass.deleteMany().catch(() => {});
  await prisma.vIPPassEnhanced.deleteMany().catch(() => {});
  await prisma.vIPPassScan.deleteMany().catch(() => {});
  await prisma.vIPPass.deleteMany().catch(() => {});
  await prisma.barPromotion.deleteMany().catch(() => {});

  // Staff & Bar
  await prisma.barStaff.deleteMany().catch(() => {});
  await prisma.barSocialActivity.deleteMany().catch(() => {});
  await prisma.bar.deleteMany().catch(() => {});

  // Chatrooms
  await prisma.chatroomMessage.deleteMany().catch(() => {});
  await prisma.chatroomParticipant.deleteMany().catch(() => {});
  await prisma.chatroom.deleteMany().catch(() => {});

  // Cities
  await prisma.city.deleteMany().catch(() => {});

  // Users & Auth
  await prisma.phoneVerification.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.hopIn.deleteMany().catch(() => {});
  await prisma.account.deleteMany().catch(() => {});
  await prisma.session.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  // Admin
  await prisma.auditLog.deleteMany().catch(() => {});
  await prisma.barImport.deleteMany().catch(() => {});
  await prisma.barInvitation.deleteMany().catch(() => {});
  await prisma.adminUser.deleteMany().catch(() => {});
  await prisma.verificationToken.deleteMany().catch(() => {});
  await prisma.featuredBar.deleteMany().catch(() => {});

  // ============================================
  // CREATE CITIES
  // ============================================
  console.log("🏙️ Creating cities...");

  const helsinki = await prisma.city.create({
    data: { name: "Helsinki", country: "Finland", isActive: true },
  });

  const tampere = await prisma.city.create({
    data: { name: "Tampere", country: "Finland", isActive: true },
  });

  const turku = await prisma.city.create({
    data: { name: "Turku", country: "Finland", isActive: true },
  });

  // ============================================
  // CREATE ADMIN USERS (Business App)
  // ============================================
  console.log("👤 Creating admin users...");

  const admin1 = await prisma.adminUser.create({
    data: {
      email: "siegy@hoppr.com",
      name: "Siegfred Gamboa",
      role: AdminRole.SUPER_ADMIN,
      hashedPassword: await hashPassword("superadmin123"),
      isActive: true,
    },
  });

  const admin2 = await prisma.adminUser.create({
    data: {
      email: "pierce@hoppr.com",
      name: "Pierce Cosgrove",
      role: AdminRole.SUPER_ADMIN,
      hashedPassword: await hashPassword("admin123"),
      isActive: true,
    },
  });

  // ============================================
  // CREATE REGULAR USERS (User App)
  // ============================================
  console.log("👥 Creating regular users...");
  const userPassword = await hash("password123", 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        hashedPassword: userPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Miller",
        email: "sarah.miller@example.com",
        hashedPassword: userPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Mikko Korhonen",
        email: "mikko.korhonen@example.com",
        hashedPassword: userPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Emma Virtanen",
        email: "emma.virtanen@example.com",
        hashedPassword: userPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "David Chen",
        email: "david.chen@example.com",
        hashedPassword: userPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Lisa Park",
        email: "lisa.park@example.com",
        hashedPassword: userPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Jari Nieminen",
        email: "jari.nieminen@example.com",
        hashedPassword: userPassword,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Sofia Karlsson",
        email: "sofia.karlsson@example.com",
        hashedPassword: userPassword,
        emailVerified: new Date(),
      },
    }),
  ]);

  const [user1, user2, user3, user4, user5, user6, user7, user8] = users;

  // ============================================
  // CREATE BARS (Updated for schema changes)
  // ============================================
  console.log("🍻 Creating sample bars...");

  const operatingHours = {
    Monday: { open: "16:00", close: "02:00" },
    Tuesday: { open: "16:00", close: "02:00" },
    Wednesday: { open: "16:00", close: "02:00" },
    Thursday: { open: "16:00", close: "02:00" },
    Friday: { open: "16:00", close: "04:00" },
    Saturday: { open: "14:00", close: "04:00" },
    Sunday: { open: "14:00", close: "02:00" },
  };

  const bar1 = await prisma.bar.create({
    data: {
      name: "The Golden Pint",
      description: "Cozy pub with craft beers and live sports",
      address: "Main Street 123",
      cityName: "Helsinki",
      district: "Kallio",
      type: BarType.PUB,
      latitude: 60.1699,
      longitude: 24.9384,
      phone: "+358401234567",
      email: "info@goldenpint.fi",
      website: "https://goldenpint.fi",
      instagram: "@goldenpint",
      priceRange: PriceRange.MODERATE,
      capacity: 120,
      amenities: ["Terrace", "Sports TV", "Craft Beer"],
      operatingHours: operatingHours,
      vipEnabled: true,
      coverImage:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
      imageUrls: [
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
      status: BarStatus.UNCLAIMED,
      isVerified: false,
      isActive: true,
      cityId: helsinki.id,
      createdById: admin1.id,
    },
  });

  const bar2 = await prisma.bar.create({
    data: {
      name: "Midnight Club",
      description: "Premium nightclub with VIP experience",
      address: "Night Avenue 45",
      cityName: "Helsinki",
      district: "Kamppi",
      type: BarType.CLUB,
      latitude: 60.1685,
      longitude: 24.9328,
      phone: "+358409876543",
      email: "events@midnightclub.fi",
      website: "https://midnightclub.fi",
      instagram: "@midnightclub",
      priceRange: PriceRange.PREMIUM,
      capacity: 300,
      amenities: ["VIP Area", "DJ", "Cocktails"],
      operatingHours: {
        Thursday: { open: "22:00", close: "04:00" },
        Friday: { open: "22:00", close: "04:00" },
        Saturday: { open: "22:00", close: "04:00" },
      },
      vipEnabled: true,
      vipPrice: 25,
      coverImage:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      imageUrls: [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      status: BarStatus.VERIFIED,
      isVerified: true,
      isActive: true,
      cityId: helsinki.id,
      createdById: admin1.id,
    },
  });

  // Add more bars
  const bar3 = await prisma.bar.create({
    data: {
      name: "Sky Lounge",
      description: "Rooftop bar with panoramic city views",
      address: "Sky Tower 15",
      cityName: "Helsinki",
      district: "City Center",
      type: BarType.LOUNGE,
      latitude: 60.1702,
      longitude: 24.941,
      phone: "+358401112233",
      email: "hello@skylounge.fi",
      website: "https://skylounge.fi",
      instagram: "@skylounge",
      priceRange: PriceRange.PREMIUM,
      capacity: 80,
      amenities: ["Rooftop", "Cocktails", "Lounge Music"],
      operatingHours: operatingHours,
      vipEnabled: true,
      vipPrice: 15,
      coverImage:
        "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800",
      imageUrls: [
        "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800",
      status: BarStatus.VERIFIED,
      isVerified: true,
      isActive: true,
      cityId: helsinki.id,
      createdById: admin2.id,
    },
  });

  const bar4 = await prisma.bar.create({
    data: {
      name: "Tampere Beer House",
      description: "Famous for local craft beers",
      address: "Brewery Street 8",
      cityName: "Tampere",
      district: "Center",
      type: BarType.PUB,
      latitude: 61.4978,
      longitude: 23.761,
      phone: "+358403334455",
      email: "info@tamperebeer.fi",
      website: "https://tamperebeer.fi",
      instagram: "@tamperebeer",
      priceRange: PriceRange.MODERATE,
      capacity: 150,
      amenities: ["Beer Garden", "Pub Food", "Live Music"],
      operatingHours: operatingHours,
      vipEnabled: false,
      coverImage:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
      imageUrls: [
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
      status: BarStatus.VERIFIED,
      isVerified: true,
      isActive: true,
      cityId: tampere.id,
      createdById: admin2.id,
    },
  });

  // ============================================
  // CREATE BAR STAFF
  // ============================================
  console.log("👥 Creating bar staff...");

  const staffPassword = await hashPassword("staff123");

  await prisma.barStaff.create({
    data: {
      barId: bar2.id,
      email: "pierce@midnightclub.com",
      name: "Pierce Cosgrove",
      role: BarStaffRole.OWNER,
      permissions: ["*"],
      hashedPassword: await hashPassword("owner123"),
      isActive: true,
    },
  });

  await prisma.barStaff.create({
    data: {
      barId: bar2.id,
      email: "manager@midnightclub.com",
      name: "Sarah Johnson",
      role: BarStaffRole.MANAGER,
      permissions: [
        "manage_staff",
        "manage_promotions",
        "view_analytics",
        "scan_passes",
      ],
      hashedPassword: staffPassword,
      isActive: true,
    },
  });

  await prisma.barStaff.create({
    data: {
      barId: bar2.id,
      email: "tom@midnightclub.com",
      name: "Tom Wilson",
      role: BarStaffRole.STAFF,
      permissions: ["scan_passes"],
      hashedPassword: staffPassword,
      isActive: true,
    },
  });

  // ============================================
  // CREATE PROMOTIONS
  // ============================================
  console.log("🎉 Creating promotions...");

  const now = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  await prisma.barPromotion.create({
    data: {
      barId: bar2.id,
      title: "Friday Night VIP Experience",
      description: "Skip the line and get 2 complimentary drinks",
      type: PromotionType.VIP_OFFER,
      discount: 0,
      conditions: ["18+ only", "Valid ID required", "Dress code enforced"],
      startDate: now,
      endDate: nextYear,
      validDays: ["Friday"],
      isActive: true,
      isApproved: true,
      priority: 1,
    },
  });

  await prisma.barPromotion.create({
    data: {
      barId: bar1.id,
      title: "Happy Hour Special",
      description: "50% off all craft beers during happy hour",
      type: PromotionType.DRINK_SPECIAL,
      discount: 50,
      conditions: ["Valid 4pm-7pm", "Monday to Friday"],
      startDate: now,
      endDate: nextYear,
      validDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      isActive: true,
      isApproved: true,
      priority: 1,
    },
  });

  // ============================================
  // CREATE VIP PASSES
  // ============================================
  console.log("\n🎫 Creating VIP passes...");

  await prisma.vIPPassEnhanced.create({
    data: {
      barId: bar2.id,
      name: "Weekend Skip-the-Line Pass",
      description: "Fast entry for you and 3 friends",
      type: VIPPassType.SKIP_LINE,
      priceCents: 4999,
      originalPriceCents: 7999,
      benefits: ["Skip the line", "Priority entry", "Complimentary coat check"],
      validityStart: now,
      validityEnd: nextYear,
      validDays: ["Friday", "Saturday"],
      totalQuantity: 100,
      soldCount: 0,
      maxPerUser: 2,
      isActive: true,
    },
  });

  // ============================================
  // CREATE SOCIAL PROFILES
  // ============================================
  console.log("🎭 Creating social profiles...");

  await prisma.userSocialProfile.create({
    data: {
      userId: user1.id,
      bio: "Digital nomad and nightlife enthusiast!",
      vibe: SocialVibe.ADVENTUROUS,
      interests: ["Craft Beer", "Live Music", "Cocktails"],
      isSocialMode: true,
      socialStatus: SocialStatus.SOCIAL_MODE,
      lastActive: new Date(),
      locationLat: 60.1699,
      locationLng: 24.9384,
      currentBarId: bar1.id,
      isVisibleOnMap: true,
      maxDistance: 1000,
    },
  });

  await prisma.userSocialProfile.create({
    data: {
      userId: user2.id,
      bio: "Always looking for new friends to go out with! ✨",
      vibe: SocialVibe.CHILL,
      interests: ["Wine", "Conversation", "Live Jazz"],
      isSocialMode: true,
      socialStatus: SocialStatus.ONLINE,
      lastActive: new Date(),
      locationLat: 60.1685,
      locationLng: 24.9328,
      currentBarId: bar2.id,
      isVisibleOnMap: true,
      maxDistance: 500,
    },
  });

  await prisma.userSocialProfile.create({
    data: {
      userId: user3.id,
      bio: "Party animal looking for good vibes 🎉",
      vibe: SocialVibe.PARTY,
      interests: ["EDM", "Clubs", "Dancing"],
      isSocialMode: true,
      socialStatus: SocialStatus.SOCIAL_MODE,
      lastActive: new Date(),
      isVisibleOnMap: true,
      maxDistance: 2000,
    },
  });

  // Create social stats for users
  for (const user of users) {
    await prisma.userSocialStats.create({
      data: {
        userId: user.id,
        totalMeetups: Math.floor(Math.random() * 20),
        successfulMeetups: Math.floor(Math.random() * 15),
        hopInCount: Math.floor(Math.random() * 30),
        socialScore: 80 + Math.floor(Math.random() * 40),
        badges: ["Social Butterfly", "Friendly"],
      },
    });
  }

  // ============================================
  // CREATE SAMPLE CHATROOM (Private chat between users)
  // ============================================
  console.log("💬 Creating sample chatroom...");

  const chatroom = await prisma.chatroom.create({
    data: {
      name: "Alex & Sarah Chat",
      description: "Private conversation",
      isGroupChat: false,
      chatType: "PRIVATE",
      participants: {
        create: [
          { userId: user1.id, role: "MEMBER" },
          { userId: user2.id, role: "MEMBER" },
        ],
      },
    },
  });

  // Add some sample messages
  await prisma.chatroomMessage.create({
    data: {
      content: "Hey! Want to grab a drink tonight? 🍻",
      userId: user1.id,
      chatroomId: chatroom.id,
      messageType: "TEXT",
    },
  });

  await prisma.chatroomMessage.create({
    data: {
      content: "Sure! What time were you thinking?",
      userId: user2.id,
      chatroomId: chatroom.id,
      messageType: "TEXT",
    },
  });

  // ============================================
  // CREATE SAMPLE CRAWL
  // ============================================
  console.log("🚶 Creating sample crawl...");

  const crawlDate = new Date();
  crawlDate.setDate(crawlDate.getDate() + 7);
  crawlDate.setHours(20, 0, 0, 0);

  const crawl = await prisma.crawl.create({
    data: {
      name: "Helsinki Bar Crawl",
      description: "Visit the best bars in Helsinki!",
      creatorId: user1.id,
      cityId: helsinki.id,
      date: crawlDate,
      startTime: crawlDate,
      maxParticipants: 10,
      isPublic: true,
      status: CrawlStatus.PLANNING,
      crawlBars: {
        create: [
          { barId: bar1.id, orderIndex: 1, duration: 90 },
          { barId: bar2.id, orderIndex: 2, duration: 120 },
          { barId: bar3.id, orderIndex: 3, duration: 90 },
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
  });

  // Create chatroom for the crawl
  const crawlChatroom = await prisma.chatroom.create({
    data: {
      name: `${crawl.name} Chat`,
      description: `Group chat for ${crawl.name}`,
      crawlId: crawl.id,
      isGroupChat: true,
      chatType: "CRAWL",
      participants: {
        create: [
          { userId: user1.id, role: "ADMIN" },
          { userId: user2.id, role: "MEMBER" },
          { userId: user3.id, role: "MEMBER" },
        ],
      },
    },
  });

  // Update crawl with chatroom
  await prisma.crawl.update({
    where: { id: crawl.id },
    data: { chatroomId: crawlChatroom.id },
  });

  // ============================================
  // CREATE SAMPLE NOTIFICATIONS
  // ============================================
  console.log("🔔 Creating sample notifications...");

  await prisma.notification.create({
    data: {
      userId: user2.id,
      type: "HOP_REQUEST",
      fromUserId: user1.id,
      message: "Alex wants to join you tonight!",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: "SYSTEM",
      fromUserId: user1.id,
      message: "Welcome to Hoppr! Start exploring bars near you.",
      read: true,
      readAt: new Date(),
    },
  });

  // ============================================
  // CREATE FEATURED BARS
  // ============================================
  console.log("⭐ Creating featured bars...");

  await prisma.featuredBar.create({
    data: {
      barId: bar2.id,
      startDate: now,
      endDate: nextYear,
      priority: 1,
    },
  });

  await prisma.featuredBar.create({
    data: {
      barId: bar3.id,
      startDate: now,
      endDate: nextYear,
      priority: 2,
    },
  });

  // ============================================
  // UPDATE ANALYTICS
  // ============================================
  console.log("\n📊 Adding sample analytics data...");

  const promotions = await prisma.barPromotion.findMany();

  for (const promo of promotions) {
    const cardViews = Math.floor(Math.random() * 500) + 50;
    const redemptions = Math.floor(cardViews * (Math.random() * 0.5 + 0.2));

    await prisma.barPromotion.update({
      where: { id: promo.id },
      data: {
        cardViews,
        redemptions,
        views: Math.floor(Math.random() * 1000) + 100,
        clicks: Math.floor(Math.random() * 300) + 30,
      },
    });

    console.log(
      `   📊 ${promo.title}: ${cardViews} views → ${redemptions} redemptions`,
    );
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n✅ Unified seed completed successfully!");
  console.log("\n📋 TEST ACCOUNTS:");
  console.log("   === BUSINESS APP (Bar Owners) ===");
  console.log("   Admin 1: siegy@hoppr.com / superadmin123");
  console.log("   Admin 2: pierce@hoppr.com / admin123");
  console.log("   Bar Owner: pierce@midnightclub.com / owner123");
  console.log("   Bar Manager: manager@midnightclub.com / staff123");
  console.log("   Bar Staff: tom@midnightclub.com / staff123");
  console.log("\n   === USER APP (Customers) ===");
  console.log("   Alex Johnson: alex.johnson@example.com / password123");
  console.log("   Sarah Miller: sarah.miller@example.com / password123");
  console.log("   Mikko Korhonen: mikko.korhonen@example.com / password123");
  console.log("   (Password for all customer accounts: password123)");
  console.log("\n🍻 SAMPLE BARS:");
  console.log("   • The Golden Pint (Pub) - Helsinki");
  console.log("   • Midnight Club (Club) - Helsinki");
  console.log("   • Sky Lounge (Lounge) - Helsinki");
  console.log("   • Tampere Beer House (Pub) - Tampere");
  console.log("\n💬 TEST CHAT FEATURES:");
  console.log("   • Private chat created between Alex and Sarah");
  console.log("   • Crawl chat created for Helsinki Bar Crawl");
  console.log("   • Sample messages added to both chats");
  console.log("\n🚶 TEST CRAWLS:");
  console.log("   • Helsinki Bar Crawl created with 3 bars");
  console.log("   • 3 participants added (Alex, Sarah, Mikko)");
  console.log("\n📊 ANALYTICS DATA ADDED:");
  console.log("   • Card views and redemptions for each promotion");
  console.log("\n🔔 NOTIFICATIONS:");
  console.log("   • Sample notifications created for testing");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
