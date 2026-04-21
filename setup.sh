#!/bin/bash

# ============================================================
# IELTS Backend — Complete Project Setup Script
# Run: chmod +x setup.sh && ./setup.sh
# ============================================================

set -e

PROJECT_NAME="ielts-backend"
echo "🚀 Setting up $PROJECT_NAME..."
echo "=============================================="

# ============================================================
# CREATE ROOT DIRECTORY
# ============================================================

mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

echo "📁 Creating folder structure..."

# ============================================================
# CREATE FOLDER STRUCTURE
# ============================================================

# Docker
mkdir -p docker

# Prisma
mkdir -p prisma/migrations

# Source
mkdir -p src/config
mkdir -p src/common/constants
mkdir -p src/common/decorators
mkdir -p src/common/dto
mkdir -p src/common/filters
mkdir -p src/common/guards
mkdir -p src/common/interceptors
mkdir -p src/common/interfaces
mkdir -p src/common/pipes
mkdir -p src/utils

# Modules
mkdir -p src/modules/prisma
mkdir -p src/modules/redis
mkdir -p src/modules/s3
mkdir -p src/modules/auth/strategies
mkdir -p src/modules/auth/dto
mkdir -p src/modules/users/dto
mkdir -p src/modules/books/dto
mkdir -p src/modules/questions/dto
mkdir -p src/modules/content
mkdir -p src/modules/subscriptions/dto
mkdir -p src/modules/payments/dto
mkdir -p src/modules/webhooks
mkdir -p src/modules/admin/controllers
mkdir -p src/modules/admin/services
mkdir -p src/modules/admin/dto

# Tests
mkdir -p test

echo "✅ Folder structure created"

# ============================================================
# ROOT CONFIG FILES
# ============================================================

echo "📝 Creating root configuration files..."

# ---------- .env.example ----------
cat > .env.example << 'EOF'
# ========================
# APPLICATION
# ========================
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
FRONTEND_URL=http://localhost:3001
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000

# ========================
# DATABASE
# ========================
DATABASE_URL=postgresql://ielts_user:ielts_password@localhost:5432/ielts_db?schema=public

# ========================
# REDIS
# ========================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# ========================
# JWT
# ========================
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRATION=7d

# ========================
# AWS S3
# ========================
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=ielts-pdfs-private
AWS_S3_PUBLIC_BUCKET=ielts-public-assets

# ========================
# RAZORPAY
# ========================
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# ========================
# EMAIL (Resend)
# ========================
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# ========================
# RATE LIMITING
# ========================
THROTTLE_TTL=60
THROTTLE_LIMIT=60

# ========================
# ADMIN
# ========================
SUPER_ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_PASSWORD=change-this-in-production
EOF

# Copy to .env
cp .env.example .env

# ---------- .gitignore ----------
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build
dist/
build/

# Environment
.env
.env.local
.env.production

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Test
coverage/

# Docker volumes
postgres_data/
redis_data/

# Prisma
prisma/migrations/*.sql.bak
EOF

# ---------- .dockerignore ----------
cat > .dockerignore << 'EOF'
node_modules
dist
.git
.gitignore
.env
.env.*
docker-compose*.yml
README.md
coverage
test
*.md
.vscode
.idea
EOF

# ---------- .prettierrc ----------
cat > .prettierrc << 'EOF'
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 90,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
EOF

# ---------- .eslintrc.js ----------
cat > .eslintrc.js << 'ESLINTEOF'
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
ESLINTEOF

# ---------- tsconfig.json ----------
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@config/*": ["src/config/*"],
      "@common/*": ["src/common/*"],
      "@modules/*": ["src/modules/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
EOF

# ---------- tsconfig.build.json ----------
cat > tsconfig.build.json << 'EOF'
{
  "extends": "./tsconfig.json",
  "exclude": [
    "node_modules",
    "test",
    "dist",
    "**/*spec.ts",
    "prisma/seed.ts"
  ]
}
EOF

# ---------- nest-cli.json ----------
cat > nest-cli.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
EOF

# ---------- package.json ----------
cat > package.json << 'EOF'
{
  "name": "ielts-backend",
  "version": "1.0.0",
  "description": "IELTS Exam Platform Backend",
  "author": "",
  "private": true,
  "license": "MIT",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate:dev": "prisma migrate dev",
    "prisma:migrate:prod": "prisma migrate deploy",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "docker:dev": "docker-compose up -d",
    "docker:dev:down": "docker-compose down",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up -d",
    "docker:prod:down": "docker-compose -f docker-compose.prod.yml down"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.3.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/schedule": "^4.0.0",
    "@nestjs/swagger": "^7.2.0",
    "@nestjs/throttler": "^5.1.1",
    "@prisma/client": "^5.8.0",
    "@aws-sdk/client-s3": "^3.490.0",
    "@aws-sdk/s3-request-presigner": "^3.490.0",
    "bcryptjs": "^2.4.3",
    "bullmq": "^5.1.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "cookie-parser": "^1.4.6",
    "helmet": "^7.1.0",
    "ioredis": "^5.3.2",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "pdf-lib": "^1.17.1",
    "pino": "^8.17.2",
    "nestjs-pino": "^3.5.0",
    "pino-http": "^9.0.0",
    "pino-pretty": "^10.3.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1",
    "sharp": "^0.33.2",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/schematics": "^10.1.0",
    "@nestjs/testing": "^10.3.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie-parser": "^1.4.6",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.11.0",
    "@types/passport-jwt": "^4.0.0",
    "@types/uuid": "^9.0.7",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "@typescript-eslint/parser": "^6.18.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "jest": "^29.7.0",
    "prettier": "^3.2.2",
    "prisma": "^5.8.0",
    "source-map-support": "^0.5.21",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.3"
  }
}
EOF

echo "✅ Root config files created"

# ============================================================
# DOCKER FILES
# ============================================================

echo "📝 Creating Docker files..."

# ---------- docker-compose.yml ----------
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: ielts_postgres
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: ielts_user
      POSTGRES_PASSWORD: ielts_password
      POSTGRES_DB: ielts_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ielts_user -d ielts_db']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: ielts_redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
EOF

# ---------- docker-compose.prod.yml ----------
cat > docker-compose.prod.yml << 'DCEOF'
version: '3.8'

services:
  caddy:
    image: caddy:2-alpine
    container_name: ielts_caddy
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./docker/Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      api:
        condition: service_healthy

  api:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: ielts_api
    restart: unless-stopped
    expose:
      - '3000'
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  worker:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: ielts_worker
    restart: unless-stopped
    command: node dist/worker.js
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    container_name: ielts_postgres
    restart: unless-stopped
    expose:
      - '5432'
    environment:
      POSTGRES_USER: ${DB_USER:-ielts_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-ielts_password}
      POSTGRES_DB: ${DB_NAME:-ielts_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER:-ielts_user} -d ${DB_NAME:-ielts_db}']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: ielts_redis
    restart: unless-stopped
    expose:
      - '6379'
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: ielts_monitor
    restart: unless-stopped
    expose:
      - '3001'
    volumes:
      - uptime_kuma_data:/app/data

volumes:
  postgres_data:
  redis_data:
  caddy_data:
  caddy_config:
  uptime_kuma_data:
DCEOF

# ---------- docker/Dockerfile ----------
cat > docker/Dockerfile << 'EOF'
# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

RUN apk add --no-cache curl

WORKDIR /app

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
EOF

# ---------- docker/Caddyfile ----------
cat > docker/Caddyfile << 'EOF'
api.yourdomain.com {
    reverse_proxy api:3000

    header {
        -Server
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Referrer-Policy strict-origin-when-cross-origin
    }

    log {
        output file /var/log/caddy/api-access.log
        format json
    }
}

monitor.yourdomain.com {
    reverse_proxy uptime-kuma:3001
}
EOF

echo "✅ Docker files created"

# ============================================================
# PRISMA SCHEMA
# ============================================================

echo "📝 Creating Prisma schema..."

cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

enum BookCategory {
  READING
  WRITING
  LISTENING
  SPEAKING
  GENERAL
  VOCABULARY
  GRAMMAR
}

enum QuestionType {
  MCQ
  TRUE_FALSE
  FILL_BLANK
  SHORT_ANSWER
  MATCHING
  DIAGRAM_LABEL
}

enum SubscriptionType {
  PER_BOOK
  ALL_ACCESS
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PAUSED
  PENDING
}

enum PaymentStatus {
  CREATED
  AUTHORIZED
  CAPTURED
  FAILED
  REFUNDED
}

model User {
  id            String    @id @default(uuid()) @db.Uuid
  email         String    @unique
  passwordHash  String    @map("password_hash")
  firstName     String    @map("first_name")
  lastName      String?   @map("last_name")
  phone         String?
  role          UserRole  @default(USER)
  isActive      Boolean   @default(true) @map("is_active")
  emailVerified Boolean   @default(false) @map("email_verified")
  lastLoginAt   DateTime? @map("last_login_at")

  refreshTokens  RefreshToken[]
  subscriptions  UserSubscription[]
  payments       Payment[]
  progress       UserProgress[]
  passwordResets PasswordReset[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([email])
  @@index([role, isActive])
  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid()) @db.Uuid
  token     String   @unique
  userId    String   @map("user_id") @db.Uuid
  family    String   @default(uuid())
  isRevoked Boolean  @default(false) @map("is_revoked")
  expiresAt DateTime @map("expires_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")

  @@index([token])
  @@index([userId])
  @@index([family])
  @@map("refresh_tokens")
}

model PasswordReset {
  id        String   @id @default(uuid()) @db.Uuid
  token     String   @unique
  userId    String   @map("user_id") @db.Uuid
  isUsed    Boolean  @default(false) @map("is_used")
  expiresAt DateTime @map("expires_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")

  @@index([token])
  @@map("password_resets")
}

model Book {
  id           String       @id @default(uuid()) @db.Uuid
  title        String
  description  String?      @db.Text
  category     BookCategory
  s3Key        String       @map("s3_key")
  thumbnailUrl String?      @map("thumbnail_url")
  totalPages   Int          @default(0) @map("total_pages")
  price        Decimal      @default(0) @db.Decimal(10, 2)
  isActive     Boolean      @default(true) @map("is_active")
  sortOrder    Int          @default(0) @map("sort_order")

  questions     Question[]
  subscriptions UserSubscription[]
  progress      UserProgress[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([category, isActive])
  @@index([isActive, sortOrder])
  @@map("books")
}

model Question {
  id            String       @id @default(uuid()) @db.Uuid
  bookId        String       @map("book_id") @db.Uuid
  section       String?
  pageReference Int?         @map("page_reference")
  questionText  String       @map("question_text") @db.Text
  questionType  QuestionType @map("question_type")
  options       Json?
  correctAnswer String       @map("correct_answer") @db.Text
  explanation   String?      @db.Text
  orderIndex    Int          @default(0) @map("order_index")
  isActive      Boolean      @default(true) @map("is_active")

  book Book @relation(fields: [bookId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([bookId, orderIndex])
  @@index([bookId, isActive])
  @@map("questions")
}

model SubscriptionPlan {
  id             String           @id @default(uuid()) @db.Uuid
  name           String
  description    String?
  type           SubscriptionType
  durationDays   Int              @map("duration_days")
  price          Decimal          @db.Decimal(10, 2)
  razorpayPlanId String?          @map("razorpay_plan_id")
  isActive       Boolean          @default(true) @map("is_active")
  features       Json?

  subscriptions UserSubscription[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([type, isActive])
  @@map("subscription_plans")
}

model UserSubscription {
  id                     String             @id @default(uuid()) @db.Uuid
  userId                 String             @map("user_id") @db.Uuid
  planId                 String             @map("plan_id") @db.Uuid
  bookId                 String?            @map("book_id") @db.Uuid
  status                 SubscriptionStatus @default(PENDING)
  startsAt               DateTime           @map("starts_at")
  expiresAt              DateTime           @map("expires_at")
  razorpaySubscriptionId String?            @map("razorpay_subscription_id")
  razorpayPaymentId      String?            @map("razorpay_payment_id")
  autoRenew              Boolean            @default(false) @map("auto_renew")
  cancelledAt            DateTime?          @map("cancelled_at")
  cancelReason           String?            @map("cancel_reason")

  user     User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan     SubscriptionPlan @relation(fields: [planId], references: [id])
  book     Book?            @relation(fields: [bookId], references: [id])
  payments Payment[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([userId, status])
  @@index([userId, bookId, status])
  @@index([userId, status, expiresAt])
  @@index([expiresAt, status])
  @@map("user_subscriptions")
}

model Payment {
  id                String        @id @default(uuid()) @db.Uuid
  userId            String        @map("user_id") @db.Uuid
  subscriptionId    String?       @map("subscription_id") @db.Uuid
  razorpayOrderId   String?       @unique @map("razorpay_order_id")
  razorpayPaymentId String?       @unique @map("razorpay_payment_id")
  razorpaySignature String?       @map("razorpay_signature")
  amount            Decimal       @db.Decimal(10, 2)
  currency          String        @default("INR")
  status            PaymentStatus @default(CREATED)
  webhookPayload    Json?         @map("webhook_payload")
  notes             String?

  user         User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  subscription UserSubscription? @relation(fields: [subscriptionId], references: [id])

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([razorpayOrderId])
  @@index([razorpayPaymentId])
  @@index([userId, status])
  @@map("payments")
}

model UserProgress {
  id                 String @id @default(uuid()) @db.Uuid
  userId             String @map("user_id") @db.Uuid
  bookId             String @map("book_id") @db.Uuid
  lastPageViewed     Int    @default(1) @map("last_page_viewed")
  questionsAttempted Int    @default(0) @map("questions_attempted")
  correctAnswers     Int    @default(0) @map("correct_answers")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  book Book @relation(fields: [bookId], references: [id], onDelete: Cascade)

  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([userId, bookId])
  @@map("user_progress")
}

model WebhookEvent {
  id        String   @id @default(uuid()) @db.Uuid
  eventId   String   @unique @map("event_id")
  eventType String   @map("event_type")
  payload   Json
  processed Boolean  @default(false)
  attempts  Int      @default(0)
  error     String?  @db.Text

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([eventId])
  @@index([processed, createdAt])
  @@map("webhook_events")
}

model AuditLog {
  id        String  @id @default(uuid()) @db.Uuid
  userId    String  @map("user_id") @db.Uuid
  action    String
  entity    String
  entityId  String  @map("entity_id")
  oldValue  Json?   @map("old_value")
  newValue  Json?   @map("new_value")
  ipAddress String? @map("ip_address")

  createdAt DateTime @default(now()) @map("created_at")

  @@index([userId, createdAt])
  @@index([entity, entityId])
  @@map("audit_logs")
}
EOF

echo "✅ Prisma schema created"

# ============================================================
# PRISMA SEED
# ============================================================

cat > prisma/seed.ts << 'EOF'
import { PrismaClient, UserRole, SubscriptionType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@yourdomain.com';
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123456';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        emailVerified: true,
      },
    });
    console.log(`✅ Super admin created: ${adminEmail}`);
  } else {
    console.log(`⏭️  Super admin already exists: ${adminEmail}`);
  }

  const plans = [
    {
      name: 'Single Book Access',
      description: 'Get access to one book of your choice',
      type: SubscriptionType.PER_BOOK,
      durationDays: 365,
      price: 299,
      features: { accessType: 'single_book', pdfAccess: true, questionsAccess: true },
    },
    {
      name: 'All Access Monthly',
      description: 'Unlimited access to all books for one month',
      type: SubscriptionType.ALL_ACCESS,
      durationDays: 30,
      price: 599,
      features: { accessType: 'all_books', pdfAccess: true, questionsAccess: true },
    },
    {
      name: 'All Access Yearly',
      description: 'Unlimited access to all books for one year',
      type: SubscriptionType.ALL_ACCESS,
      durationDays: 365,
      price: 4999,
      features: { accessType: 'all_books', pdfAccess: true, questionsAccess: true, priority_support: true },
    },
  ];

  for (const plan of plans) {
    const existing = await prisma.subscriptionPlan.findFirst({
      where: { name: plan.name },
    });
    if (!existing) {
      await prisma.subscriptionPlan.create({ data: plan });
      console.log(`✅ Plan created: ${plan.name}`);
    } else {
      console.log(`⏭️  Plan already exists: ${plan.name}`);
    }
  }

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

echo "✅ Prisma seed created"

# ============================================================
# SRC — CONFIG FILES
# ============================================================

echo "📝 Creating config files..."

cat > src/config/app.config.ts << 'EOF'
import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
}));
EOF

cat > src/config/jwt.config.ts << 'EOF'
import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
EOF

cat > src/config/redis.config.ts << 'EOF'
import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
}));
EOF

cat > src/config/s3.config.ts << 'EOF'
import { registerAs } from '@nestjs/config';

export const s3Config = registerAs('s3', () => ({
  region: process.env.AWS_REGION || 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.AWS_S3_BUCKET_NAME,
  publicBucket: process.env.AWS_S3_PUBLIC_BUCKET,
}));
EOF

cat > src/config/razorpay.config.ts << 'EOF'
import { registerAs } from '@nestjs/config';

export const razorpayConfig = registerAs('razorpay', () => ({
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
}));
EOF

cat > src/config/index.ts << 'EOF'
export { appConfig } from './app.config';
export { jwtConfig } from './jwt.config';
export { redisConfig } from './redis.config';
export { s3Config } from './s3.config';
export { razorpayConfig } from './razorpay.config';
EOF

echo "✅ Config files created"

# ============================================================
# SRC — COMMON (Constants, Interfaces, DTOs)
# ============================================================

echo "📝 Creating common files..."

cat > src/common/constants/roles.constant.ts << 'EOF'
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}
EOF

cat > src/common/constants/error-messages.constant.ts << 'EOF'
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  USER_NOT_FOUND: 'User not found',
  USER_INACTIVE: 'Your account has been deactivated. Contact support.',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  TOKEN_REVOKED: 'This token has been revoked. Please login again.',
  TOKEN_FAMILY_COMPROMISED: 'Security alert: All sessions have been terminated. Please login again.',
  PASSWORD_RESET_EXPIRED: 'Password reset link has expired',
  PASSWORD_RESET_USED: 'This password reset link has already been used',
  NO_ACTIVE_SUBSCRIPTION: 'You do not have an active subscription for this content',
  SUBSCRIPTION_EXPIRED: 'Your subscription has expired. Please renew.',
  BOOK_NOT_FOUND: 'Book not found',
  PAGE_NOT_FOUND: 'Requested page does not exist',
  PAYMENT_VERIFICATION_FAILED: 'Payment verification failed',
  ORDER_CREATION_FAILED: 'Failed to create payment order',
  FORBIDDEN: 'You do not have permission to perform this action',
  INTERNAL_ERROR: 'Something went wrong. Please try again later.',
};
EOF

cat > src/common/interfaces/jwt-payload.interface.ts << 'EOF'
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload extends JwtPayload {
  tokenFamily: string;
}
EOF

cat > src/common/interfaces/api-response.interface.ts << 'EOF'
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
EOF

cat > src/common/dto/pagination.dto.ts << 'EOF'
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
EOF

echo "✅ Common files created"

# ============================================================
# SRC — DECORATORS
# ============================================================

echo "📝 Creating decorators..."

cat > src/common/decorators/current-user.decorator.ts << 'EOF'
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (data) return user?.[data];
    return user;
  },
);
EOF

cat > src/common/decorators/roles.decorator.ts << 'EOF'
import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/roles.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
EOF

cat > src/common/decorators/public.decorator.ts << 'EOF'
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
EOF

cat > src/common/decorators/subscription.decorator.ts << 'EOF'
import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { REQUIRE_SUBSCRIPTION_KEY, SubscriptionGuard } from '../guards/subscription.guard';

export const RequireSubscription = () =>
  applyDecorators(
    SetMetadata(REQUIRE_SUBSCRIPTION_KEY, true),
    UseGuards(SubscriptionGuard),
  );
EOF

echo "✅ Decorators created"

# ============================================================
# SRC — GUARDS
# ============================================================

echo "📝 Creating guards..."

cat > src/common/guards/jwt-auth.guard.ts << 'EOF'
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
EOF

cat > src/common/guards/roles.guard.ts << 'EOF'
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../constants/roles.constant';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);

    return true;
  }
}
EOF

cat > src/common/guards/subscription.guard.ts << 'EOF'
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ModuleRef } from '@nestjs/core';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

export const REQUIRE_SUBSCRIPTION_KEY = 'requireSubscription';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  private readonly logger = new Logger(SubscriptionGuard.name);

  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireSubscription = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_SUBSCRIPTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireSubscription) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.sub) {
      throw new ForbiddenException(ERROR_MESSAGES.NO_ACTIVE_SUBSCRIPTION);
    }

    const bookId = request.params?.id || request.params?.bookId || request.query?.bookId || request.body?.bookId;

    if (!bookId) {
      this.logger.warn('SubscriptionGuard: No bookId found in request');
      throw new ForbiddenException(ERROR_MESSAGES.NO_ACTIVE_SUBSCRIPTION);
    }

    // Dynamically resolve to avoid circular dependency
    const { SubscriptionAccessService } = await import('../../modules/subscriptions/subscription-access.service');
    const accessService = this.moduleRef.get(SubscriptionAccessService, { strict: false });

    const hasAccess = await accessService.canAccessBook(user.sub, bookId);

    if (!hasAccess) {
      throw new ForbiddenException(ERROR_MESSAGES.NO_ACTIVE_SUBSCRIPTION);
    }

    return true;
  }
}
EOF

echo "✅ Guards created"

# ============================================================
# SRC — FILTERS
# ============================================================

echo "📝 Creating filters..."

cat > src/common/filters/http-exception.filter.ts << 'EOF'
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        errors = responseObj.errors || null;
        if (Array.isArray(responseObj.message)) {
          errors = responseObj.message;
          message = 'Validation failed';
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    }

    if (process.env.NODE_ENV === 'production' && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'Something went wrong. Please try again later.';
      errors = null;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
EOF

cat > src/common/filters/prisma-exception.filter.ts << 'EOF'
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        const fields = (exception.meta?.target as string[])?.join(', ');
        message = `A record with this ${fields || 'value'} already exists`;
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid reference: related record does not exist';
        break;
      default:
        this.logger.error(`Prisma error ${exception.code}: ${exception.message}`);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
EOF

echo "✅ Filters created"

# ============================================================
# SRC — INTERCEPTORS
# ============================================================

echo "📝 Creating interceptors..."

cat > src/common/interceptors/response-transform.interceptor.ts << 'EOF'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
EOF

cat > src/common/interceptors/logging.interceptor.ts << 'EOF'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userId = request.user?.sub || 'anonymous';
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - now;
        this.logger.log(`${method} ${url} ${response.statusCode} ${duration}ms - ${userId} - ${ip}`);
      }),
    );
  }
}
EOF

cat > src/common/interceptors/timeout.interceptor.ts << 'EOF'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(30000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
EOF

echo "✅ Interceptors created"

# ============================================================
# SRC — UTILS
# ============================================================

echo "📝 Creating utility files..."

cat > src/utils/hash.util.ts << 'EOF'
import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
EOF

cat > src/utils/token.util.ts << 'EOF'
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export function generateTokenFamily(): string {
  return uuidv4();
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateSecureToken(): string {
  return crypto.randomBytes(48).toString('base64url');
}
EOF

echo "✅ Utility files created"

# ============================================================
# SRC — MODULE PLACEHOLDER FILES
# ============================================================

echo "📝 Creating module placeholder files..."

# Function to create a placeholder TypeScript file
create_placeholder() {
  local filepath=\$1
  local content=\$2
  echo "$content" > "$filepath"
}

# ---------- Prisma Module ----------
create_placeholder "src/modules/prisma/prisma.service.ts" \
"import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });
  }

  async onModuleInit() {
    await this.\$connect();
    this.logger.log('Database connection established');
  }

  async onModuleDestroy() {
    await this.\$disconnect();
    this.logger.log('Database connection closed');
  }
}"

create_placeholder "src/modules/prisma/prisma.module.ts" \
"import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}"

# ---------- Redis Module ----------
create_placeholder "src/modules/redis/redis.service.ts" \
"// Redis service — see Phase 1 File 31 for full implementation
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('redis.host'),
      port: this.configService.get('redis.port'),
      password: this.configService.get('redis.password'),
      db: this.configService.get('redis.db'),
    });
    this.client.on('connect', () => this.logger.log('Redis connected'));
    this.client.on('error', (err) => this.logger.error('Redis error', err.message));
  }

  getClient(): Redis { return this.client; }
  async get(key: string): Promise<string | null> { return this.client.get(key); }
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) { await this.client.setex(key, ttlSeconds, value); }
    else { await this.client.set(key, value); }
  }
  async del(key: string): Promise<void> { await this.client.del(key); }
  async delPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) await this.client.del(...keys);
  }
  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    try { return JSON.parse(data) as T; } catch { return null; }
  }
  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) { await this.client.setex(key, ttlSeconds, serialized); }
    else { await this.client.set(key, serialized); }
  }
  async exists(key: string): Promise<boolean> { return (await this.client.exists(key)) === 1; }
  async onModuleDestroy() { await this.client.quit(); }
}"

create_placeholder "src/modules/redis/redis.module.ts" \
"import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}"

# ---------- S3 Module ----------
create_placeholder "src/modules/s3/s3.service.ts" \
"// S3 service — see Phase 1 File 33 for full implementation
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucketName: string;
  private readonly publicBucket: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.get('s3.region'),
      credentials: {
        accessKeyId: this.configService.get('s3.accessKeyId'),
        secretAccessKey: this.configService.get('s3.secretAccessKey'),
      },
    });
    this.bucketName = this.configService.get('s3.bucketName');
    this.publicBucket = this.configService.get('s3.publicBucket');
  }

  // TODO: Copy full implementation from Phase 1 File 33
  async uploadPrivate(key: string, body: Buffer | Readable, contentType: string): Promise<string> {
    await this.client.send(new PutObjectCommand({ Bucket: this.bucketName, Key: key, Body: body, ContentType: contentType }));
    return key;
  }
  async uploadPublic(key: string, body: Buffer | Readable, contentType: string): Promise<string> {
    await this.client.send(new PutObjectCommand({ Bucket: this.publicBucket, Key: key, Body: body, ContentType: contentType }));
    return \`https://\${this.publicBucket}.s3.\${this.configService.get('s3.region')}.amazonaws.com/\${key}\`;
  }
  async getFileBuffer(key: string): Promise<Buffer> {
    const response = await this.client.send(new GetObjectCommand({ Bucket: this.bucketName, Key: key }));
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
  async deleteFile(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
  }
  async getSignedUrl(key: string, expiresInSeconds = 300): Promise<string> {
    return getSignedUrl(this.client, new GetObjectCommand({ Bucket: this.bucketName, Key: key }), { expiresIn: expiresInSeconds });
  }
}"

create_placeholder "src/modules/s3/s3.module.ts" \
"import { Global, Module } from '@nestjs/common';
import { S3Service } from './s3.service';

@Global()
@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}"

echo "✅ Infrastructure modules created"

# ============================================================
# MODULE STUBS — Auth, Users, Books, Questions, etc.
# ============================================================

echo "📝 Creating module stubs..."

# Auth DTOs
touch src/modules/auth/dto/register.dto.ts
touch src/modules/auth/dto/login.dto.ts
touch src/modules/auth/dto/forgot-password.dto.ts
touch src/modules/auth/dto/reset-password.dto.ts

# Auth files
touch src/modules/auth/auth.module.ts
touch src/modules/auth/auth.controller.ts
touch src/modules/auth/auth.service.ts
touch src/modules/auth/strategies/jwt.strategy.ts
touch src/modules/auth/strategies/jwt-refresh.strategy.ts

# Users
touch src/modules/users/users.module.ts
touch src/modules/users/users.controller.ts
touch src/modules/users/users.service.ts
touch src/modules/users/dto/update-user.dto.ts
touch src/modules/users/dto/user-response.dto.ts

# Books
touch src/modules/books/books.module.ts
touch src/modules/books/books.controller.ts
touch src/modules/books/books.service.ts
touch src/modules/books/pdf-renderer.service.ts
touch src/modules/books/dto/create-book.dto.ts
touch src/modules/books/dto/update-book.dto.ts
touch src/modules/books/dto/book-query.dto.ts
touch src/modules/books/dto/book-response.dto.ts

# Questions
touch src/modules/questions/questions.module.ts
touch src/modules/questions/questions.controller.ts
touch src/modules/questions/questions.service.ts
touch src/modules/questions/dto/create-question.dto.ts
touch src/modules/questions/dto/update-question.dto.ts
touch src/modules/questions/dto/bulk-import-question.dto.ts
touch src/modules/questions/dto/submit-answer.dto.ts
touch src/modules/questions/dto/question-query.dto.ts

# Content
touch src/modules/content/content.module.ts
touch src/modules/content/content.controller.ts
touch src/modules/content/content.service.ts

# Subscriptions
touch src/modules/subscriptions/subscriptions.module.ts
touch src/modules/subscriptions/subscriptions.controller.ts
touch src/modules/subsc
touch src/modules/subscriptions/subscriptions.service.ts
touch src/modules/subscriptions/subscription-access.service.ts
touch src/modules/subscriptions/subscription-cron.service.ts
touch src/modules/subscriptions/dto/create-subscription.dto.ts
touch src/modules/subscriptions/dto/subscription-query.dto.ts

# Payments
touch src/modules/payments/payments.module.ts
touch src/modules/payments/payments.controller.ts
touch src/modules/payments/payments.service.ts
touch src/modules/payments/razorpay.service.ts
touch src/modules/payments/dto/create-order.dto.ts
touch src/modules/payments/dto/verify-payment.dto.ts
touch src/modules/payments/dto/payment-query.dto.ts

# Webhooks
touch src/modules/webhooks/webhooks.module.ts
touch src/modules/webhooks/webhooks.controller.ts
touch src/modules/webhooks/webhooks.service.ts

# Admin
touch src/modules/admin/admin.module.ts
touch src/modules/admin/controllers/admin-dashboard.controller.ts
touch src/modules/admin/controllers/admin-users.controller.ts
touch src/modules/admin/controllers/admin-books.controller.ts
touch src/modules/admin/controllers/admin-questions.controller.ts
touch src/modules/admin/controllers/admin-subscriptions.controller.ts
touch src/modules/admin/services/admin-dashboard.service.ts
touch src/modules/admin/services/admin-users.service.ts
touch src/modules/admin/services/admin-subscriptions.service.ts
touch src/modules/admin/dto/admin-user-query.dto.ts
touch src/modules/admin/dto/admin-update-user.dto.ts
touch src/modules/admin/dto/admin-grant-subscription.dto.ts
touch src/modules/admin/dto/admin-dashboard-query.dto.ts

# Pipes
touch src/common/pipes/parse-uuid.pipe.ts

echo "✅ All module stubs created"

# ============================================================
# MAIN ENTRY POINTS
# ============================================================

echo "📝 Creating main entry points..."

cat > src/main.ts << 'EOF'
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get('app.apiPrefix') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  const allowedOrigins = configService.get('app.allowedOrigins') || [];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.match(/^https:\/\/.*\.vercel\.app$/)) return callback(null, true);
      logger.warn(`Blocked CORS request from: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['set-cookie'],
    maxAge: 86400,
  });

  // Security
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cookieParser());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: false,
    }),
  );

  // Swagger
  if (configService.get('app.nodeEnv') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('IELTS Platform API')
      .setDescription('Backend API for IELTS exam preparation platform')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('refresh_token')
      .addServer(`http://localhost:${configService.get('app.port')}`, 'Local')
      .addServer('https://api.yourdomain.com', 'Production')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha', operationsSorter: 'method' },
    });
    logger.log(`Swagger docs: http://localhost:${configService.get('app.port')}/docs`);
  }

  // Health check
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
  });

  // Start
  const port = configService.get('app.port') || 3000;
  await app.listen(port);
  logger.log(`🚀 Application running on: http://localhost:${port}`);
  logger.log(`📋 API prefix: ${apiPrefix}`);
  logger.log(`🌍 Environment: ${configService.get('app.nodeEnv')}`);
}

bootstrap();
EOF

cat > src/app.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import { appConfig, jwtConfig, redisConfig, s3Config, razorpayConfig } from './config';

import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { S3Module } from './modules/s3/s3.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { ContentModule } from './modules/content/content.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { AdminModule } from './modules/admin/admin.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, redisConfig, s3Config, razorpayConfig],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 60 },
    ]),
    ScheduleModule.forRoot(),

    // Global
    PrismaModule,
    RedisModule,
    S3Module,

    // Phase 1
    AuthModule,
    UsersModule,

    // Phase 2
    BooksModule,
    QuestionsModule,
    ContentModule,

    // Phase 3
    SubscriptionsModule,
    PaymentsModule,
    WebhooksModule,

    // Phase 4
    AdminModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
  ],
})
export class AppModule {}
EOF

echo "✅ Main entry points created"

# ============================================================
# TEST CONFIG
# ============================================================

echo "📝 Creating test configuration..."

cat > test/jest-e2e.json << 'EOF'
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
EOF

cat > test/app.e2e-spec.ts << 'EOF'
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
EOF

echo "✅ Test configuration created"

# ============================================================
# README
# ============================================================

echo "📝 Creating README..."

cat > README.md << 'READMEEOF'
# IELTS Exam Platform — Backend

Production-grade NestJS backend for an IELTS preparation platform with subscription-based access to protected PDFs and Q&A content.

## Tech Stack

- **Runtime:** Node.js 20 LTS
- **Framework:** NestJS
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **ORM:** Prisma
- **Storage:** AWS S3
- **Payments:** Razorpay
- **Auth:** JWT with refresh token rotation

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL & Redis
npm run docker:dev

# 3. Generate Prisma client
npm run prisma:generate

# 4. Run migrations
npm run prisma:migrate:dev

# 5. Seed database
npm run prisma:seed

# 6. Start development server
npm run start:dev

# 7. Open Swagger docs
# http://localhost:3000/docs

# 8. Health check
# http://localhost:3000/health
