import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import WalletConn from './WalletConn';
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { DefaultButton } from './Button'

const Nav = styled(AppBar)`
  background-color: #fff;
  color: #000;
`

const Spacer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`

const BrandTitle = styled(Typography)`
  font-weight: bold;
  margin: 0 1rem;
  font-size: 32px;
`

const NavLink = styled(DefaultButton)`
  margin: 0 0.5rem;
  color: #000;
  &:hover {
    background-color: #000;
    color: #fff;
    transition: all 350ms linear;
  }
`

export default function Navbar() {
  const router = useRouter()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Nav position="fixed" elevation={0}>
        <Toolbar className="flex">
          <Image alt='logo AM NFT' width={48} height={48} src={require("../public/img/logo.png")}></Image>
          <BrandTitle variant="h1">
            AM NFT
          </BrandTitle>
          <Spacer />
          <NavLink onClick={() => router.push("/")}>
            🧭 Explorar
          </NavLink>
          <NavLink onClick={() => router.push("/create")}>
            🎨 Criar NFT
          </NavLink>
          <NavLink onClick={() => router.push("/my-collection")}>
            📦 Sua coleção
          </NavLink>
          <NavLink onClick={() => router.push("/profile")}>
            👤 Perfil
          </NavLink>
          <Spacer />
          <WalletConn />
        </Toolbar>
      </Nav>
    </Box >
  );
}
