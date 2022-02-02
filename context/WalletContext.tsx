import { createContext, useState, FC } from "react";
import { providers, BigNumber } from 'ethers'

interface Wallet {
  provider: providers.Web3Provider
  signer: providers.JsonRpcSigner
  address: string
  balance: BigNumber
}

interface WalletChange {
  wallet?: Wallet
  editWallet?: (w: Wallet) => null
}

export const WalletContext = createContext<WalletChange>({})

export const WalletProvider: FC = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | undefined>()

  const editWallet = (w: Wallet) => {
    setWallet(w)
    return null
  }

  return (
    <WalletContext.Provider value={{ wallet, editWallet }}>
      {children}
    </WalletContext.Provider>
  )
}