const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Sample user data
const sampleUsers = [
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Love exploring new bars and meeting new people! 🍸",
    vibe: "PARTY",
    interests: ["Cocktails", "Live Music", "Dancing"],
    city: "Helsinki",
  },
  {
    name: "Sarah Williams",
    email: "sarah@example.com",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    bio: "Looking for friends to go bar hopping with 🎉",
    vibe: "CHILL",
    interests: ["Craft Beer", "Wine", "Conversation"],
    city: "Helsinki",
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Craft beer enthusiast and social butterfly 🦋",
    vibe: "NETWORKING",
    interests: ["Craft Beer", "Sports", "Networking"],
    city: "Tampere",
  },
  {
    name: "Emma Davis",
    email: "emma@example.com",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    bio: "New in town, looking for friends to explore with! ✨",
    vibe: "ADVENTUROUS",
    interests: ["Clubs", "Dancing", "Nightlife"],
    city: "Helsinki",
  },
  {
    name: "James Wilson",
    email: "james@example.com",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    bio: "Weekend warrior, always up for a good time 🎵",
    vibe: "PARTY",
    interests: ["EDM", "Clubs", "VIP Experiences"],
    city: "Turku",
  },
  {
    name: "Lisa Anderson",
    email: "lisa@example.com",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    bio: "Cocktail connoisseur and social host 🍹",
    vibe: "CHILL",
    interests: ["Cocktails", "Wine", "Food"],
    city: "Helsinki",
  },
  {
    name: "Tom Martinez",
    email: "tom@example.com",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    bio: "Let's grab a drink and have some fun! 🍻",
    vibe: "CASUAL",
    interests: ["Beer", "Sports", "Games"],
    city: "Tampere",
  },
  {
    name: "Rachel Green",
    email: "rachel@example.com",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    bio: "Making the most of every night out 🌙",
    vibe: "PARTY",
    interests: ["Dancing", "Music", "Socializing"],
    city: "Helsinki",
  },
];

async function main() {
  console.log("🌱 Starting to seed social users...\n");

  // Get or create cities
  const cities = [];
  for (const cityName of ["Helsinki", "Tampere", "Turku"]) {
    const city = await prisma.city.upsert({
      where: { name: cityName },
      update: {},
      create: {
        name: cityName,
        country: "Finland",
        isActive: true,
      },
    });
    cities.push(city);
  }

  console.log(`✅ Found/created ${cities.length} cities`);

  for (const userData of sampleUsers) {
    const city = cities.find((c) => c.name === userData.city);

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        image: userData.image,
        emailVerified: new Date(),
        hashedPassword: null,
      },
    });

    console.log(`✅ Created user: ${user.name} (${user.email})`);

    // Create social profile for user
    const socialProfile = await prisma.userSocialProfile.upsert({
      where: { userId: user.id },
      update: {
        bio: userData.bio,
        vibe: userData.vibe,
        interests: userData.interests,
        isSocialMode: true,
        socialStatus: "ONLINE",
        isVisibleOnMap: true,
      },
      create: {
        userId: user.id,
        bio: userData.bio,
        vibe: userData.vibe,
        interests: userData.interests,
        isSocialMode: true,
        socialStatus: "ONLINE",
        isVisibleOnMap: true,
        maxDistance: 1000,
      },
    });

    console.log(`✅ Created social profile for ${user.name}`);

    // Create social stats
    await prisma.userSocialStats.upsert({
      where: { userId: user.id },
      update: {
        totalMeetups: Math.floor(Math.random() * 10),
        successfulMeetups: Math.floor(Math.random() * 8),
        hopInCount: Math.floor(Math.random() * 20),
        socialScore: 100 + Math.floor(Math.random() * 50),
      },
      create: {
        userId: user.id,
        totalMeetups: Math.floor(Math.random() * 10),
        successfulMeetups: Math.floor(Math.random() * 8),
        hopInCount: Math.floor(Math.random() * 20),
        socialScore: 100 + Math.floor(Math.random() * 50),
        badges: ["Friendly", "Social Butterfly"],
      },
    });

    console.log(`✅ Created social stats for ${user.name}\n`);
  }

  // Create some sample hop-in requests between users
  const allUsers = await prisma.user.findMany({
    where: { email: { in: sampleUsers.map((u) => u.email) } },
    take: 4,
  });

  if (allUsers.length >= 2) {
    // Create a pending hop-in request between first two users
    const existingHopIn = await prisma.hopIn.findFirst({
      where: {
        fromUserId: allUsers[0].id,
        toUserId: allUsers[1].id,
      },
    });

    if (!existingHopIn) {
      await prisma.hopIn.create({
        data: {
          fromUserId: allUsers[0].id,
          toUserId: allUsers[1].id,
          message: "Hey! Want to grab a drink tonight? 🍻",
          status: "PENDING",
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      });
      console.log(
        `✅ Created sample hop-in request from ${allUsers[0].name} to ${allUsers[1].name}`,
      );
    }
  }

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users created: ${sampleUsers.length}`);
  console.log(`   - Social profiles: ${sampleUsers.length}`);
  console.log(`   - Cities: ${cities.length}`);
  console.log(
    "\n🔑 You can now log in with any of these emails (no password needed)",
  );
  console.log("   Example: alex@example.com, sarah@example.com, etc.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
