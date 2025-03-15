import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import { getProgram } from '@/utils/getProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';

export interface FplEvent {
  id: number;
  kickoff: number;
  teamA: string;
  teamB: string;
}

export const useCreateEvent = () => {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation<string, Error, FplEvent>({
    mutationFn: async (event: FplEvent) => {
      if (!wallet.publicKey) throw new Error('Please connect your wallet first');

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const program = getProgram(connection, wallet);
      const eventKeypair = Keypair.generate();

      const tx = await program.methods
        .createEvent(new BN(event.id), event.teamA, event.teamB, new BN(event.kickoff))
        .accounts({
          event: eventKeypair.publicKey,
        })
        .signers([eventKeypair])
        .rpc();

      // Persist event in the database, including the on-chain event public key.
      await fetch('/api/dbFplEvents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...event, tx, publicKey: eventKeypair.publicKey.toBase58() }),
      });

      queryClient.invalidateQueries({ queryKey: ['databaseEvents'] });
      return tx;
    },
  });
};
