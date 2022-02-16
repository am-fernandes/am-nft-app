/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import axios from 'axios'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import AdCard from 'components/AdCard'
import useWallet from 'hooks/useWallet'
import { marketContract, nftContract, nftaddress } from 'shared/contracts/instance'
import Masonry from '@mui/lab/Masonry';
import Grid from '@mui/material/Grid';
import SkeletonCard from 'components/SkeletonCard'

export default function Home() {
  const { getConnection } = useWallet()

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const { provider } = await getConnection()

    const market = marketContract(provider)
    const nft = nftContract(provider)


    const data = await market.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        creator: i.creator,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        color: meta.data?.color
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }
  async function buyNft(nft) {
    const { signer } = await getConnection()

    const contract = marketContract(signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })

    await transaction.wait()

    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <h1>Nenhum item a venda</h1>
  )

  return (
    <>
      <Head>
        <title>AM NFT</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {nfts?.length ? (
        <Masonry columns={4} spacing={4}>
          {
            nfts.map((nft, i) => (
              <AdCard nft={nft} buyNft={buyNft} key={i} />
            ))
          }
        </Masonry>) : (
        <Grid container spacing={2}>
          <Grid item md={3}>
            <SkeletonCard />
          </Grid>
          <Grid item md={3}>
            <SkeletonCard />
          </Grid>
          <Grid item md={3}>
            <SkeletonCard />
          </Grid>
          <Grid item md={3}>
            <SkeletonCard />
          </Grid>
        </Grid>
      )}
    </>
  )
}
