# 🏆 Sportshub

A **decentralized sports betting platform** built on Solana that seamlessly integrates live football fixtures from the **Fantasy Premier League API** with **on-chain transactions**. Sportshub utilizes **Prisma** for persistent database storage of events, bets, and claims while ensuring owner-only functionalities for event management.

---

## 📜 Smart Contract Information

You can find the **Smart Contract code and address** below:

🔗 **Repository:** [Sports Hub Smart Contract](https://github.com/zsh28/solana-builders-q3-2024/tree/master/capstone/sports-hub)  
📝 **Smart Contract Address:** `DxbcyaGtfDoVJwYEu6XTRScs66EJwZ9QgaBrviycGSfV`

---

## ✨ Features

✅ **On‑Chain Sports Betting:**  
Create, resolve, delete, and claim rewards for sports events on the **Solana blockchain**.

✅ **External Fixture Integration:**  
Fetch live fixtures from the **Fantasy Premier League API** and display upcoming matches.

✅ **Database Persistence:**  
Store on‑chain events, bets, and claims using **Prisma** and a **PostgreSQL database**.

✅ **Protected Owner Functionalities:**  
Certain features (*creating events on-chain, resolving, deleting, and claiming rewards*) are **restricted** to the owner (controlled via an **environment variable**).

---

## 🛠 Tech Stack

### **Frontend:**
- ⚡ **Next.js** – Server-side rendering & static site generation.
- ⚛️ **React** – Interactive UI development.
- 🎨 **Tailwind CSS & DaisyUI** – Utility-first styling & prebuilt components.
- 🔄 **TanStack React Query** – Optimized data fetching & caching.
- 🔔 **React Hot Toast** – Real-time notifications.
- 🎨 **@tabler/icons-react** – High-quality SVG icons.

### **Blockchain:**
- 🔗 **@solana/web3.js** – Solana blockchain interaction.
- 👛 **@solana/wallet-adapter-react** – Solana wallet integration.
- 🎰 **@solana/spl-token** – SPL token management.
- 🔧 **@coral-xyz/anchor** – Simplified smart contract development on Solana.

### **Database & API:**
- 🏦 **Prisma** – Type-safe ORM for database interactions.
- 🌐 **Axios** – HTTP client for API requests.
- 🗄 **PostgreSQL** – Database storage.

### **Utilities & Other:**
- ⚡ **Jotai** – State management.
- 🔍 **Zod** – TypeScript-first schema validation.
- ✅ **ESLint & Jest** – Code linting & testing.
- 🔐 **Environment Management** – Handled via `@t3-oss/env-nextjs`.

---

## 🚀 Getting Started

### **Prerequisites**
- 📦 **Node.js**: v18.18.0 or higher
- 💰 **Solana CLI**: Installed & configured
- 🏦 **Database**: PostgreSQL (or Prisma-supported provider)

### **Installation Steps**

#### 1️⃣ Clone the Repository
```sh
 git clone https://github.com/solana-developers/sportshub.git
 cd sportshub
```

#### 2️⃣ Install Dependencies
```sh
 pnpm install
```

#### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
 NODE_ENV=development
 DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
 NEXT_PUBLIC_OWNER_PUBLIC_KEY=YourOwnerWalletPublicKeyHere
```
Replace placeholders with actual values.

#### 4️⃣ Run Prisma Migrations
```sh
 npx prisma migrate dev --name init
```

#### 5️⃣ Start Development Server
```sh
 pnpm dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

#### 🏗 Build for Production
```sh
 pnpm build
```

#### 🚀 Start Production Server
```sh
 pnpm start
```

---

## 🏗 Application Structure

### **📡 API Endpoints**
- **External Fixtures:** `/api/fplFixtures` → Fetch live fixtures.
- **Database Events:** `/api/dbFplEvents` → Manage on‑chain events.
- **Bets:** `/api/bets` → Log bet placements.
- **Claims:** `/api/claims` → Log reward claims.

### **📌 Custom Hooks**
- `useFplFixtures` → Fetches external fixture data.
- `useDatabaseEvents` → Retrieves on‑chain event data.
- `useCreateEvent`, `usePlaceBet`, `useResolveEvent`, `useClaimReward`, `useDeleteEvent` → Wrap on‑chain transactions & persist data via API.

### **🖥 Frontend Dashboard**
The dashboard consists of:
1️⃣ **FPL Fixtures (External)** – Displays upcoming matches with admin-only on-chain event creation.
2️⃣ **Database Events** – Displays on-chain events with options to place bets, resolve, delete, and claim rewards.

**🔐 Owner-Only Protection:**
The app checks the wallet's public key against `NEXT_PUBLIC_OWNER_PUBLIC_KEY` to grant access to restricted functionalities.

---