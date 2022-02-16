/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import styled from '@emotion/styled'
import { DefaultButton } from 'components/Button'
import React, { useEffect, useState } from 'react';
import trimAccount from 'shared/helpers/trimAccount'

const BuyButton = styled(DefaultButton)`
  width: 100%;
  border-radius: 32px;
  // background-color: #63cecc;
  // color: #00355e;
  background: #000;
  color: #fff;
  &:hover {
    background: rgba(0, 0, 0, 0.85);
  }
`

const NFTImage = styled.img`
  width: 100%;
  background-color: #fff;
  display: block;
  transition: all 300ms linear;
  border-radius: 32px;
`

const NFTTitle = styled.h2`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  margin: 0 0 0.5rem;
`

const NFTPrice = styled.h3`
  font-weight: bold;
  font-size: 24px;
  text-align: center;
`

const NFTCard = styled(Card)`
  width: 100%;
  padding: 0;
  background: ${props => props?.color};
  color: #000;
  border: none;
  border-radius: 32px;
  &:hover {
    cursor: pointer;
    transition: all 300ms linear;
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    img {
      transition: all 500ms linear;
      transform: scale(1.1);
      transform-origin: 50% 50%;
    }
  }
`

const ImgContainer = styled.div`
  display: inline-block;
  width: 100%;
  padding: calc(5% - 2px);
`

const NFTDescription = styled.p`
  text-align: center;
  margin-bottom: 0.5rem;
`

const CreatorPopup = styled.div`
  background: #fff;
  color: #000;
  font-weight: bold;
  padding: 0 0.5rem;
  border-radius: 1rem;
  width: 80%;
  margin: 0.5rem 10%;
  text-align: center;
  &:hover {
    cursor: pointer;
    transition: all 300ms linear;
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
  }
`

const getArtist = async (address: string): Promise<string> => {
  if (!address) return ''

  const p = new Promise<any>((resolve, reject) => {
    fetch(`http://localhost:3000/api/user/select/wallet/${address}`, {
      "method": "GET",
      "headers": {}
    })
      .then(response => response.json())
      .then((response) => resolve(response))
      .catch(err => {
        reject(err);
      });
  })

  const account = await p

  if (account?.length) {
    return account[0]?.username
  }

  return trimAccount(address)
}

function AdCard({ nft, buyNft }: { nft: any, buyNft: (nft: any) => void }) {
  const router = useRouter()

  const [artist, setArtist] = useState<string>('')
  const [startSubmit, setStartSubmit] = useState<boolean>(false)

  useEffect(() => {
    console.log(nft)

    getArtist(nft?.creator)
      .then((r) => setArtist(r))
      .catch((e) => console.log(e))
  }, [nft])

  const wrappedFn = async () => {
    try {
      setStartSubmit(true)

      await buyNft(nft)
      setStartSubmit(false)
    } catch (e) {
      setStartSubmit(false)
      console.log(e)
    }
  }

  return (
    <NFTCard variant='outlined' className="shadow" color={nft?.color || "#fff"}>

      <ImgContainer>
        <NFTImage src={nft.image} loading="lazy" />
      </ImgContainer>

      <CardContent>
        <NFTTitle>{nft.name}</NFTTitle>
        <CreatorPopup className="shadow" onClick={() => router.push(`profile/${nft.creator}`)}>
          Artista: {artist}
        </CreatorPopup>
        <NFTDescription>{nft.description}</NFTDescription>
        <NFTPrice style={{ fontSize: '24px' }}>{nft.price} ETH</NFTPrice>
      </CardContent>

      <CardActions>
        <BuyButton disabled={startSubmit} loading={startSubmit} onClick={wrappedFn} variant="contained">Comprar</BuyButton>
      </CardActions>
    </NFTCard>
  )
}


export default React.memo(AdCard)