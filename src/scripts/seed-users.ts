import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import * as bcryptjs from 'bcryptjs';

async function seedUsers() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  const users = [
    {
      email: 'superadmin@glovia.com.np',
      password: 'SuperAdmin123!',
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+977-9800000001',
      role: 'super_admin',
      isVerified: true,
      trustScore: 100,
    },
    {
      email: 'admin@glovia.com.np',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+977-9800000002',
      role: 'admin',
      isVerified: true,
      trustScore: 100,
    },
    {
      email: 'vendor@glovia.com.np',
      password: 'Vendor123!',
      firstName: 'Vendor',
      lastName: 'Account',
      phone: '+977-9800000003',
      role: 'vendor',
      isVerified: true,
      trustScore: 75,
    },
    {
      email: 'user@glovia.com.np',
      password: 'User123!',
      firstName: 'Regular',
      lastName: 'User',
      phone: '+977-9800000004',
      role: 'user',
      isVerified: true,
      trustScore: 50,
    },
  ];

  try {
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await usersService.findByEmail(userData.email);
      if (existingUser) {
        console.log(`✓ User ${userData.email} already exists`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(userData.password, 10);

      // Create user
      const user = await usersService.create({
        ...userData,
        password: hashedPassword,
      });

      console.log(`✓ Created ${userData.role}: ${userData.email}`);
      console.log(`  Password: ${userData.password}`);
    }

    console.log('\n✓ User seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding users:', error.message);
  } finally {
    await app.close();
  }
}

seedUsers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
