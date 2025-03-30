import { useQuery } from "@tanstack/react-query";

export interface EventBet {
  id: string;
  wallet: string;
  eventId: string;
  betTeam: number;
  amount: number;
  timestamp?: number; // Optional if you store it
}

const fetchEventBets = async (eventId: string): Promise<EventBet[]> => {
  const res = await fetch(`/api/bets?eventId=${eventId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch bets for this event");
  }
  return res.json();
};

export const useEventBets = (eventId: string | undefined) => {
  return useQuery<EventBet[]>({
    queryKey: ["eventBets", eventId],
    queryFn: () => fetchEventBets(eventId!),
    enabled: !!eventId, // Only run if eventId exists
  });
};
