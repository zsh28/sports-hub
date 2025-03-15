import { useQuery } from '@tanstack/react-query';

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
};

export const useDatabaseEvents = () => {
  return useQuery<DatabaseEvent[], Error>({
    queryKey: ['databaseEvents'],
    queryFn: async () => {
      const res = await fetch('/api/dbFplEvents');
      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }
      return res.json();
    },
  });
};
