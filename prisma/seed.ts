import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.sweet.deleteMany({});

  const sweets = [
    { name: 'Gulab Jamun', category: 'Syrup Based', price: 20, quantity: 100 },
    { name: 'Kaju Katli', category: 'Burfi', price: 500, quantity: 50 },
    { name: 'Rasgulla', category: 'Syrup Based', price: 25, quantity: 80 },
    { name: 'Motichoor Laddu', category: 'Laddu', price: 15, quantity: 200 },
    { name: 'Mysore Pak', category: 'Ghee Based', price: 30, quantity: 60 },
    { name: 'Jalebi', category: 'Fried', price: 40, quantity: 150 },
    { name: 'Soan Papdi', category: 'Flaky', price: 150, quantity: 100 },
  ];

  for (const sweet of sweets) {
    await prisma.sweet.create({
      data: sweet,
    });
  }
  console.log('Database seeded with Indian sweets.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
