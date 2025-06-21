'use client'

import { WalletError } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react'
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui'
import dynamic from 'next/dynamic'
import { ReactNode, useCallback, useMemo } from 'react'

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'

require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => 'https://api.devnet.solana.com', [])

  const wallets = useMemo(
    () => [
    ],
    []
  )

  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
