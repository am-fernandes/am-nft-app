/* eslint-disable @next/next/no-img-element */
import Container from '@mui/material/Container';
import Navbar from 'components/Navbar'
import { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers'
import { WalletContext } from 'context/WalletContext'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form';
import { InputEdit } from 'components/Form/FormComponents'
import { DefaultButton } from 'components/Button'
import styled from '@emotion/styled';
import ipfsUploader from 'helpers/ipfsUploader';

const CreateNFTButton = styled(DefaultButton)`
  width: 50%;
  margin: 0 25%;
  background-color: #000;
  &:hover {
    background: rgba(0, 0, 0, 0.85);
  }
`

interface NFTMetadata {
  description: string
  name: string
  price: string
  file: FileList
}

import {
  nftaddress, nftmarketaddress
} from '../hardhat/config'


import NFT from '../hardhat/artifacts/contracts/CreateNFT.sol/CreateNFT.json'
import Market from '../hardhat/artifacts/contracts/Market.sol/NFTMarket.json'

const toBase64 = (file: File) => new Promise((resolve, reject) => {
  if (!file) return reject("NO FILE")
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export default function CreateItem() {
  const { handleSubmit, control, register, watch } = useForm<NFTMetadata>({});
  const { wallet } = useContext(WalletContext)

  const [imagePreview, setImagePreview] = useState<string>()

  const watchNFTFile = watch('file')

  useEffect(() => {
    if (watchNFTFile) {
      console.log(typeof watchNFTFile)
      const file = watchNFTFile[0]

      if (file) {
        toBase64(file).then((res) => {
          setImagePreview(res as unknown as string)
        }).catch((error) => {
          throw new Error(error)
        })
      }
    }
  }, [watchNFTFile])

  const imageUpload = async (files: FileList): Promise<string> => {
    const file = files[0];

    if (!file) throw new Error('no file')

    return ipfsUploader(file)
  }

  const metadateUpload = async (
    image: string,
    name: string,
    description: string): Promise<string> => {
    if (!image || !name || !description) throw new Error("incomplete data")

    return ipfsUploader(JSON.stringify({
      image,
      name,
      description
    }))
  }

  const mintNFT = async (metadataURL: string): Promise<any> => {
    if (!metadataURL) throw new Error('no metadata url')
    // VERIFY WALLET SIGNER FROM CONTEXT
    const contract = new ethers.Contract(nftaddress, NFT.abi, wallet.signer)

    const transaction = await contract.createToken(metadataURL)
    const tx = await transaction.wait()
    const event = tx.events[0]
    const value = event.args[2]
    const tokenId = value.toNumber()

    return tokenId
  }

  const listToMarket = async (tokenId: string, price: string) => {
    if (!tokenId || !price) throw new Error('no token id or pricing');

    const mktPrice = ethers.utils.parseUnits(price, 'ether')

    const contract = new ethers.Contract(nftmarketaddress, Market.abi, wallet.signer)
    const transaction = await contract.createMarketItem(nftaddress, tokenId, mktPrice)
    const tx = await transaction.wait()

    const event = tx.events[0]

    console.log(event)
  }


  const onSubmit = async ({ file, description, name, price }: NFTMetadata) => {
    if (!file.length) throw new Error("no file");

    const artURL = await imageUpload(file)
    const ipfsMetadata = await metadateUpload(artURL, name, description)

    const tokenId = await mintNFT(ipfsMetadata)

    await listToMarket(tokenId, price)
  };

  return (
    <Container className="p-4 mt-16">
      <Navbar />
      <Grid container spacing={10}>
        <Grid item md={4}>
          <label htmlFor="nftFile" className='block mb-4 font-bold text-lg text-black'>Faça o upload do arquivo PNG/JPG/GIF</label>
          <input id="nftFile" type="file" accept="image/x-png,image/gif,image/jpeg" {...register('file', { required: true })} />
          {imagePreview && (
            <img alt="Imagem do NFT" src={imagePreview} className="my-4 bg-white border shadow" />
          )}
        </Grid>

        <Grid item md={8}>
          <InputEdit grid={12} name="name" control={control} label="Nome da arte" />
          <InputEdit grid={12} name="price" control={control} label="Preço da arte em ETH" type="number" />
          <InputEdit grid={12} control={control} label="Descrição da arte" multiline rows={3} name="description" />
          <CreateNFTButton variant="contained" onClick={() => handleSubmit(onSubmit)()}>
            Criar NFT
          </CreateNFTButton>
        </Grid>
      </Grid>
    </Container>
  )
}