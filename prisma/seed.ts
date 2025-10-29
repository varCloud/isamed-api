import { seedBrandCategories } from "../seeders/brands";
import { seedCustomers } from "../seeders/customers";
import { seedEquipmentCategories } from "../seeders/equipments";
import { seedUsers } from "../seeders/users";
import prisma from "../src/config/prisma";

async function main() {
  await seedBrandCategories();
  await seedEquipmentCategories();
  await seedCustomers();
  await seedUsers();
  
  console.log("Seed completed successfully.");
}

main()
  .catch(e => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(() => {
    console.log("Seeding process finished.");
    prisma.$disconnect();
  });