import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import WalletConn from './WalletConn';
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

const Nav = styled(AppBar)`
  border-bottom: 1px solid #bbb;
  background-color: #fff;
  color: #000;
`

const Spacer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`

export default function Navbar() {

  const router = useRouter()


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Nav position="fixed" elevation={0}>
        <Toolbar className="flex">
          <Typography variant="h6" component="h1" >
            AM NFT Marketplace
          </Typography>

          <Spacer />
          <Button>
            Explorar
          </Button>


          <Button onClick={() => router.push("/create")}>
            Criar NFT
          </Button>

          <Button>
            Sua coleção
          </Button>

          <Spacer />


          <WalletConn />
        </Toolbar>
      </Nav>
    </Box>
  );
}
