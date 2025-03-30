import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// GET /api/bets?eventId=123
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId parameter" }, { status: 400 });
  }

  // Convert eventId to a number
  const eventIdNumber = parseInt(eventId, 10);

  if (isNaN(eventIdNumber)) {
    return NextResponse.json({ error: "Invalid eventId parameter" }, { status: 400 });
  }

  try {
    const bets = await db.bet.findMany({
      where: { eventId: eventIdNumber }, // Use the converted number here
      orderBy: { createdAt: "desc" }, // Optional: show latest first
    });
    return NextResponse.json(bets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bets" }, { status: 500 });
  }
}

// POST /api/bets
export async function POST(request: Request) {
  try {
    const { eventId, wallet, outcome, amount, tx } = await request.json();

    if (!eventId || !wallet || outcome === undefined || !amount || !tx) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBet = await db.bet.create({
      data: {
        eventId,
        wallet,
        outcome,
        amount,
        tx,
      },
    });

    return NextResponse.json(newBet, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error placing bet" }, { status: 500 });
  }
}
