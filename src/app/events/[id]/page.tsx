"use client";

import { useParams } from "next/navigation";
import { useDatabaseEvents } from "@/hooks/useDatabaseEvents";
import { usePlaceBet } from "@/hooks/usePlaceBet";
import { useEventBets } from "@/hooks/useEventBets";
import { useTransactionToast } from "@/components/ui/ui-layout";
import { useState } from "react";

export default function EventPage() {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const { data: dbEvents } = useDatabaseEvents();
  const { data: bets } = useEventBets(eventId);
  const placeBetMutation = usePlaceBet();
  const { showTransactionToast, showToast } = useTransactionToast();

  const event = dbEvents?.find((e) => String(e.id) === eventId);

  const [betTeam, setBetTeam] = useState("");
  const [betAmount, setBetAmount] = useState("");

  const handleBetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tx = await placeBetMutation.mutateAsync({
        betEventId: eventId,
        betTeam,
        betAmount,
        onChainEvents: dbEvents || [],
      });
      showTransactionToast(tx);
      setBetTeam("");
      setBetAmount("");
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  if (!event) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="text-white px-4 py-8 max-w-3xl mx-auto space-y-10">
      {/* Event Info with Team Logos */}
      <div className="bg-blue-950 p-6 rounded-xl shadow-lg text-center">
        <div className="flex justify-center items-center gap-6 mb-4">
          <div className="flex flex-col items-center">
            <img src={event.teamALogo} alt={event.teamA} className="w-16 h-16" />
            <p className="text-sm mt-1">{event.teamA}</p>
          </div>
          <span className="text-2xl font-bold text-gray-300">VS</span>
          <div className="flex flex-col items-center">
            <img src={event.teamBLogo} alt={event.teamB} className="w-16 h-16" />
            <p className="text-sm mt-1">{event.teamB}</p>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Kickoff: {new Date(event.kickoff * 1000).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">Event ID: {event.id}</p>
      </div>

      {/* Bet Form */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Place Your Bet</h2>
        <form onSubmit={handleBetSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Select Team</label>
            <select
              value={betTeam}
              onChange={(e) => setBetTeam(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-md p-2"
              required
            >
              <option value="">-- Choose --</option>
              <option value="0">{event.teamA}</option>
              <option value="1">{event.teamB}</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Bet Amount (SOL)
            </label>
            <input
              type="number"
              step="0.0001"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="0.01"
              className="w-full bg-gray-800 text-white rounded-md p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
          >
            Place Bet
          </button>
        </form>
      </div>

      {/* Bets History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Previous Bets</h2>
        {bets && bets.length > 0 ? (
          <ul className="space-y-3">
            {bets.map((bet) => {
                const userShort = bet.wallet.slice(0, 4) + "..." + bet.wallet.slice(-4);

              return (
                <li
                  key={bet.id}
                  className="bg-gray-800 p-4 rounded-md shadow-sm text-sm"
                >
                  <p>
                    <span className="font-semibold">Wallet:</span>{" "}
                    {userShort}
                  </p>
                  <p>
                    <span className="font-semibold">Team:</span>{" "}
                    {bet.betTeam === 0 ? event.teamA : event.teamB}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span>{" "}
                    {bet.amount} SOL
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400">No bets placed yet.</p>
        )}
      </div>
    </div>
  );
}
