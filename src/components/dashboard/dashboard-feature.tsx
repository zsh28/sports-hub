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
import Link from "next/link";

export default function DashboardFeature() {
  const [betEventId, setBetEventId] = useState<string>("");
  const [betTeam, setBetTeam] = useState<string>("");
  const [betAmount, setBetAmount] = useState<string>("");

  const [resolveEventId, setResolveEventId] = useState<string>("");
  const [resolveOutcome, setResolveOutcome] = useState<string>("");
  const [claimRewardEventId, setClaimRewardEventId] = useState<string>("");
  const [deleteEventId, setDeleteEventId] = useState<string>("");

  const [fixturesDays, setFixturesDays] = useState<number>(7);

  const {
    data: fixtures,
    isLoading: fixturesLoading,
    error: fixturesError,
  } = useFplFixtures(fixturesDays);

  const {
    data: dbEvents,
    isLoading: dbLoading,
    error: dbError,
  } = useDatabaseEvents();

  const wallet = useWallet();
  const { showToast, showTransactionToast } = useTransactionToast();

  const ownerPublicKey = process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY || "";
  const isOwner = wallet.publicKey?.toBase58() === ownerPublicKey;

  const createEventMutation = useCreateEvent();
  const placeBetMutation = usePlaceBet();
  const resolveEventMutation = useResolveEvent();
  const claimRewardMutation = useClaimReward();
  const deleteEventMutation = useDeleteEvent();

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
    placeBetMutation
      .mutateAsync({
        betEventId: eventId,
        betTeam: outcome,
        betAmount,
        onChainEvents: dbEvents || [],
      })
      .then((tx) => showTransactionToast(tx))
      .catch((err: any) => showToast("error", `Bet failed: ${err.message}`));
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

  // ✅ NEW helper for select options
  const renderDatabaseEventSelectOptions = () => {
    return (dbEvents || []).map((event: DatabaseEvent) => (
      <option key={event.id} value={event.id}>
        {event.teamA} vs {event.teamB} (ID: {event.id})
      </option>
    ));
  };

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
      <Link href={`/events/${event.id}`} key={event.id}>
        <div className="border rounded-lg shadow-lg p-6 bg-blue-950 text-white cursor-pointer hover:bg-blue-900 transition-colors">
          <div className="flex justify-between items-center">
            <img
              src={event.teamALogo}
              alt={event.teamA}
              className="w-16 h-16"
            />
            <span className="text-xl font-bold">VS</span>
            <img
              src={event.teamBLogo}
              alt={event.teamB}
              className="w-16 h-16"
            />
          </div>
          <p className="mt-4">
            Kickoff: {new Date(event.kickoff * 1000).toLocaleString()}
          </p>
          <p>ID: {event.id}</p>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => handlePlaceBet(e, event.id.toString())}
            className="mt-4 space-y-3"
          >
            <label className="block text-sm font-medium">Select Team</label>
            <select
              name="betOutcome"
              className="block w-full rounded p-2 bg-gray-800 text-white"
            >
              <option value="0">{event.teamA}</option>
              <option value="1">{event.teamB}</option>
            </select>
            <label className="block text-sm font-medium">
              Bet Amount (SOL)
            </label>
            <input
              type="number"
              step="0.0001"
              name="betAmount"
              className="block w-full rounded p-2"
              placeholder="Enter bet amount"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 rounded bg-green-500 hover:bg-green-600"
            >
              Place Bet
            </button>
          </form>
        </div>
      </Link>
    ));
  };

  return (
    <div>
      <AppHero title="Sports Hub" subtitle="Manage sports betting events" />
      <div className="max-w-5xl mx-auto py-6 px-4 text-center">
        {isOwner && (
          <>
            <h3 className="text-2xl font-bold mb-6">FPL Fixtures (External)</h3>
            <div className="mb-4 flex justify-end">
              <label className="mr-2">Show fixtures for next:</label>
              <input
                type="number"
                value={fixturesDays}
                min="1"
                max="180"
                onChange={(e) => setFixturesDays(Number(e.target.value))}
                className="w-16 p-1 rounded bg-gray-800 text-white mr-2"
              />
              <span className="text-white">days</span>
            </div>
            {fixturesLoading && <p>Loading fixtures...</p>}
            {fixturesError && (
              <p className="text-red-500">Error loading fixtures.</p>
            )}
            {fixtures?.length === 0 && <p>No fixtures found.</p>}
            {fixtures?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderFixtureOptions()}
              </div>
            )}
          </>
        )}

        <h3 className="text-2xl font-bold my-6">Events</h3>
        {dbLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
        )}
        {dbError && <p className="text-red-500">Error loading events.</p>}
        {dbEvents?.length === 0 && <p>No events found.</p>}
        {dbEvents?.length && dbEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderDatabaseEventOptions()}
          </div>
        )}

        {isOwner && (
          <>
            {/* Resolve Event */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Resolve Event</h3>
              <form
                onSubmit={onResolveEvent}
                className="max-w-md mx-auto text-left"
              >
                <select
                  value={resolveEventId}
                  onChange={(e) => setResolveEventId(e.target.value)}
                  className="w-full rounded p-2 bg-gray-800 text-white mb-4"
                >
                  <option value="">-- Select an event --</option>
                  {renderDatabaseEventSelectOptions()}
                </select>
                <select
                  value={resolveOutcome}
                  onChange={(e) => setResolveOutcome(e.target.value)}
                  className="w-full rounded p-2 bg-gray-800 text-white mb-4"
                >
                  <option value="">Cancel Event</option>
                  <option value="0">Team A (0)</option>
                  <option value="1">Team B (1)</option>
                  <option value="2">Draw (2)</option>
                </select>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Resolve Event
                </button>
              </form>
            </div>

            {/* Claim Reward */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Claim Reward</h3>
              <form
                onSubmit={onClaimReward}
                className="max-w-md mx-auto text-left"
              >
                <select
                  value={claimRewardEventId}
                  onChange={(e) => setClaimRewardEventId(e.target.value)}
                  className="w-full rounded p-2 bg-gray-800 text-white mb-4"
                >
                  <option value="">-- Select an event --</option>
                  {renderDatabaseEventSelectOptions()}
                </select>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Claim Reward
                </button>
              </form>
            </div>

            {/* Delete Event */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Delete Event</h3>
              <form
                onSubmit={onDeleteEvent}
                className="max-w-md mx-auto text-left"
              >
                <select
                  value={deleteEventId}
                  onChange={(e) => setDeleteEventId(e.target.value)}
                  className="w-full rounded p-2 bg-gray-800 text-white mb-4"
                >
                  <option value="">-- Select an event --</option>
                  {renderDatabaseEventSelectOptions()}
                </select>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
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
