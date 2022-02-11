/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import styled from '@emotion/styled'
import { DefaultButton } from 'components/Button'
import { useEffect, useRef, useState } from 'react';
import ColorThief from "colorthief";

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

export default function AdCard({ nft, buyNft }: { nft: any, buyNft: (nft: any) => void }) {
  const [color, setColor] = useState("#fff")
  const imgRef = useRef(null)

  useEffect(() => {
    if (imgRef?.current && (imgRef?.current.width || imgRef?.current.offsetWidth)) {
      try {
        const colorThief = new ColorThief();

        const prominentColor = colorThief.getColor(imgRef?.current, 25)

        setColor(`rgba(${prominentColor.join()}, 0.35)`)
      }
      catch (e) {
        console.error(e)
      }
    }
  }, [imgRef])

  return (
    <NFTCard variant='outlined' className="shadow" color={color}>
      <ImgContainer>
        <NFTImage crossOrigin={"anonymous"} src={nft.image} ref={imgRef} loading="lazy" />
      </ImgContainer>

      <CardContent>
        <NFTTitle>{nft.name}</NFTTitle>
        <NFTDescription>{nft.description}</NFTDescription>
        <NFTPrice style={{ fontSize: '24px' }}>{nft.price} ETH</NFTPrice>
      </CardContent>

      <CardActions>
        <BuyButton onClick={() => buyNft(nft)} variant="contained">Comprar</BuyButton>
      </CardActions>
    </NFTCard>
  )
}