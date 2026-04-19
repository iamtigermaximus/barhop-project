const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Users in database: ${userCount}`);
    
    const barCount = await prisma.bar.count();
    console.log(`✅ Bars in database: ${barCount}`);
    
    console.log('\n🎉 Socket server Prisma client is working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
