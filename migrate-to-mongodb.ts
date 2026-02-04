#!/usr/bin/env ts-node

/**
 * MongoDB Migration Helper Script
 * 
 * This script provides guidance for migrating services from Prisma to Mongoose
 * 
 * Run: npx ts-node migrate-to-mongodb.ts
 */

const servicesToMigrate = [
  {
    path: 'src/modules/auth/auth.service.ts',
    models: ['User', 'OtpVerification'],
    status: 'pending'
  },
  {
    path: 'src/modules/products/products.service.ts',
    models: ['Product', 'ProductImage', 'Category', 'Brand'],
    status: 'pending'
  },
  {
    path: 'src/modules/categories/categories.service.ts',
    models: ['Category', 'Product'],
    status: 'pending'
  },
  {
    path: 'src/modules/brands/brands.service.ts',
    models: ['Brand', 'Product'],
    status: 'pending'
  },
  {
    path: 'src/modules/cart/cart.service.ts',
    models: ['CartItem', 'Product', 'User'],
    status: 'pending'
  },
  {
    path: 'src/modules/wishlist/wishlist.service.ts',
    models: ['WishlistItem', 'Product', 'User'],
    status: 'pending'
  },
  {
    path: 'src/modules/orders/orders.service.ts',
    models: ['Order', 'OrderItem', 'Product', 'Address', 'User'],
    status: 'pending'
  },
  {
    path: 'src/modules/payments/payments.service.ts',
    models: ['Payment', 'Order'],
    status: 'pending'
  },
  {
    path: 'src/modules/reviews/reviews.service.ts',
    models: ['Review', 'Product', 'User'],
    status: 'pending'
  },
  {
    path: 'src/modules/banners/banners.service.ts',
    models: ['Banner'],
    status: 'pending'
  },
  {
    path: 'src/modules/blogs/blogs.service.ts',
    models: ['Blog'],
    status: 'pending'
  },
  {
    path: 'src/modules/verification/otp.service.ts',
    models: ['OtpVerification', 'User'],
    status: 'pending'
  },
  {
    path: 'src/modules/verification/verification.service.ts',
    models: ['User'],
    status: 'pending'
  },
  {
    path: 'src/modules/admin/admin.service.ts',
    models: ['User', 'Order', 'Product', 'Category', 'Setting'],
    status: 'pending'
  },
];

const migrationSteps = `
===========================================
MongoDB Migration Progress
===========================================

✅ COMPLETED:
  - Mongoose dependencies installed
  - All schemas created in src/database/schemas/
  - DatabaseModule configured
  - app.module.ts updated
  - users.service.ts migrated
  - users.module.ts updated

📋 REMAINING SERVICES TO MIGRATE:

${servicesToMigrate.map((s, i) => `
${i + 1}. ${s.path}
   Models needed: ${s.models.join(', ')}
   
   Module Update Required:
   - Import MongooseModule
   - Add MongooseModule.forFeature([...])
   
   Service Update Required:
   - Replace PrismaService injection
   - Add @InjectModel decorators for: ${s.models.join(', ')}
   - Update all query methods

`).join('')}

===========================================
MIGRATION PATTERN FOR EACH SERVICE:
===========================================

1. Update Module (e.g., auth.module.ts):

   import { MongooseModule } from '@nestjs/mongoose';
   import { UserSchema, OtpVerificationSchema } from '../../database/schemas';

   @Module({
     imports: [
       MongooseModule.forFeature([
         { name: 'User', schema: UserSchema },
         { name: 'OtpVerification', schema: OtpVerificationSchema },
       ]),
     ],
     // ... rest
   })

2. Update Service (e.g., auth.service.ts):

   import { InjectModel } from '@nestjs/mongoose';
   import { Model, Types } from 'mongoose';
   import { User, OtpVerification } from '../../database/schemas';

   constructor(
     @InjectModel('User') private userModel: Model<User>,
     @InjectModel('OtpVerification') private otpModel: Model<OtpVerification>,
     // ... other dependencies
   ) {}

3. Update Query Methods:

   Prisma → Mongoose
   ================
   this.prisma.user.findUnique({ where: { id } })
   → this.userModel.findById(id).lean()

   this.prisma.user.findMany({ where: { role: 'CUSTOMER' } })
   → this.userModel.find({ role: 'CUSTOMER' }).lean()

   this.prisma.user.create({ data: {...} })
   → this.userModel.create({...})

   this.prisma.user.update({ where: { id }, data: {...} })
   → this.userModel.findByIdAndUpdate(id, {...}, { new: true }).lean()

   this.prisma.user.delete({ where: { id } })
   → this.userModel.findByIdAndDelete(id)

   this.prisma.user.count({ where: {...} })
   → this.userModel.countDocuments({...})

===========================================
IMPORTANT NOTES:
===========================================

1. ObjectId Handling:
   - String IDs need conversion: new Types.ObjectId(stringId)
   - Relations use ObjectId type in schemas

2. Query Options:
   - Use .lean() for better performance (returns plain objects)
   - Use .populate() for relations instead of include
   - Use .sort() instead of orderBy
   - Use .select() instead of select object

3. Remove Prisma Imports:
   - Remove: import { ... } from '@prisma/client'
   - Remove: import { PrismaService } from '../../database/prisma.service'

4. Enum Handling:
   - Import enums from schemas instead of @prisma/client
   - Example: import { UserRole, SkinType } from '../../database/schemas/user.schema'

===========================================
RUN AFTER MIGRATION:
===========================================

1. Remove Prisma:
   npm uninstall @prisma/client prisma

2. Delete Prisma Files:
   rm -rf prisma/
   rm src/database/prisma.service.ts

3. Update package.json:
   Remove prisma scripts

4. Test Build:
   npm run build

5. Start Application:
   npm run start:dev

===========================================
`;

console.log(migrationSteps);

export {};
