/* eslint-disable @next/next/no-img-element */
import Container from '@mui/material/Container';
import Navbar from 'components/Navbar'
import { useState, useContext } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { WalletContext } from 'context/WalletContext'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl';

//@ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../hardhat/config'


import NFT from '../hardhat/artifacts/contracts/CreateNFT.sol/CreateNFT.json'
import Market from '../hardhat/artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
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
    <Container style={{ marginTop: 64 }} className='p-4'>
      <Navbar />

      <Grid container spacing={2} sx={{ marginTop: 16, paddingLeft: '20%', paddingRight: '20%' }}>
        <Grid item md={4}>
          <TextField
            sx={{ width: '100%' }}
            placeholder="Nome do NFT"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
        </Grid>

        <Grid item md={4}>
          <TextField
            sx={{ width: '100%' }}
            placeholder="Preço da arte em ETH"
            type="number"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />
        </Grid>

        <Grid item md={4}>
          <TextField
            sx={{ width: '100%' }}
            type="file"
            name="Asset"
            className="my-4"
            onChange={onChange}
          />
        </Grid>

        <Grid item md={12}>
          <TextField
            sx={{ width: '100%' }}
            placeholder="Descrição da arte"
            multiline
            rows={3}
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          />
        </Grid>






        <Grid item md={12}>
          {fileUrl && (
            <img style={{ position: 'relative', left: '50%', transform: 'translateX(-50%)' }} alt="Imagem do NFT" width="150" src={fileUrl} />
          )}
        </Grid>

        <Grid item md={12}>
          <Button variant="contained" color="secondary" onClick={createMarket}>
            Criar NFT
          </Button>
        </Grid>




      </Grid>
    </Container>
  )
}