/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styled from '@emotion/styled'
import { DefaultButton } from 'components/Button'
import React from 'react';

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

function ResaleCard({ nft }: { nft: any }) {
  return (
    <>
      <NFTCard variant='outlined' className="shadow" color={nft?.color || "#fff"}>
        <ImgContainer>
          <NFTImage src={nft.image} loading="lazy" />
        </ImgContainer>

        <CardContent>
          <NFTTitle>{nft.name}</NFTTitle>

          <NFTDescription>{nft.description}</NFTDescription>
        </CardContent>
      </NFTCard>
    </>
  )
}

export default React.memo(ResaleCard)