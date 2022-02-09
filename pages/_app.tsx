import '../styles/globals.css'
import Head from 'next/head';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { WalletProvider } from 'context/WalletContext'
import Container from '@mui/material/Container';
import Navbar from 'components/Navbar'

function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme({});

function app({ Component, pageProps }) {
  const emotionCache = clientSideEmotionCache;

  return (
    <CacheProvider value={emotionCache}>
      <WalletProvider>
        <Head>
          <title>AM NFT | HOME</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Container className="p-4 mt-16">
            <Navbar />
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      </WalletProvider>
    </CacheProvider>
  )
}

export default app
