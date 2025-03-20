import { NextResponse } from "next/server";
import axios from "axios";

let cachedTeams: any[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function GET() {
  try {
    const now = Date.now();
    if (cachedTeams && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
      console.log("Returning cached team data");
      return NextResponse.json(cachedTeams);
    }

    const response = await axios.get("https://fantasy.premierleague.com/api/bootstrap-static/");
    
    cachedTeams = response.data.teams; // Store data in cache
    cacheTimestamp = now; // Update cache timestamp

    return NextResponse.json(cachedTeams);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team data" }, { status: 500 });
  }
}
