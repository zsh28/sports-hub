import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Connection, clusterApiUrl, PublicKey, SystemProgram } from '@solana/web3.js';
import { getProgram } from '@/utils/getProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';

type ClaimRewardVariables = {
  claimRewardEventId: string;
  onChainEvents: any[];
};

export const useClaimReward = () => {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  return useMutation<string, Error, ClaimRewardVariables>({
    mutationFn: async ({ claimRewardEventId, onChainEvents }) => {
      if (!wallet.publicKey) throw new Error('Please connect your wallet first');

      const eventItem = onChainEvents.find((item: any) => item.id.toString() === claimRewardEventId);
      if (!eventItem) throw new Error('Event not found for provided ID.');
      if (!eventItem.publicKey) throw new Error('Event on-chain public key not found.');

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const program = getProgram(connection, wallet);
      const eventIdBN = new BN(eventItem.id);
      const eventPubkey = new PublicKey(eventItem.publicKey);

      const HOUSE_PUBLIC_KEY = new PublicKey("5EvTWpYhC3PFkiyuMzcTebKgT13S9BJwTtkXGiuiVrPf");
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from("vault"), HOUSE_PUBLIC_KEY.toBuffer()],
        program.programId
      );
      const [betPda] = await PublicKey.findProgramAddress(
        [Buffer.from("bet"), eventPubkey.toBuffer(), wallet.publicKey.toBuffer()],
        program.programId
      );
      const [playerStatsPda] = await PublicKey.findProgramAddress(
        [Buffer.from("stats"), wallet.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .distributeRewards(eventIdBN)
        .accounts({
          vault: vaultPda,
          event: eventPubkey,
          bet: betPda,
          player: wallet.publicKey,
          playerStats: playerStatsPda,
          systemProgram: SystemProgram.programId,
          house: HOUSE_PUBLIC_KEY,
        } as any)
        .rpc();

      await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: parseInt(claimRewardEventId, 10),
          wallet: wallet.publicKey.toBase58(),
          tx,
        }),
      });

      queryClient.invalidateQueries({ queryKey: ['databaseEvents'] });
      return tx;
    },
  });
};
