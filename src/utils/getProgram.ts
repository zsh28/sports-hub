import idl from "@/idl/sports_hub.json";
import { SportsHub } from "@/types/sports_hub";
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export const getProgram = (connection: Connection, wallet: WalletContextState) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected or incompatible");
  }
  
  const provider = new AnchorProvider(connection, wallet as any, {});
  setProvider(provider);
  return new Program<SportsHub>(idl as SportsHub, provider);
};
