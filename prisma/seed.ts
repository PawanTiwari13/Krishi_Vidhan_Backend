import { PrismaClient, RoleType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Krishi Vidhan Database Seeding...');

  // 1. Seed Roles
  const roles = [
    { name: RoleType.BUYER, description: 'Agricultural Buyer / Farmer' },
    { name: RoleType.SELLER, description: 'Verified Agricultural Input & Produce Seller' },
    { name: RoleType.ADMIN, description: 'Platform Administrator' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }
  console.log('✅ Roles seeded: BUYER, SELLER, ADMIN');

  // 2. Seed Core Categories
  const categories = [
    {
      name: 'Crop',
      slug: 'crop',
      description: 'Freshly harvested grains, pulses, vegetables, and fruits directly from farms.',
    },
    {
      name: 'Seed',
      slug: 'seed',
      description: 'Certified high-yield hybrid and organic seeds for seasonal sowing.',
    },
    {
      name: 'Fertilizer',
      slug: 'fertilizer',
      description: 'Organic bio-fertilizers, NPK nutrients, and soil conditioners.',
    },
    {
      name: 'Medicine',
      slug: 'medicine',
      description: 'Crop protection pesticides, fungicides, herbicides, and plant growth regulators.',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
  }
  console.log('✅ Categories seeded: Crop, Seed, Fertilizer, Medicine');

  // 3. Seed Indian States & Administrative Divisions
  const stateDivisions: Record<string, { code: string; divisions: string[] }> = {
    Maharashtra: {
      code: 'MH',
      divisions: [
        'Nagpur',
        'Pune',
        'Nashik',
        'Amravati',
        'Chhatrapati Sambhajinagar',
        'Konkan',
      ],
    },
    'Madhya Pradesh': {
      code: 'MP',
      divisions: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
    },
    'Uttar Pradesh': {
      code: 'UP',
      divisions: ['Lucknow', 'Kanpur', 'Varanasi', 'Prayagraj', 'Agra', 'Meerut'],
    },
    Gujarat: {
      code: 'GJ',
      divisions: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    },
    Punjab: {
      code: 'PB',
      divisions: ['Ludhiana', 'Jalandhar', 'Patiala', 'Amritsar', 'Ferozepur'],
    },
    Rajasthan: {
      code: 'RJ',
      divisions: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Bikaner'],
    },
  };

  for (const [stateName, data] of Object.entries(stateDivisions)) {
    const state = await prisma.state.upsert({
      where: { name: stateName },
      update: { code: data.code },
      create: {
        name: stateName,
        code: data.code,
      },
    });

    for (const divisionName of data.divisions) {
      await prisma.division.upsert({
        where: {
          stateId_name: {
            stateId: state.id,
            name: divisionName,
          },
        },
        update: {},
        create: {
          name: divisionName,
          stateId: state.id,
        },
      });
    }
  }
  console.log('✅ States and Administrative Divisions seeded.');
  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

