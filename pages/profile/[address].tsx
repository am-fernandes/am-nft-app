import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { nftContract, marketContract } from 'shared/contracts/instance'
import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { Frame, ProfilePhoto } from 'pages/profile'
import Masonry from '@mui/lab/Masonry';
import GalleryCard from 'components/GalleryCard'
import SkeletonCard from 'components/SkeletonCard'

let rpcEndpoint = ''

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

interface ArtistProfile {
  wallet: string
  username: string
  email?: string
  bio?: string
  photo?: string
}

const AFrame = styled(Frame)`
  width: 7.5vw;
  height: 7.5vw;
`
const AProfilePhoto = styled(ProfilePhoto)`
  width: 7.5vw;
  height: 7.5vw;
`


const Banner = styled.div`
  width: 100vw;
  height: 40vh;
  background-color: #000;
  margin-left: -99px;
  color: #fff;
  margin-bottom: 1rem;
`


export default function Profile() {
  const [artist, setArtist] = useState<ArtistProfile>()

  const [nfts, setNfts] = useState([])

  const route = useRouter()

  const { address } = route.query

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)

    const market = marketContract(provider)
    const tokenContract = nftContract(provider)
    const data = await market.fetchCreatedByAddress(address)

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
        name: meta.data.name,
        description: meta.data.description,
        color: meta.data?.color,
      }
      return item
    }))

    setNfts(items)
  }

  useEffect(() => {
    if (address) {
      loadNFTs()


      fetch(`http://localhost:3000/api/user/select/wallet/${address}`, {
        "method": "GET",
        "headers": {}
      })
        .then(response => response.json())
        .then((response) => {
          setArtist(response[0])
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [address])

  return (
    <>
      <Banner className='p-4'>
        <AFrame>
          {artist?.photo && (
            <AProfilePhoto src={artist?.photo}></AProfilePhoto>
          )}
        </AFrame>

        <Typography variant="h4" className="text-center font-bold">@{artist?.username}</Typography>
        <p className="text-center mt-4">{artist?.bio}</p>
      </Banner>

      {nfts?.length ? (
        <Masonry columns={4} spacing={4}>
          {
            nfts.map((nft, i) => (
              <GalleryCard nft={nft} key={i} />
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