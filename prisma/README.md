# prisma/

The `prisma/` directory contains the database schema and migration files managed by Prisma ORM. This is the source of truth for the database structure.

## 📁 Structure

```
prisma/
├── schema.prisma       # Database schema definition
└── migrations/         # Generated migration files
    ├── migration_lock.toml
    └── [timestamp]_[name]/
        └── migration.sql
```

## 🎯 Schema Overview

The schema defines four core models:

| Model | Purpose |
|-------|---------|
| `User` | User accounts (OAuth + email) |
| `Timesheet` | Time tracking sheets with hourly rate |
| `LineItem` | Individual work entries (date, minutes, description) |
| `Account`, `Session`, `VerificationToken` | NextAuth.js models |

### Relationships
```
User (1) ──► (n) Timesheet (1) ──► (n) LineItem
  │
  └──► Account, Session (NextAuth)
```

## 🎯 Conventions

### Schema Annotations
Every field should have a descriptive comment:
```prisma
model Timesheet {
  id        Int      @id @default(autoincrement()) // Primary key, auto-increment
  userId    String   // Foreign key linking to User
  rate      Decimal  @db.Decimal(10, 2) // Hourly rate (Decimal for precision)
  createdAt DateTime @default(now()) // Creation timestamp
}
```

### Data Types
- **IDs**: Use `Int @default(autoincrement())` for performance, `String @default(uuid())` for user-facing IDs
- **Money**: Use `Decimal @db.Decimal(10, 2)` for currency values
- **Timestamps**: Use `DateTime @default(now())` for creation dates
- **Relations**: Always specify `onDelete` behavior (usually `Cascade`)

### Indexes
Add indexes for frequently queried foreign keys:
```prisma
@@index([userId])      // On Timesheet
@@index([timesheetId]) // On LineItem
```

## 🔧 Common Commands

```bash
# Create a new migration after schema changes
pnpm prisma:migrate
# or: npx prisma migrate dev --name descriptive_name

# Generate Prisma Client after schema changes
pnpm prisma:generate
# or: npx prisma generate

# Format schema file
pnpm prisma:format
# or: npx prisma format

# Open Prisma Studio (visual database browser)
pnpm prisma:studio
# or: npx prisma studio

# Reset database (DEV ONLY - drops all data)
pnpm prisma:reset:dev
# or: npx prisma migrate reset
```

## ✅ Making Schema Changes

1. **Edit `schema.prisma`** with your changes
2. **Run migration**:
   ```bash
   pnpm prisma:migrate
   ```
3. **Enter a descriptive name** when prompted (e.g., `add_project_field`)
4. **Regenerate client** (usually automatic):
   ```bash
   pnpm prisma:generate
   ```
5. **Update TypeScript types** if needed in components/utils

### Example: Adding a New Field
```prisma
model Timesheet {
  // ... existing fields
  projectName String?  // Optional project name for categorization
}
```

Then run:
```bash
pnpm prisma:migrate
# Enter name: add_project_name
```

### Example: Adding a New Model
```prisma
model Project {
  id          Int         @id @default(autoincrement())
  name        String
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  timesheets  Timesheet[]

  @@index([userId])
}
```

Don't forget to add the reverse relation in `User`:
```prisma
model User {
  // ... existing fields
  projects   Project[]
}
```

## ⚠️ Important Notes

### NextAuth Models
The `Account`, `Session`, and `VerificationToken` models are required by NextAuth's PrismaAdapter. **Do not modify these** unless you understand the implications.

### Migration History
- Never edit or delete existing migrations in production
- Migrations in `migrations/` are version-controlled
- Each migration contains the raw SQL that was applied

### Environment Variables
Required in `.env`:
```
DATABASE_URL="postgresql://user:password@host:5432/database"
```

## 📚 Best Practices

- Always add comments to schema fields
- Use meaningful migration names (`add_rate_to_timesheet`, not `update`)
- Test migrations locally before deploying
- Back up production data before running migrations
- Use `Decimal` for money, never `Float`
- Add indexes for foreign keys and frequently filtered fields
