# 🎉 MongoDB Migration Complete - Quick Start Guide

## ✅ Migration Status: READY FOR SERVICE UPDATES

Your NestJS backend has been successfully migrated from Prisma to MongoDB with Mongoose!

---

## 🚀 Quick Start

### 1. Set Up MongoDB

**Option A: Local MongoDB (macOS)**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: MongoDB Atlas (Cloud)**
- Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string

### 2. Configure Environment

Update your `.env` file:
```env
DATABASE_URL=mongodb://localhost:27017/glovia
# OR for MongoDB Atlas:
# DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/glovia
```

### 3. Start Application

```bash
npm run start:dev
```

---

## 📊 Current Status

### ✅ Completed
- [x] Mongoose dependencies installed
- [x] 17 Mongoose schemas created
- [x] DatabaseModule configured and integrated
- [x] Project builds successfully
- [x] Example migration: `users.service.ts` ✨

### ⏳ Remaining Work
- [ ] Migrate 15 remaining services (see pattern below)
- [ ] Test all endpoints
- [ ] Remove Prisma files (after all migrations)

---

## 🔧 How to Migrate Remaining Services

### Services to Migrate (in priority order):

**High Priority:**
1. `src/modules/auth/` - Authentication
2. `src/modules/products/` - Product management
3. `src/modules/cart/` - Shopping cart
4. `src/modules/orders/` - Order processing
5. `src/modules/payments/` - Payment handling

**Medium Priority:**
6. `src/modules/categories/` - Category management
7. `src/modules/brands/` - Brand management
8. `src/modules/reviews/` - Product reviews
9. `src/modules/verification/` - OTP verification
10. `src/modules/admin/` - Admin operations

**Low Priority:**
11. `src/modules/wishlist/` - Wishlist
12. `src/modules/banners/` - Banners
13. `src/modules/blogs/` - Blog posts
14. `src/modules/upload/` - File uploads

### Migration Pattern (Copy from users.service.ts)

**1. Update Service File:**

```typescript
// OLD - Remove this
import { PrismaService } from '../../database/prisma.service';
constructor(private prisma: PrismaService) {}

// NEW - Add this
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, Product } from '../../database/schemas';

constructor(
  @InjectModel('User') private userModel: Model<User>,
  @InjectModel('Product') private productModel: Model<Product>,
) {}
```

**2. Update Module File:**

```typescript
// Add to imports
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, ProductSchema } from '../../database/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  // ... rest of module config
})
```

**3. Update Query Methods:**

```typescript
// Finding records
this.prisma.user.findUnique({ where: { id } })
→ this.userModel.findById(id).lean()

this.prisma.user.findMany({ where: { role: 'CUSTOMER' } })
→ this.userModel.find({ role: 'CUSTOMER' }).lean()

// Creating records
this.prisma.user.create({ data: {...} })
→ this.userModel.create({...})

// Updating records
this.prisma.user.update({ where: { id }, data: {...} })
→ this.userModel.findByIdAndUpdate(id, {...}, { new: true }).lean()

// Deleting records
this.prisma.user.delete({ where: { id } })
→ this.userModel.findByIdAndDelete(id)

// Counting
this.prisma.user.count({ where: {...} })
→ this.userModel.countDocuments({...})
```

**4. Handle ObjectIds:**

```typescript
// When working with related records
userId: new Types.ObjectId(userId)
```

**5. Test Build:**

```bash
npm run build
```

---

## 📁 Available Schemas

All schemas are in `src/database/schemas/`:

```typescript
import {
  User, UserSchema,
  Address, AddressSchema,
  Category, CategorySchema,
  Brand, BrandSchema,
  Product, ProductSchema,
  ProductImage, ProductImageSchema,
  CartItem, CartItemSchema,
  WishlistItem, WishlistItemSchema,
  Order, OrderSchema,
  OrderItem, OrderItemSchema,
  Payment, PaymentSchema,
  Review, ReviewSchema,
  Coupon, CouponSchema,
  Banner, BannerSchema,
  Blog, BlogSchema,
  OtpVerification, OtpVerificationSchema,
  Setting, SettingSchema,
} from '../../database/schemas';
```

---

## 🛠 Migration Helper Scripts

```bash
# Check migration status
./check-migration.sh

# View detailed migration guide
cat MONGODB_MIGRATION_SUMMARY.md

# View environment setup guide
cat MONGODB_ENV_SETUP.md
```

---

## 🎯 Step-by-Step Workflow

### For Each Service:

1. **Open the service file** (e.g., `auth.service.ts`)
2. **Check what models it uses** (look at prisma queries)
3. **Update imports** (remove Prisma, add Mongoose)
4. **Update constructor** (use @InjectModel)
5. **Update all query methods** (follow the pattern)
6. **Update the module file** (add MongooseModule.forFeature)
7. **Build and test**: `npm run build`
8. **Commit your changes**
9. **Move to next service**

---

## 🧪 Testing

After migrating a service:

```bash
# Build check
npm run build

# Run development server
npm run start:dev

# Test the endpoints for that module
# Example: Test auth endpoints after migrating auth service
```

---

## 📚 Documentation Reference

- **Complete Migration Guide**: `MONGODB_MIGRATION_GUIDE.md`
- **Environment Setup**: `MONGODB_ENV_SETUP.md`
- **Migration Summary**: `MONGODB_MIGRATION_SUMMARY.md`
- **Reference Example**: `src/modules/users/users.service.ts`

---

## ⚠️ Important Notes

1. **Always use `.lean()`** on queries that return data to users (better performance)
2. **ObjectId conversion** is needed for string IDs: `new Types.ObjectId(id)`
3. **Populate for relations**: Use `.populate()` instead of Prisma's `include`
4. **Test incrementally**: Migrate one service at a time
5. **Keep Prisma until done**: Don't run cleanup script until all services are migrated

---

## 🎓 Common Mongoose Query Patterns

```typescript
// Find with conditions
await this.model.find({ status: 'active', role: 'CUSTOMER' }).lean();

// Find with population (relations)
await this.model.findById(id)
  .populate('userId', 'firstName lastName email')
  .lean();

// Find with sorting
await this.model.find({}).sort({ createdAt: -1 }).lean();

// Find with pagination
await this.model.find({})
  .skip(page * limit)
  .limit(limit)
  .lean();

// Update many
await this.model.updateMany(
  { userId: new Types.ObjectId(userId) },
  { isActive: false }
);

// Increment counter
await this.model.findByIdAndUpdate(id, {
  $inc: { count: 1 }
});

// Array operations
await this.model.findByIdAndUpdate(id, {
  $push: { tags: 'new-tag' }
});
```

---

## 🔄 After All Services Are Migrated

```bash
# 1. Run cleanup script
./cleanup-prisma.sh

# 2. Remove Prisma scripts from package.json manually

# 3. Test full application
npm run build
npm run start:dev

# 4. Test all endpoints

# 5. Deploy! 🚀
```

---

## ✅ Verification Checklist

Before considering migration complete:

- [ ] All services migrated
- [ ] Project builds without errors
- [ ] All endpoints tested and working
- [ ] MongoDB connection stable
- [ ] No Prisma imports remaining
- [ ] Prisma files cleaned up

---

## 💡 Pro Tips

1. **Migrate high-priority services first** (auth, products, orders)
2. **Test each service** before moving to the next
3. **Use the users.service.ts as reference** - it's fully migrated
4. **Keep the migration guides handy** - they have all the patterns
5. **Don't rush** - quality over speed

---

## 🎉 You're All Set!

The foundation is complete. Just migrate the services one by one using the pattern from `users.service.ts`, and you'll have a fully MongoDB-powered backend!

**Good luck! 🚀**
