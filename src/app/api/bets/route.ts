import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

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
