// /src/app/api/bets/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function GET(request: Request) {
  return NextResponse.json({ message: "GET method is not implemented for bets" }, { status: 405 });
}

export async function POST(request: Request) {
  try {
    const { eventId, wallet, outcome, amount, tx } = await request.json();
    const newBet = await db.bet.create({
      data: { eventId, wallet, outcome, amount, tx },
    });
    return NextResponse.json(newBet, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error placing bet" }, { status: 500 });
  }
}
