import { PrismaClient, BarType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌆 Seeding Helsinki bars...");

  // Get or create Helsinki city
  const helsinki = await prisma.city.upsert({
    where: { name: "Helsinki" },
    update: {},
    create: { name: "Helsinki", country: "Finland" },
  });

  // Helsinki bars data
  const helsinkiBars = [
    {
      name: "Teatteri",
      description:
        "Multi-level club with restaurant, lounge, and nightclub. Known for its elegant atmosphere and international DJs.",
      address: "Pohjoisesplanadi 2, 00170 Helsinki",
      district: "Kampii",
      type: BarType.CLUB,
      latitude: 60.1675,
      longitude: 24.9422,
      vipEnabled: true,
      vipPrice: 15.0,
      vipCapacity: 50,
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
    },
    {
      name: "Kaivohuone",
      description:
        "Historic villa turned nightclub in Kaivopuisto park. Summer terrace with stunning sea views.",
      address: "Kaivopuisto, 00140 Helsinki",
      district: "Kaivopuisto",
      type: BarType.CLUB,
      latitude: 60.1578,
      longitude: 24.9567,
      vipEnabled: true,
      vipPrice: 12.0,
      vipCapacity: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1566416834170-56dfd1d336f9?w=500",
    },
    {
      name: "Ateljee Bar",
      description:
        "Rooftop bar with panoramic views of Helsinki. Perfect for cocktails with a view.",
      address: "Sokos Hotel Torni, 00100 Helsinki",
      district: "Kamppi",
      type: BarType.LOUNGE,
      latitude: 60.1685,
      longitude: 24.9438,
      vipEnabled: false,
      imageUrl:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500",
    },
    {
      name: "Bruuveri",
      description:
        "Cozy craft beer pub with extensive selection of local and international brews.",
      address: "Kalevankatu 2, 00100 Helsinki",
      district: "Kamppi",
      type: BarType.PUB,
      latitude: 60.1682,
      longitude: 24.9315,
      vipEnabled: false,
      imageUrl:
        "https://images.unsplash.com/photo-1567696911980-2c42a7660a4a?w=500",
    },
    {
      name: "Storyville",
      description:
        "Jazz club with live music and sophisticated cocktail menu. Intimate atmosphere.",
      address: "Museokatu 8, 00100 Helsinki",
      district: "Kampii",
      type: BarType.LIVE_MUSIC,
      latitude: 60.1745,
      longitude: 24.9318,
      vipEnabled: true,
      vipPrice: 8.0,
      vipCapacity: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
    },
    {
      name: "Sports Academy",
      description:
        "Modern sports bar with multiple screens, pool tables, and game consoles.",
      address: "Mannerheimintie 14, 00100 Helsinki",
      district: "Kampii",
      type: BarType.SPORTS_BAR,
      latitude: 60.1698,
      longitude: 24.9372,
      vipEnabled: true,
      vipPrice: 10.0,
      vipCapacity: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
    },
    {
      name: "Kappeli",
      description:
        "Historic restaurant and bar by the park. Elegant setting with classic cocktails.",
      address: "Eteläesplanadi 1, 00130 Helsinki",
      district: "Eteläsatama",
      type: BarType.RESTAURANT_BAR,
      latitude: 60.1669,
      longitude: 24.9478,
      vipEnabled: false,
      imageUrl:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500",
    },
    {
      name: "Kuudes Linja",
      description:
        "Underground club with electronic music and alternative events. Raw industrial vibe.",
      address: "Kaikukatu 4, 00530 Helsinki",
      district: "Kallio",
      type: BarType.CLUB,
      latitude: 60.1842,
      longitude: 24.9508,
      vipEnabled: false,
      imageUrl:
        "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=500",
    },
    {
      name: "Siltanen",
      description:
        "Popular bar in Kallio with eclectic decor, live music, and DJ nights.",
      address: "Hämeentie 13, 00530 Helsinki",
      district: "Kallio",
      type: BarType.PUB,
      latitude: 60.1835,
      longitude: 24.9492,
      vipEnabled: false,
      imageUrl:
        "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500",
    },
    {
      name: "Karaoke Bar Restroom",
      description:
        "Fun karaoke bar with private rooms and extensive song selection. Great for groups.",
      address: "Mannerheimintie 6, 00100 Helsinki",
      district: "Kampii",
      type: BarType.KARAOKE,
      latitude: 60.1692,
      longitude: 24.9415,
      vipEnabled: true,
      vipPrice: 5.0,
      vipCapacity: 15,
      imageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500",
    },
  ];

  // First delete existing bars to avoid duplicates
  await prisma.bar.deleteMany({
    where: {
      cityId: helsinki.id,
    },
  });

  // Create all bars
  for (const barData of helsinkiBars) {
    await prisma.bar.create({
      data: {
        ...barData,
        cityId: helsinki.id,
      },
    });
    console.log(`✅ Added: ${barData.name}`);
  }

  console.log(`🎉 ${helsinkiBars.length} Helsinki bars seeded successfully!`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
