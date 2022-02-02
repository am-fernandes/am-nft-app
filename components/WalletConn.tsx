import { useState, useContext } from "react";
import { formatEther } from "@ethersproject/units";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Wallet from '@mui/icons-material/AccountBalanceWalletOutlined'
import styled from '@emotion/styled'
import JazzIcon from './JazzIcon'
import AccountDetails from "./AccountDetails";
import trimAccount from "helpers/trimAccount";
import Web3Modal from 'web3modal'
import { ethers, BigNumber } from "ethers";
import { WalletContext } from 'context/WalletContext'

export const DefaultButton = styled(Button)`
  border-radius: 16px;
  box-shadow: none;
  padding: 8px 20px;
`

const AccountButton = styled(DefaultButton)`
  background-color: #000;
  &:hover {
    background: rgba(0, 0, 0, 0.85);
  }
`

function formatBalance(accountBalance?: BigNumber): string {
  if (!accountBalance) return "0.0000";

  return parseFloat(formatEther(accountBalance)).toFixed(4)
}

export default function WalletConn() {
  // const { activateBrowserWallet, account } = useEthers()
  // const accountBalance = useEtherBalance(account)

  const [address, setAddress] = useState<string>('')
  const [balance, setBalance] = useState<BigNumber>()


  const { editWallet } = useContext(WalletContext)

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
        (<Box style={{ backgroundColor: "#d6d6d6", borderRadius: 16 }}>
          <span className="ml-4 mr-2 pt-8" style={{ fontSize: 14, fontWeight: '600' }}>{formatBalance(balance)} ETH</span>
          <AccountButton variant="contained" onClick={handleClickOpen}>
            {trimAccount(address)}

            <JazzIcon />
          </AccountButton>
        </Box>) :
        <DefaultButton color="secondary" startIcon={<Wallet />} onClick={handleConnectWallet}>Conectar carteira</DefaultButton>
      }

      <AccountDetails open={open} handleClose={handleClose} />
    </>
  )
}