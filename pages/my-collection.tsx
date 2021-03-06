import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useWallet from 'hooks/useWallet'
import { marketContract, nftContract, nftaddress, nftmarketaddress } from 'shared/contracts/instance'
import Head from 'next/head'
import Masonry from '@mui/lab/Masonry';
import ResaleCard from 'components/ResaleCard'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid';
import SkeletonCard from 'components/SkeletonCard'

export default function MyAssets() {
  const { getConnection } = useWallet()

  const approveHandle = async (tokenId: string) => {
    const { signer } = await getConnection()

    const contract = nftContract(signer)

    const transaction = await contract.approveNFTHandle(nftmarketaddress, tokenId)
    const tx = await transaction.wait()
    const event = tx.events[0]

    console.log("APPROVE", event)
  }


  const listToMarket = async (tokenId: string, price: string) => {
    if (!tokenId || !price) throw new Error('no token id or pricing');

    const { signer } = await getConnection()

    await approveHandle(tokenId)

    const mktPrice = ethers.utils.parseUnits(price, 'ether')

    const contract = marketContract(signer)
    const transaction = await contract.createMarketItem(nftaddress, tokenId, mktPrice)
    const tx = await transaction.wait()

    const event = tx.events[0]

    console.log(event)
  }

  const [nfts, setNfts] = useState([])

  useEffect(() => {
    (async () => {
      const { signer, provider } = await getConnection()

      if (signer && provider) {
        loadNFTs()
      }
    })()
  }, [])

  async function loadNFTs() {
    const { signer, provider } = await getConnection()

    const market = marketContract(signer)
    const tokenContract = nftContract(provider)
    const data = await market.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        creator: i.creator,
        description: meta.data.description,
        color: meta.data?.color,
      }
      return item
    }))

    console.log('items', items)
    setNfts(items)
  }

  return (
    <>
      <Head>
        <title>AM NFT</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Typography variant="h3" component="h1" className="text-center my-4 font-bold" >???? Sua cole????o</Typography>
      {nfts?.length ? (
        <Masonry columns={4} spacing={4}>
          {
            nfts.map((nft, i) => (
              <ResaleCard nft={nft} resale={listToMarket} key={i} />
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