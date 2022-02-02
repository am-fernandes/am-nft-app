import { useState, useContext, useEffect } from "react";
import { formatEther } from "@ethersproject/units";
import Box from '@mui/material/Box';
import { DefaultButton } from 'components/Button';
import Wallet from '@mui/icons-material/AccountBalanceWalletOutlined'
import styled from '@emotion/styled'
import JazzIcon from './JazzIcon'
import AccountDetails from "./AccountDetails";
import trimAccount from "helpers/trimAccount";
import Web3Modal from 'web3modal'
import { ethers, BigNumber } from "ethers";
import { WalletContext } from 'context/WalletContext'

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


  const { editWallet, wallet } = useContext(WalletContext)

  useEffect(() => {
    if (wallet?.address) {
      setAddress(wallet.address)
    }

    if (wallet?.balance) {
      setBalance(wallet.balance)
    }
  }, [wallet])

  async function handleConnectWallet() {
    const web3Modal = new Web3Modal()

    const instance = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    const _address = await signer.getAddress()
    const _balance = await signer.getBalance()

    setAddress(_address)
    setBalance(_balance)

    editWallet({
      provider,
      signer,
      address: _address,
      balance: _balance
    })
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