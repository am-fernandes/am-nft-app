import { ethers, providers, BigNumber } from "ethers";
import Web3Modal from 'web3modal'
import { useContext, useEffect, useState } from "react";
import { WalletContext } from 'context/WalletContext'

interface WalletInfos {
  provider: providers.Web3Provider
  signer: providers.JsonRpcSigner
  address: string
  balance: BigNumber
}

const walletConnect = async (): Promise<WalletInfos> => {
  const web3Modal = new Web3Modal({
    cacheProvider: true
  })

  const instance = await web3Modal.connect();

  const provider = new ethers.providers.Web3Provider(instance);
  const signer = provider.getSigner();

  const address = await signer.getAddress()
  const balance = await signer.getBalance()

  return {
    provider,
    signer,
    address,
    balance
  }
}


const useWallet = (): WalletInfos => {
  const [currentWallet, setCurrentWallet] = useState<WalletInfos>()

  const { wallet, editWallet } = useContext(WalletContext)

  useEffect(() => {
    (async () => {
      if (wallet?.address && wallet?.balance && wallet?.provider && wallet?.signer) {
        const { address, balance, provider, signer } = wallet

        setCurrentWallet({
          provider,
          signer,
          address,
          balance
        })
      } else {
        const w = await walletConnect()

        editWallet(w)
        setCurrentWallet(w)
      }

    })()
  }, [wallet, editWallet])

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async () => {
        const w = await walletConnect()

        editWallet(w)
        setCurrentWallet(w)
      })

      return () => window.ethereum.removeAllListeners()
    }
  }, [editWallet])

  return currentWallet
}

export default useWallet