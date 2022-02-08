import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { nftmarketaddress, nftaddress } from '../hardhat/config'

import Market from '../hardhat/artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../hardhat/artifacts/contracts/CreateNFT.sol/CreateNFT.json'
import { WalletContext } from 'context/WalletContext'
import Navbar from 'components/Navbar'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container';

export default function MyAssets() {
  const { wallet } = useContext(WalletContext)

  const approveHandle = async (tokenId: string) => {
    const contract = new ethers.Contract(nftaddress, NFT.abi, wallet.signer)

    const transaction = await contract.approveNFTHandle(nftmarketaddress, tokenId)
    const tx = await transaction.wait()
    const event = tx.events[0]

    console.log("APPROVE", event)
  }


  const listToMarket = async (tokenId: string, price: string = '7000') => {
    if (!tokenId || !price) throw new Error('no token id or pricing');

    await approveHandle(tokenId)

    const mktPrice = ethers.utils.parseUnits('7000', 'ether')

    const contract = new ethers.Contract(nftmarketaddress, Market.abi, wallet.signer)
    const transaction = await contract.createMarketItem(nftaddress, tokenId, mktPrice)
    const tx = await transaction.wait()

    const event = tx.events[0]

    console.log(event)
  }

  const [nfts, setNfts] = useState([])

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      // network: "mainnet",
      // cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()

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
      }
      return item
    }))

    console.log('items', items)
    setNfts(items)
  }
  return (
    <Container className="p-4 mt-16">
      <Navbar />
      <div className="flex justify-center">
        {
          nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" />
              Valor pago - {nft.price} Eth
              <button onClick={() => listToMarket(nft?.tokenId)}>Revender</button>
            </div>
          ))
        }
      </div>
    </Container>
  )
}