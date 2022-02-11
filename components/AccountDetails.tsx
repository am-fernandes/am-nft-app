import CopyIcon from '@mui/icons-material/ContentCopy';
import OpenNew from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button';
import styled from '@emotion/styled'
import JazzIcon from './JazzIcon'
import trimAccount from "shared/helpers/trimAccount";
import Web3Modal from 'web3modal'
import useWallet from 'hooks/useWallet'
import BaseModal from './BaseModal';

const AccountInfo = styled.div`
  border: 1px solid #bbb;
  border-radius: 16px;
  padding: 24px;
`

const DisconnectButton = styled(Button)`
  color: red;
  font-size: 10px;
  padding: 4px 8px;
  border: 1px solid red;
  margin-left: 32px;
`

export default function AccountDetails({ open, handleClose }: {
  open: boolean, handleClose: () => void
}) {



  const { address, provider } = useWallet()

  const handleDeactivate = async () => {
    const web3Modal = new Web3Modal()

    web3Modal.clearCachedProvider()

    handleClose();
  }

  return (
    <BaseModal open={open} handleClose={handleClose} title={"Detalhes da conta"}>
      <AccountInfo>
        <div className="flex flex-row mt-6">
          <div className="mt-1">
            <JazzIcon />
          </div>

          <span className="ml-4 text-2xl font-bold">
            {trimAccount(address)}
          </span>
        </div>

        <div className="flex flex-row mt-4">
          <Button startIcon={<CopyIcon />}>
            Copiar endereço
          </Button>

          <Button startIcon={<OpenNew />}>
            Veja no etherscan
          </Button>
        </div>
      </AccountInfo>
    </BaseModal>
  )
}