import axios from "axios";
import { NextResponse } from "next/server";

export const runtime = "edge";

async function fetchFplFixtures() {
  try {
    const response = await axios.get("https://fantasy.premierleague.com/api/fixtures/");
    return response.data;
  } catch (error) {
    console.error("Error fetching FPL fixtures:", error);
    return [];
  }
}

async function fetchTeamData() {
  try {
    const response = await axios.get("https://fantasy.premierleague.com/api/bootstrap-static/");
    const teams = response.data.teams;
    const teamMap = new Map<number, string>();
    teams.forEach((team: any) => {
      teamMap.set(team.id, team.name);
    });
    return teamMap;
  } catch (error) {
    console.error("Error fetching team data:", error);
    return new Map<number, string>();
  }
}

export async function GET() {
  const [fixtures, teamMap] = await Promise.all([fetchFplFixtures(), fetchTeamData()]);

  // Calculate epoch range for the next 7 days (starting at UTC midnight today)
  const now = new Date();
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startEpoch = startDate.getTime() / 1000;
  const endEpoch = startEpoch + 7 * 24 * 3600;

  const events = fixtures
    .map((fixture: any) => {
      const kickoffEpoch = new Date(fixture.kickoff_time).getTime() / 1000;
      return {
        id: fixture.id,
        kickoff: kickoffEpoch,
        teamA: teamMap.get(fixture.team_h) || "Unknown",
        teamB: teamMap.get(fixture.team_a) || "Unknown",
      };
    })
    .filter((event: any) => event.kickoff >= startEpoch && event.kickoff < endEpoch);

  return NextResponse.json(events);
}
