import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getProgram } from '@/utils/getProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';

type PlaceBetVariables = {
  betEventId: string;
  betTeam: string;
  betAmount: string;
  onChainEvents: any[]; // This will be the array of DatabaseEvent
};

export const usePlaceBet = () => {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation<string, Error, PlaceBetVariables>({
    mutationFn: async ({ betEventId, betTeam, betAmount, onChainEvents }) => {
      if (!wallet.publicKey) throw new Error('Please connect your wallet first');

      // Since onChainEvents here are database events, we use item.id and item.publicKey.
      const eventItem = onChainEvents.find((item: any) => item.id.toString() === betEventId);
      if (!eventItem) throw new Error('Event not found for the provided ID.');
      if (!eventItem.publicKey) throw new Error('Event on-chain public key not found.');

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const program = getProgram(connection, wallet);
      const betLamports = Math.floor(parseFloat(betAmount) * 1e9);
      const betAmountBN = new BN(betLamports.toString());
      const outcome = parseInt(betTeam, 10);
      const eventIdBN = new BN(eventItem.id);

      const HOUSE_PUBLIC_KEY = new PublicKey(process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY!);
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from("vault"), HOUSE_PUBLIC_KEY.toBuffer()],
        program.programId
      );
      // Use the stored on-chain public key
      const eventPubkey = new PublicKey(eventItem.publicKey);
      const [betPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bet"), eventPubkey.toBuffer(), wallet.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .placeBet(eventIdBN, outcome, betAmountBN)
        .accounts({
          player: wallet.publicKey,
          vault: vaultPda,
          event: eventPubkey,
        })
        .rpc();

      await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: parseInt(betEventId, 10),
          wallet: wallet.publicKey.toBase58(),
          outcome,
          amount: parseFloat(betAmount),
          tx,
        }),
      });

      queryClient.invalidateQueries({ queryKey: ['databaseEvents'] });
      return tx;
    },
  });
};
