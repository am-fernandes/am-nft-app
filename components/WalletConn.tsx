/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useContext, useEffect } from "react";
import { formatEther } from "@ethersproject/units";
import Box from '@mui/material/Box';
import { DefaultButton } from 'components/Button';
import Wallet from '@mui/icons-material/AccountBalanceWalletOutlined'
import styled from '@emotion/styled'
import JazzIcon from './JazzIcon'
import AccountDetails from "./AccountDetails";
import trimAccount from "shared/helpers/trimAccount";
import Web3Modal from 'web3modal'
import { ethers, BigNumber } from "ethers";
import { WalletContext } from 'context/WalletContext'
import WalletConnectProvider from '@walletconnect/web3-provider'
import useWallet from "hooks/useWallet";

const AccountButton = styled(DefaultButton)`
  background-color: #000;
  &:hover {
    background: rgba(0, 0, 0, 0.85);
  }
`

const BalanceBadge = styled(Box)`
  background-color: rgba(99, 206, 204, 0.6);
  border-radius: 16px;
`

function formatBalance(accountBalance?: BigNumber): string {
  if (!accountBalance) return "0.0000";

  return parseFloat(formatEther(accountBalance)).toFixed(4)
}

export default function WalletConn() {
  const [address, setAddress] = useState<string>('')
  const [balance, setBalance] = useState<BigNumber>()

  const { wallet } = useContext(WalletContext)

  useEffect(() => {
    if (wallet?.address) {
      setAddress(wallet.address)
    }

    if (wallet?.balance) {
      setBalance(wallet.balance)
    }
  }, [wallet])

  const w = useWallet()


  async function handleConnectWallet() {
    // const w = useWallet()

    setAddress(w.address)
    setBalance(w.balance)
  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {address ?
        (<BalanceBadge>
          <span className="ml-4 mr-3 pt-8 text-sm font-bold">{formatBalance(balance)} ETH</span>
          <AccountButton variant="contained" onClick={handleClickOpen}>
            {trimAccount(address)}
            <JazzIcon />
          </AccountButton>
        </BalanceBadge>) :
        <AccountButton variant="contained" startIcon={<Wallet />} onClick={handleConnectWallet}>
          Conectar carteira
        </AccountButton>
      }

      <AccountDetails open={open} handleClose={handleClose} />
    </>)
}