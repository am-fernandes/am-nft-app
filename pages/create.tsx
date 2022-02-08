/* eslint-disable @next/next/no-img-element */
import Container from '@mui/material/Container';
import Navbar from 'components/Navbar'
import { useState, useContext, useEffect } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { WalletContext } from 'context/WalletContext'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form';
import { InputEdit } from 'components/Form/FormComponents'
import { DefaultButton } from 'components/Button'
import styled from '@emotion/styled';

const CreateNFTButton = styled(DefaultButton)`
  width: 50%;
  margin: 0 25%;
  background-color: #000;
  &:hover {
    background: rgba(0, 0, 0, 0.85);
  }
`

//@ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

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
  const methods = useForm<any>({});

  const { handleSubmit, control, register, watch } = methods;

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

  const onSubmit = (data: any) => console.log(data);


  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  // const router = useRouter()
  const { wallet } = useContext(WalletContext)

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
    // router.push('/')
  }

  return (
    <Container className="p-4 mt-16">
      <Navbar />
      <Grid container spacing={10}>
        <Grid item md={4}>
          <label htmlFor="nftFile" className='block mb-4 font-bold text-lg text-black'>Faça o upload do arquivo PNG/JPG/GIF</label>
          <input id="nftFile" type="file" accept="image/x-png,image/gif,image/jpeg" {...register('file', { required: true })} />
          {imagePreview && (
            // <div className="my-4 p-4 border shadow bg-gray-200 rounded-xl w-full">
            <img alt="Imagem do NFT" src={imagePreview} className="my-4 bg-white border shadow" />
            // </div>
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