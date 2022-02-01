import '../styles/globals.css'
import { DAppProvider } from '@usedapp/core'
import Head from 'next/head';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme({});

function app({ Component, pageProps }) {
  const emotionCache = clientSideEmotionCache;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>AM NFT | HOME</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <DAppProvider config={{}}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </DAppProvider>
    </CacheProvider>
  )
}

export default app
