import { useState } from "react";
import { formatEther } from "@ethersproject/units";
import Box from '@mui/material/Box';
import { DefaultButton } from 'components/Button';
import Wallet from '@mui/icons-material/AccountBalanceWalletOutlined'
import styled from '@emotion/styled'
import JazzIcon from './JazzIcon'
import AccountDetails from "./AccountDetails";
import trimAccount from "shared/helpers/trimAccount";
import { BigNumber } from "ethers";
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
  const { address, balance, getConnection } = useWallet()

  async function handleConnectWallet() {
    await getConnection()
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