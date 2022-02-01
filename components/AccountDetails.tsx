import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CopyIcon from '@mui/icons-material/ContentCopy';
import OpenNew from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button';
import styled from '@emotion/styled'
import JazzIcon from './JazzIcon'
import { useEthers } from "@usedapp/core";
import trimAccount from "helpers/trimAccount";

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

  const { account, deactivate } = useEthers();

  const handleDeactivate = () => {
    deactivate();
    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: { borderRadius: 16 }
      }}
    >
      <DialogTitle id="alert-dialog-title">
        {"Detalhes da conta"}


        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <AccountInfo>
          <p>
            Conectado com Metamask

            <DisconnectButton color="error" onClick={handleDeactivate}>
              Desconectar
            </DisconnectButton>
          </p>

          <div className="flex flex-row mt-6">
            <div className="mt-1">
              <JazzIcon />

            </div>

            <span className="ml-4 text-2xl font-bold">
              {trimAccount(account)}
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
      </DialogContent>
    </Dialog>
  )
}