import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getProgram } from '@/utils/getProgram';
import { useWallet } from '@solana/wallet-adapter-react';

type DeleteEventVariables = {
  deleteEventId: string;
  onChainEvents: any[];
};

export const useDeleteEvent = () => {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation<string, Error, DeleteEventVariables>({
    mutationFn: async ({ deleteEventId, onChainEvents }) => {
      if (!wallet.publicKey) throw new Error('Please connect your wallet first');

      const eventItem = onChainEvents.find((item: any) => item.id.toString() === deleteEventId);
      if (!eventItem) throw new Error('Event not found for provided ID.');
      if (!eventItem.publicKey) throw new Error('Event on-chain public key not found.');

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const program = getProgram(connection, wallet);
      const eventPubkey = new PublicKey(eventItem.publicKey);

      const [betPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bet"), eventPubkey.toBuffer(), wallet.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .deleteEvent()
        .accounts({
          admin: wallet.publicKey,
          event: eventPubkey,
          bet: betPda,
          player: wallet.publicKey,
        } as any)
        .rpc();

      await fetch('/api/dbFplEvents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(deleteEventId, 10) }),
      });

      queryClient.invalidateQueries({ queryKey: ['databaseEvents'] });
      return tx;
    },
  });
};
