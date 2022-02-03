/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import styled from '@emotion/styled'
import { DefaultButton } from 'components/Button'
import { useEffect } from 'react';

const BuyButton = styled(DefaultButton)`
  width: 100%;
  border-radius: 32px;
  // background-color: #63cecc;
  // color: #00355e;
  background: #fff;
  color: #000;
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`

const NFTImage = styled.img`
  width: 100%;
  background-color: #fff;
  display: block;
  transition: all 300ms linear;
`

const NFTTitle = styled.h2`
  font-weight: bold;
  font-size: 22px;
  text-align: center;
  margin: 0 0 0.5rem;
`

const NFTCard = styled(Card)`
  width: 100%;
  padding: 0;
  background: #000;
  color: #fff;
  &:hover {
    cursor: pointer;
    transition: all 350ms linear;
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    img {
      transition: all 500ms linear;
      transform: scale(1.05);
      transform-origin: 50% 50%;
    }
  }
`

const ImgContainer = styled.div`
  display: inline-block;
`

export default function AdCard({ nft, buyNft }: { nft: any, buyNft: (nft: any) => void }) {
  useEffect(() => {
    console.log(nft)
  }, [nft])

  return (
    <Grid item xs={3}>
      <NFTCard variant='outlined'>

        <ImgContainer>
          <NFTImage src={nft.image} />
        </ImgContainer>
        <CardContent>
          <NFTTitle>{nft.name}</NFTTitle>
          <p>{nft.description}</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{nft.price} ETH</p>
        </CardContent>

        <CardActions>
          <BuyButton onClick={() => buyNft(nft)} variant="contained">Comprar</BuyButton>
        </CardActions>
      </NFTCard>
    </Grid>
  )
}