#!/bin/bash

# MongoDB Migration - Cleanup Script
# Run this AFTER all services have been migrated to Mongoose

echo "======================================"
echo "MongoDB Migration - Cleanup"
echo "======================================"
echo ""

echo "⚠️  WARNING: This script will remove Prisma files and dependencies"
echo "   Make sure all services have been migrated to Mongoose first!"
echo ""

read -p "Have you completed migrating all services? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cleanup cancelled. Complete the migration first."
    exit 0
fi

echo ""
echo "Creating final backup..."
BACKUP_DIR="./prisma_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r prisma "$BACKUP_DIR/" 2>/dev/null || echo "No prisma directory to backup"
cp src/database/prisma.service.ts "$BACKUP_DIR/" 2>/dev/null || echo "No prisma.service.ts to backup"
echo "Backup created in $BACKUP_DIR"
echo ""

echo "Step 1: Removing Prisma dependencies..."
npm uninstall @prisma/client prisma

echo ""
echo "Step 2: Removing Prisma files..."
rm -rf prisma/
rm -f src/database/prisma.service.ts

echo ""
echo "Step 3: Updating package.json scripts..."
# Note: This would need manual editing or a more sophisticated script

echo ""
echo "======================================"
echo "Manual Steps Remaining:"
echo "======================================"
echo ""
echo "1. Update package.json - Remove these scripts:"
echo "   - \"prisma:generate\""
echo "   - \"prisma:migrate\""
echo "   - \"prisma:studio\""
echo "   - \"prisma:seed\""
echo ""
echo "2. Remove prisma.seed configuration from package.json"
echo ""
echo "3. Verify all services are working:"
echo "   npm run build"
echo "   npm run start:dev"
echo ""
echo "4. Test all endpoints to ensure functionality"
echo ""
echo "======================================"
echo "Cleanup Complete!"
echo "======================================"
echo ""
echo "Your application is now using MongoDB with Mongoose!"
echo ""
