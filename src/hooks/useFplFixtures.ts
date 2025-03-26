import { useQuery } from "@tanstack/react-query";

export type FplFixture = {
  id: number;
  kickoff: number;
  teamA: string;
  teamB: string;
};

// This would be in your hooks file
export function useFplFixtures(days: number) {
  return useQuery({
    queryKey: ["fplFixtures", days],
    queryFn: async () => {
      const response = await fetch(`/api/fplFixtures?days=${days}`);
      if (!response.ok) {
        throw new Error("Failed to fetch fixtures");
      }
      return response.json();
    },
  });
}
