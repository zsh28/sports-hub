import { useQuery } from "@tanstack/react-query";

export type DatabaseEvent = {
  id: number;
  kickoff: number;
  teamA: string;
  teamB: string;
  tx?: string;
  publicKey?: string;
  resolvedOutcome?: number;
  deletedAt?: string;
  createdAt: string;
  bets: any[];
  claims: any[];
  teamALogo: string;
  teamBLogo: string;
};

const fetchTeamData = async (): Promise<Map<string, string>> => {
  const res = await fetch("/api/fplTeams"); // Fetch from your own API
  if (!res.ok) {
    throw new Error("Failed to fetch team data");
  }
  const teams = await res.json();

  const teamMap = new Map<string, string>();
  teams.forEach((team: any) => {
    teamMap.set(team.name, `https://resources.premierleague.com/premierleague/badges/t${team.code}.png`);
  });

  return teamMap;
};

export const useDatabaseEvents = () => {
  return useQuery<DatabaseEvent[], Error>({
    queryKey: ["databaseEvents"],
    queryFn: async () => {
      const [eventsRes, teamMap] = await Promise.all([
        fetch("/api/dbFplEvents").then((res) => res.json()),
        fetchTeamData(),
      ]);

      return eventsRes.map((event: DatabaseEvent) => ({
        ...event,
        teamALogo: teamMap.get(event.teamA) || "",
        teamBLogo: teamMap.get(event.teamB) || "",
      }));
    },
  });
};
