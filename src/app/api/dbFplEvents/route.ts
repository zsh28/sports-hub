import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await db.fplEvent.findMany({
      orderBy: { kickoff: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, kickoff, teamA, teamB, tx, publicKey } = await request.json();
    const newEvent = await db.fplEvent.create({
      data: { id, kickoff, teamA, teamB, tx, publicKey },
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating event" }, { status: 500 });
  }
}

async function PUT(request: Request) {
  try {
    const { id, resolvedOutcome } = await request.json();
    const updatedEvent = await db.fplEvent.update({
      where: { id },
      data: { resolvedOutcome },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: "Error updating event resolution" }, { status: 500 });
  }
}

async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const deletedEvent = await db.fplEvent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json(deletedEvent);
  } catch (error) {
    return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
  }
}
