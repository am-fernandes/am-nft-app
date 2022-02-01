import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import WalletConn from './WalletConn';
import styled from '@emotion/styled'

const Nav = styled(AppBar)`
  border-bottom: 1px solid #bbb;
  background-color: #fff;
  color: #000;
`


export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Nav position="fixed" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            AM NFT Marketplace
          </Typography>
          <WalletConn />
        </Toolbar>
      </Nav>
    </Box>
  );
}
