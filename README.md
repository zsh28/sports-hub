# Sportshub

A decentralized sports betting platform built on Solana that seamlessly integrates live football fixtures from the Fantasy Premier League API with on‑chain transactions. Sportshub uses Prisma for persistent database storage of events, bets, and claims while protecting owner-only functionalities for event management.

---

## Features

- **On‑Chain Sports Betting:**  
  Create, resolve, delete, and claim rewards for sports events on the Solana blockchain.
  
- **External Fixture Integration:**  
  Fetch live fixtures from the Fantasy Premier League API and display upcoming matches.
  
- **Database Persistence:**  
  Persist on‑chain events, bets, and claims using Prisma and a PostgreSQL database.
  
- **Protected Owner Functionalities:**  
  Certain features (such as creating events on-chain, resolving, deleting, and claiming rewards) are restricted to the owner (controlled via an environment variable).

---

Below is an example Tech Stack section for your README. You can paste and adjust it as needed:

---

## Tech Stack

**Frontend:**
- **Next.js v14.2.5:** A React framework for server-side rendering and static site generation.
- **React v18:** The latest version of the React library for building interactive UIs.
- **Tailwind CSS v3.4.1 & DaisyUI:** Utility-first CSS framework with DaisyUI components for rapid UI development.
- **TanStack React Query v5:** Powerful data-fetching, caching, and synchronization tool.
- **React Hot Toast:** For in-app notifications and alerts.
- **@tabler/icons-react:** A set of high-quality SVG icons for your UI.

**Blockchain:**
- **@solana/web3.js:** JavaScript API to interact with the Solana blockchain.
- **@solana/wallet-adapter-react & @solana/wallet-adapter-react-ui:** For connecting and interacting with Solana wallets.
- **@solana/spl-token:** Library for managing SPL tokens.
- **@coral-xyz/anchor:** A framework for developing on Solana with Anchor’s simplified APIs.

**Database & API:**
- **Prisma v6.5.0:** Modern ORM for interacting with your PostgreSQL database.
- **Axios:** Promise-based HTTP client for fetching external API data.
- **PostgreSQL:** Your database, configured via the environment variable `DATABASE_URL`.

**Utilities & Other:**
- **Jotai:** A minimalistic state management library.
- **Zod:** TypeScript-first schema declaration and validation library.
- **ESLint & Jest:** For code linting and testing.
- **Environment Variables Management:** Handled via `@t3-oss/env-nextjs` for secure and seamless environment variable integration.

---

## Prerequisites

- **Node.js:** v18.18.0 or higher
- **Solana CLI:** Installed and configured for your network (e.g., devnet)
- **Database:** PostgreSQL (or your chosen provider supported by Prisma)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/solana-developers/sportshub.git
cd sportshub
```

### 2. Install Dependencies

Use your preferred package manager (we recommend pnpm):

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and define the following variables:

```env
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXT_PUBLIC_OWNER_PUBLIC_KEY=YourOwnerWalletPublicKeyHere
```

Make sure to replace the placeholders with your actual values.

### 4. Run Prisma Migrations

Generate and run the Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev --name init
```

---

## Running the Application

### Start the Development Server

```bash
pnpm dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see Sportshub in action.

### Build for Production

To build the application for production, run:

```bash
pnpm build
```

And to start the production server:

```bash
pnpm start
```

---

## Application Structure

### API Endpoints

- **External Fixtures:**  
  - Endpoint: `/api/fplFixtures`  
  - Fetches live fixtures from the Fantasy Premier League API.

- **Database Events:**  
  - Endpoint: `/api/dbFplEvents`  
  - Handles CRUD operations for on‑chain events stored in the database.

- **Bets:**  
  - Endpoint: `/api/bets`  
  - Logs bet placements.

- **Claims:**  
  - Endpoint: `/api/claims`  
  - Logs reward claims.

### Custom Hooks

- **useFplFixtures:**  
  Fetches external fixture data.

- **useDatabaseEvents:**  
  Retrieves on‑chain events stored in your database.

- **useCreateEvent, usePlaceBet, useResolveEvent, useClaimReward, useDeleteEvent:**  
  Wrap the on‑chain transactions and persist data via the corresponding API endpoints.

### Frontend (Dashboard)

- The dashboard component renders two main sections:
  1. **FPL Fixtures (External):**  
     Displays upcoming matches with an inline option (available only to the owner) to create events on‑chain.
  
  2. **Database Events:**  
     Displays events stored in the database along with an inline form to place bets directly on each game. Owner-only functionalities (resolve, claim, delete) are also provided here.

- **Owner Protection:**  
  The application checks if the connected wallet’s public key matches `NEXT_PUBLIC_OWNER_PUBLIC_KEY`. If so, it renders owner‑only controls; otherwise, these functionalities remain hidden.

---