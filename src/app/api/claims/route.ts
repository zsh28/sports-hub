import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { eventId, wallet, tx } = await request.json();
    const newClaim = await db.claim.create({
      data: { eventId, wallet, tx },
    });
    return NextResponse.json(newClaim, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error claiming reward" }, { status: 500 });
  }
}
