-- CreateTable
CREATE TABLE "FplEvent" (
    "id" INTEGER NOT NULL,
    "kickoff" INTEGER NOT NULL,
    "teamA" TEXT NOT NULL,
    "teamB" TEXT NOT NULL,
    "tx" TEXT,
    "resolvedOutcome" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FplEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "wallet" TEXT NOT NULL,
    "outcome" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tx" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "wallet" TEXT NOT NULL,
    "tx" TEXT,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FplEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FplEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
