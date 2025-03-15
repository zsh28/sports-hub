"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AppHero, useTransactionToast } from "../ui/ui-layout";
import { useFplFixtures, FplFixture } from "@/hooks/useFplFixtures";
import { useDatabaseEvents, DatabaseEvent } from "@/hooks/useDatabaseEvents";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { usePlaceBet } from "@/hooks/usePlaceBet";
import { useResolveEvent } from "@/hooks/useResolveEvent";
import { useClaimReward } from "@/hooks/useClaimReward";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";

export default function DashboardFeature() {
  const {
    data: fixtures,
    isLoading: fixturesLoading,
    error: fixturesError,
  } = useFplFixtures();
  const {
    data: dbEvents,
    isLoading: dbLoading,
    error: dbError,
  } = useDatabaseEvents();
  const wallet = useWallet();
  const { showToast, showTransactionToast } = useTransactionToast();

  // Owner public key from env variable
  const ownerPublicKey = process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY || "";
  const isOwner = wallet.publicKey?.toBase58() === ownerPublicKey;

  const createEventMutation = useCreateEvent();
  const placeBetMutation = usePlaceBet();
  const resolveEventMutation = useResolveEvent();
  const claimRewardMutation = useClaimReward();
  const deleteEventMutation = useDeleteEvent();

  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);

  // Place Bet state (any user can place a bet)
  const [betEventId, setBetEventId] = useState<string>("");
  const [betTeam, setBetTeam] = useState<string>("");
  const [betAmount, setBetAmount] = useState<string>("");

  // Owner-only states
  const [resolveEventId, setResolveEventId] = useState<string>("");
  const [resolveOutcome, setResolveOutcome] = useState<string>("");
  const [claimRewardEventId, setClaimRewardEventId] = useState<string>("");
  const [deleteEventId, setDeleteEventId] = useState<string>("");

  // Handler for creating an event on-chain from an external fixture (owner-only)
  const onCreateEvent = useCallback(
    async (fixture: FplFixture) => {
      if (!isOwner) {
        showToast("error", "Only the owner can create events on-chain");
        return;
      }
      try {
        const tx = await createEventMutation.mutateAsync(fixture);
        showTransactionToast(tx);
      } catch (err: any) {
        showToast("error", `Transaction failed: ${err.message}`);
      }
    },
    [createEventMutation, showToast, showTransactionToast, isOwner]
  );

  const onPlaceBet = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const tx = await placeBetMutation.mutateAsync({
          betEventId,
          betTeam,
          betAmount,
          onChainEvents: dbEvents || [],
        });
        showTransactionToast(tx);
        setBetEventId("");
        setBetTeam("");
        setBetAmount("");
      } catch (err: any) {
        showToast("error", `Bet failed: ${err.message}`);
      }
    },
    [
      betEventId,
      betTeam,
      betAmount,
      placeBetMutation,
      showToast,
      showTransactionToast,
      dbEvents,
    ]
  );

  const handlePlaceBet = (
    e: React.FormEvent<HTMLFormElement>,
    eventId: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const outcome = formData.get("betOutcome") as string;
    const betAmount = formData.get("betAmount") as string;
    // Call your existing bet mutation with these values:
    placeBetMutation
      .mutateAsync({
        betEventId: eventId,
        betTeam: outcome,
        betAmount,
        onChainEvents: dbEvents || [],
      })
      .then((tx) => {
        showTransactionToast(tx);
      })
      .catch((err: any) => {
        showToast("error", `Bet failed: ${err.message}`);
      });
  };

  const onResolveEvent = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isOwner) {
        showToast("error", "Only the owner can resolve events");
        return;
      }
      try {
        const tx = await resolveEventMutation.mutateAsync({
          resolveEventId,
          resolveOutcome,
          onChainEvents: dbEvents || [],
        });
        showTransactionToast(tx);
        setResolveEventId("");
        setResolveOutcome("");
      } catch (err: any) {
        showToast("error", `Resolve failed: ${err.message}`);
      }
    },
    [
      resolveEventId,
      resolveOutcome,
      resolveEventMutation,
      showToast,
      showTransactionToast,
      dbEvents,
      isOwner,
    ]
  );

  const onClaimReward = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isOwner) {
        showToast("error", "Only the owner can claim rewards");
        return;
      }
      try {
        const tx = await claimRewardMutation.mutateAsync({
          claimRewardEventId,
          onChainEvents: dbEvents || [],
        });
        showTransactionToast(tx);
        setClaimRewardEventId("");
      } catch (err: any) {
        showToast("error", `Claim reward failed: ${err.message}`);
      }
    },
    [
      claimRewardEventId,
      claimRewardMutation,
      showToast,
      showTransactionToast,
      dbEvents,
      isOwner,
    ]
  );

  const onDeleteEvent = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isOwner) {
        showToast("error", "Only the owner can delete events");
        return;
      }
      try {
        const tx = await deleteEventMutation.mutateAsync({
          deleteEventId,
          onChainEvents: dbEvents || [],
        });
        showTransactionToast(tx);
        setDeleteEventId("");
      } catch (err: any) {
        showToast("error", `Delete event failed: ${err.message}`);
      }
    },
    [
      deleteEventId,
      deleteEventMutation,
      showToast,
      showTransactionToast,
      dbEvents,
      isOwner,
    ]
  );

  // Render external fixtures (for creating on-chain events)
  const renderFixtureOptions = () => {
    return (fixtures || []).map((fixture: FplFixture) => (
      <div
        key={fixture.id}
        className="border rounded-lg shadow-lg p-6 bg-blue-950 text-white"
      >
        <h4 className="text-lg font-bold">
          {fixture.teamA} vs {fixture.teamB}
        </h4>
        <p>Kickoff: {new Date(fixture.kickoff * 1000).toLocaleString()}</p>
        <p>ID: {fixture.id}</p>
        <button
          className="mt-4 w-full px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => onCreateEvent(fixture)}
          disabled={!wallet.connected || !isOwner}
        >
          Create on-chain
        </button>
      </div>
    ));
  };

  const renderDatabaseEventOptions = () => {
    return (dbEvents || []).map((event: DatabaseEvent) => (
      <option key={event.id} value={event.id}>
        {`ID ${event.id}: ${event.teamA} vs ${event.teamB}`}
      </option>
    ));
  };

  return (
    <div>
      <AppHero title="Sports Hub" subtitle="Manage sports betting events" />
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        {/* Section 1: External Fixtures (Only Visible to Owner) */}
        {isOwner && (
          <>
            <h3 className="text-2xl font-bold mb-6">FPL Fixtures (External)</h3>
            {fixturesError && (
              <p className="text-red-500">Error loading fixtures.</p>
            )}
            {fixturesLoading && <p>Loading fixtures...</p>}
            {fixtures && fixtures.length === 0 && <p>No fixtures found.</p>}
            {fixtures && fixtures.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderFixtureOptions()}
              </div>
            )}
          </>
        )}

        {/* Section 2: Database Events with Inline Bet Form */}
        <h3 className="text-2xl font-bold my-6">Events</h3>
        {dbError && <p className="text-red-500">Error loading events.</p>}
        {dbLoading && <p>Loading events...</p>}
        {dbEvents && dbEvents.length === 0 && <p>No events found.</p>}
        {dbEvents && dbEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbEvents.map((event: DatabaseEvent) => (
              <div
                key={event.id}
                className="border rounded-lg shadow-lg p-6 bg-blue-950 text-white"
              >
                <h4 className="text-lg font-bold">
                  {event.teamA} vs {event.teamB}
                </h4>
                <p>
                  Kickoff: {new Date(event.kickoff * 1000).toLocaleString()}
                </p>
                <p>ID: {event.id}</p>
                {/* Inline Bet Form */}
                <form
                  onSubmit={(e) => handlePlaceBet(e, event.id.toString())}
                  className="mt-4 space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium">
                      Select Team
                    </label>
                    <select
                      name="betOutcome"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    >
                      <option value="0">{event.teamA}</option>
                      <option value="1">{event.teamB}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Bet Amount (SOL)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      name="betAmount"
                      placeholder="Enter bet amount"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600"
                  >
                    Place Bet
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* Owner-only functionalities */}
        {isOwner && (
          <>
            {/* Resolve Event Form */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Resolve Event</h3>
              <form
                onSubmit={onResolveEvent}
                className="max-w-md mx-auto text-left"
              >
                <div className="mb-4">
                  <label
                    htmlFor="resolveEventId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Event (from DB)
                  </label>
                  <select
                    id="resolveEventId"
                    value={resolveEventId}
                    onChange={(e) => setResolveEventId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="">-- Select an event --</option>
                    {renderDatabaseEventOptions()}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="resolveOutcome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Outcome (empty = cancel event)
                  </label>
                  <select
                    id="resolveOutcome"
                    value={resolveOutcome}
                    onChange={(e) => setResolveOutcome(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="">Cancel Event</option>
                    <option value="0">Team A (0)</option>
                    <option value="1">Team B (1)</option>
                    <option value="2">Draw (2)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full px-4 py-2 rounded-lg font-semibold bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Resolve Event
                </button>
              </form>
            </div>

            {/* Claim Reward Form */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Claim Reward</h3>
              <form
                onSubmit={onClaimReward}
                className="max-w-md mx-auto text-left"
              >
                <div className="mb-4">
                  <label
                    htmlFor="claimRewardEventId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Event (from DB)
                  </label>
                  <select
                    id="claimRewardEventId"
                    value={claimRewardEventId}
                    onChange={(e) => setClaimRewardEventId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="">-- Select an event --</option>
                    {renderDatabaseEventOptions()}
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full px-4 py-2 rounded-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Claim Reward
                </button>
              </form>
            </div>

            {/* Delete Event Form */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Delete Event</h3>
              <form
                onSubmit={onDeleteEvent}
                className="max-w-md mx-auto text-left"
              >
                <div className="mb-4">
                  <label
                    htmlFor="deleteEventId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Event (from DB)
                  </label>
                  <select
                    id="deleteEventId"
                    value={deleteEventId}
                    onChange={(e) => setDeleteEventId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  >
                    <option value="">-- Select an event --</option>
                    {renderDatabaseEventOptions()}
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full px-4 py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete Event
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
