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

interface UseWalletHook extends WalletInfos {
  getConnection: () => Promise<WalletInfos>
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

const checkCachedProvider = (): Promise<WalletInfos> | undefined => {
  const web3Modal = new Web3Modal({
    cacheProvider: true
  })

  if (web3Modal.cachedProvider) {
    return walletConnect()
  }
  return
}

const useWallet = (): UseWalletHook => {
  const [currentWallet, setCurrentWallet] = useState<WalletInfos>()

  const { wallet, editWallet } = useContext(WalletContext)

  const getConnection = async (): Promise<WalletInfos> => {
    if (wallet?.address && wallet?.balance && wallet?.provider && wallet?.signer) {
      setCurrentWallet(wallet)

      return { ...wallet }
    }
    const w = await walletConnect()

    editWallet(w)
    setCurrentWallet(w)

    return w
  }

  useEffect(() => {
    (async () => {
      if (wallet?.address && wallet?.balance && wallet?.provider && wallet?.signer) {
        setCurrentWallet({ ...wallet })
      } else {
        const cachedWallet = await checkCachedProvider()

        if (cachedWallet) {
          editWallet(cachedWallet)
          setCurrentWallet(cachedWallet)
        }
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

  return { getConnection, ...currentWallet }
}

export default useWallet