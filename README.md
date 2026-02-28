# 🍔 BeenBite — SaaS Reward Management Platform

A **scalable, production-ready, microservice-based SaaS reward management platform** built with Node.js, TypeScript, React, and PostgreSQL. Companies subscribe to plans, customize their UI, manage rewards, manage users, push offers, and access customer details based on their plan. A Super Admin controls the ecosystem.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)                │
│              TailwindCSS + Framer Motion                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                    API Gateway (:3000)                    │
│          Auth Middleware • Rate Limiting • Proxy          │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬─────┘
   │      │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
┌─────┐┌─────┐┌─────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
│Auth ││User ││Comp-││Subsc-││Paym- ││Rewar-││Maste-││Notif-│
│Svc  ││Svc  ││any  ││riptn ││ent   ││d Svc ││r Data││icatn │
│:3001││:3002││:3003││:3004 ││:3005 ││:3006 ││:3007 ││:3008 │
└──┬──┘└──┬──┘└──┬──┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘
   │      │      │      │       │       │       │       │
   ▼      ▼      ▼      ▼       ▼       ▼       ▼       ▼
┌──────────────────────────────────────────────────────────┐
│  PostgreSQL (multi-db) │ Redis (cache) │ RabbitMQ (events)│
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
beenbite/
├── packages/
│   └── shared/                 # Shared types, DTOs, errors, utils
│       └── src/
│           ├── errors/         # AppError + typed error classes
│           ├── responses/      # ResponseBuilder (success/error/paginated)
│           ├── types/          # Enums, interfaces, plan pricing
│           ├── dtos/           # Zod validation schemas
│           ├── utils/          # Logger (winston), helpers
│           └── constants/      # Plan limits, tier thresholds
├── services/
│   ├── api-gateway/            # Express proxy + auth + rate limiting
│   ├── auth-service/           # JWT auth, refresh tokens, bcrypt
│   ├── user-service/           # Profiles, points, tiers, badges, leaderboard
│   ├── company-service/        # Company CRUD, themes, products, categories
│   ├── subscription-service/   # Plans, trials, feature flags
│   ├── payment-service/        # Stripe + Razorpay (Strategy Pattern)
│   ├── reward-service/         # Rewards, redemptions, dynamic coupons
│   ├── master-data-service/    # Industries, templates, configs, FAQs
│   └── notification-service/   # Email, WhatsApp, Push (Strategy + RabbitMQ)
├── frontend/                   # React + Vite + TailwindCSS
│   └── src/
│       ├── components/         # ProtectedRoute, Modal, DataTable, Skeleton
│       ├── context/            # AuthContext, ThemeContext
│       ├── layouts/            # AdminLayout, SuperAdminLayout
│       ├── pages/
│       │   ├── auth/           # Login, Register, ForgotPassword
│       │   ├── admin/          # Dashboard, Users, Rewards, Products, Categories, Theme, Settings
│       │   └── super-admin/    # Dashboard, Companies, Subscriptions, Analytics, MasterData
│       └── services/           # Axios API client with interceptors
├── docker-compose.yml
├── package.json                # Monorepo workspace config
└── tsconfig.base.json
```

---

## 🛠️ Tech Stack

| Layer          | Technology                                                  |
| -------------- | ----------------------------------------------------------- |
| **Frontend**   | React 18, Vite, TailwindCSS, Framer Motion, Recharts       |
| **Backend**    | Node.js, TypeScript, Express                                |
| **ORM**        | Prisma                                                      |
| **Database**   | PostgreSQL (one DB per service)                             |
| **Cache**      | Redis                                                       |
| **Queue**      | RabbitMQ                                                    |
| **Auth**       | JWT (access + refresh tokens), bcrypt                       |
| **Payments**   | Stripe + Razorpay (Strategy Pattern)                        |
| **Validation** | Zod                                                         |
| **Logging**    | Winston                                                     |
| **Container**  | Docker + docker-compose                                     |
| **Icons**      | Lucide React                                                |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/your-org/beenbite.git
cd beenbite
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your database URLs, JWT secrets, Stripe/Razorpay keys
```

### 3. Start Infrastructure

```bash
docker-compose up -d
```

This starts PostgreSQL (with 8 databases auto-created), Redis, and RabbitMQ.

### 4. Run Database Migrations

```bash
# For each service
cd services/auth-service && npx prisma migrate dev
cd ../user-service && npx prisma migrate dev
cd ../company-service && npx prisma migrate dev
cd ../subscription-service && npx prisma migrate dev
cd ../payment-service && npx prisma migrate dev
cd ../reward-service && npx prisma migrate dev
cd ../master-data-service && npx prisma migrate dev
cd ../notification-service && npx prisma migrate dev
```

### 5. Start Services

```bash
# From root — start all services
npm run dev
```

Or individually:

```bash
cd services/api-gateway && npm run dev     # Port 3000
cd services/auth-service && npm run dev    # Port 3001
cd services/user-service && npm run dev    # Port 3002
# ... etc
cd frontend && npm run dev                 # Port 5173
```

---

## 🔐 Authentication & Roles

| Role             | Access                                        |
| ---------------- | --------------------------------------------- |
| `user`           | View rewards, redeem, profile                 |
| `company_admin`  | Full company management, users, rewards       |
| `super_admin`    | Platform-wide control, companies, analytics   |

- **JWT access tokens** (15min expiry)
- **Refresh tokens** (7d expiry, stored in DB)
- **Role-based middleware** on API Gateway

---

## 💰 Subscription Plans

| Plan           | Price       | Max Users | Features                             |
| -------------- | ----------- | --------- | ------------------------------------ |
| **Starter**    | ₹999/mo     | 500       | Basic rewards, email notifications   |
| **Professional** | ₹1,499/mo | 2,000     | + WhatsApp, analytics, custom theme  |
| **Enterprise** | ₹1,999/mo   | Unlimited | + Push, API access, priority support |

14-day free trial on all plans. 18% GST on invoices.

---

## 🎁 Reward Types

| Type       | Strategy                | Description                     |
| ---------- | ----------------------- | ------------------------------- |
| Points     | PointsRewardStrategy    | Earn/spend loyalty points       |
| Discount   | DiscountRewardStrategy  | Percentage off purchases        |
| Cashback   | CashbackRewardStrategy  | Money back to wallet            |
| Freebie    | FreebieRewardStrategy   | Free items after milestones     |
| Coupon     | CouponRewardStrategy    | Dynamic generated coupons       |
| Badge      | BadgeRewardStrategy     | Achievement badges              |

All rewards use the **Strategy Pattern** with eligibility checks (min points, min visits, plan-based feature toggles).

---

## 🏆 Tier System

| Tier      | Points Required | Benefits                  |
| --------- | --------------- | ------------------------- |
| Bronze    | 0               | Basic rewards             |
| Silver    | 500             | + Birthday bonus          |
| Gold      | 1,500           | + Early access, 2x points |
| Platinum  | 5,000           | + VIP rewards, priority   |

---

## 📡 API Endpoints

All requests go through the **API Gateway** at `http://localhost:3000`.

| Service        | Base Path            | Key Endpoints                    |
| -------------- | -------------------- | -------------------------------- |
| Auth           | `/api/auth`          | POST /register, /login, /refresh |
| Users          | `/api/users`         | GET /profile, PATCH /points      |
| Companies      | `/api/companies`     | CRUD + /products + /categories   |
| Subscriptions  | `/api/subscriptions` | GET /plans, POST /subscribe      |
| Payments       | `/api/payments`      | POST /initiate, /verify, /refund |
| Rewards        | `/api/rewards`       | CRUD + /redeem + /coupons        |
| Master Data    | `/api/master`        | /industries, /templates, /faqs   |
| Notifications  | `/api/notifications` | /send, /bulk, /templates         |

---

## 🎨 Frontend Features

- **Landing Page**: Animated hero, features grid, pricing cards, testimonials, CTA
- **Auth Pages**: Login, Register, Forgot Password with animated panels
- **Admin Dashboard**: Stats cards, revenue/user charts (Recharts), activity feed
- **User Management**: Searchable table, tier badges, point tracking
- **Reward Management**: Grid/card view, type filters, create modal with validation
- **Product Catalog**: Grid + List toggle, category filters, stock indicators
- **Category Tree**: Expandable tree with parent/child hierarchy
- **Theme Builder**: Color pickers, font selection, border radius, live preview
- **Settings**: Tabbed (General, Theme, Notifications, Security, Billing)
- **Super Admin**: Platform dashboard, company management with drawer, subscription oversight, analytics charts, master data CRUD
- **Protected Routes**: Role-based route guards
- **Dynamic Theming**: CSS variables via ThemeContext
- **Glassmorphism**: Backdrop blur effects on cards and modals
- **Micro-animations**: Framer Motion on all page transitions, cards, modals

---

## 🐳 Docker Services

```yaml
# docker-compose.yml
services:
  postgres:     # Port 5432 — 8 databases
  redis:        # Port 6379
  rabbitmq:     # Port 5672 (AMQP), 15672 (Management UI)
```

---

## 📐 Design Patterns Used

- **Strategy Pattern**: Payment providers (Stripe/Razorpay), Reward eligibility, Notification providers (Email/WhatsApp/Push)
- **Repository Pattern**: All database access via repository classes
- **Clean Architecture**: Controllers → Services → Repositories → Prisma
- **Dependency Injection**: Services receive repositories via constructors
- **Factory Pattern**: RewardStrategyFactory, NotificationProviderFactory
- **Builder Pattern**: ResponseBuilder for consistent API responses
- **Observer Pattern**: RabbitMQ event-driven notifications

---

## 📄 License

MIT © BeenBite Team
