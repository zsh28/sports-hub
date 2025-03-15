import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getProgram } from '@/utils/getProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';

type ResolveEventVariables = {
  resolveEventId: string;
  resolveOutcome: string;
  onChainEvents: any[];
};

export const useResolveEvent = () => {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation<string, Error, ResolveEventVariables>({
    mutationFn: async ({ resolveEventId, resolveOutcome, onChainEvents }) => {
      if (!wallet.publicKey) throw new Error('Please connect your wallet first');

      const eventItem = onChainEvents.find((item: any) => item.id.toString() === resolveEventId);
      if (!eventItem) throw new Error('Event not found for provided ID.');
      if (!eventItem.publicKey) throw new Error('Event on-chain public key not found.');

      const winningOutcome = resolveOutcome === '' ? null : parseInt(resolveOutcome, 10);
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const program = getProgram(connection, wallet);
      const eventIdBN = new BN(eventItem.id);

      const eventPubkey = new PublicKey(eventItem.publicKey);
      const tx = await program.methods
        .resolveEvent(eventIdBN, winningOutcome)
        .accounts({
          event: eventPubkey,
        })
        .rpc();

      await fetch('/api/dbFplEvents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(resolveEventId, 10),
          resolvedOutcome: winningOutcome,
        }),
      });

      queryClient.invalidateQueries({ queryKey: ['databaseEvents'] });
      return tx;
    },
  });
};
