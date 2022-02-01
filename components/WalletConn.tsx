import { useState } from "react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Wallet from '@mui/icons-material/AccountBalanceWalletOutlined'
import styled from '@emotion/styled'
import { BigNumber } from "@usedapp/core/node_modules/ethers";
import JazzIcon from './JazzIcon'
import AccountDetails from "./AccountDetails";
import trimAccount from "helpers/trimAccount";

const DefaultButton = styled(Button)`
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
  const { activateBrowserWallet, account } = useEthers()
  const accountBalance = useEtherBalance(account)

  function handleConnectWallet() {
    activateBrowserWallet();
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
      {account ?
        (<Box style={{ backgroundColor: "#d6d6d6", borderRadius: 16 }}>
          <span className="ml-4 mr-2 pt-8" style={{ fontSize: 14, fontWeight: '600' }}>{formatBalance(accountBalance)} ETH</span>
          <AccountButton variant="contained" onClick={handleClickOpen}>
            {trimAccount(account)}

            <JazzIcon />
          </AccountButton>
        </Box>) :
        <DefaultButton color="secondary" startIcon={<Wallet />} onClick={handleConnectWallet}>Conectar carteira</DefaultButton>
      }

      <AccountDetails open={open} handleClose={handleClose} />
    </>
  )
}