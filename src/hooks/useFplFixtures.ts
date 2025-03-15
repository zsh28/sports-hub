import { useQuery } from '@tanstack/react-query';

export type FplFixture = {
  id: number;
  kickoff: number;
  teamA: string;
  teamB: string;
};

export const useFplFixtures = () => {
  return useQuery<FplFixture[], Error>({
    queryKey: ['fplFixtures'],
    queryFn: async () => {
      const res = await fetch('/api/fplFixtures');
      if (!res.ok) {
        throw new Error('Failed to fetch fixtures');
      }
      return res.json();
    },
  });
};
