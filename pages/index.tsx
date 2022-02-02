/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Container from '@mui/material/Container';
import Navbar from 'components/Navbar'
import axios from 'axios'
import Web3Modal from "web3modal"
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { nftaddress, nftmarketaddress } from '../hardhat/config'
import NFT from '../hardhat/artifacts/contracts/CreateNFT.sol/CreateNFT.json'
import Market from '../hardhat/artifacts/contracts/Market.sol/NFTMarket.json'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button'

// let rpcEndpoint = 'https://rpc-mumbai.maticvigil.com'
let rpcEndpoint = ''

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <Container style={{ marginTop: 64 }} className='p-4'>
      <Navbar />
      <h1>Nenhum item a venda</h1>
    </Container>)

  return (
    <Container style={{ marginTop: 64 }} className='p-4'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <Navbar />

        <Grid container spacing={2} style={{ padding: 36 }}>
          {
            nfts.map((nft, i) => (
              <Grid item xs={3} key={i}>
                <Card variant="outlined" style={{ width: '100%', paddingLeft: 16, paddingRight: 16, paddingTop: 16 }}>

                  <CardContent>
                    <img src={nft.image} width={'90%'} style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)', borderStyle: 'solid', padding: 16, borderRadius: 16, marginLeft: '5%' }} />
                    <p style={{ fontSize: '22px', fontWeight: 'bold' }}>{nft.name}</p>
                    <p>{nft.description}</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{nft.price} ETH</p>
                  </CardContent>

                  <CardActions>
                    <Button onClick={() => buyNft(nft)} variant="contained" color="secondary" style={{ width: '100%' }}>Comprar</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          }
        </Grid>
      </>

    </Container>
  )
}
