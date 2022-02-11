import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useWallet from 'hooks/useWallet'
import { marketContract, nftContract, nftaddress, nftmarketaddress } from 'shared/contracts/instance'

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


  const listToMarket = async (tokenId: string, price: string = '7000') => {
    if (!tokenId || !price) throw new Error('no token id or pricing');

    const { signer } = await getConnection()

    await approveHandle(tokenId)

    const mktPrice = ethers.utils.parseUnits('7000', 'ether')

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
      }
      return item
    }))

    console.log('items', items)
    setNfts(items)
  }
  return (
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
  )
}