import { ethers, providers } from "ethers";
import NFT from 'blockchain/artifacts/contracts/CreateNFT.sol/CreateNFT.json'
import Market from 'blockchain/artifacts/contracts/Market.sol/NFTMarket.json'
import { nftaddress, nftmarketaddress } from 'blockchain/config'

const nftContract = (provider: providers.Web3Provider | providers.JsonRpcSigner | providers.JsonRpcProvider): ethers.Contract => {
  if (!provider) throw new Error('no provider to contract')

  return new ethers.Contract(nftaddress, NFT.abi, provider)
}


const marketContract = (provider: providers.Web3Provider | providers.JsonRpcSigner | providers.JsonRpcProvider): ethers.Contract => {
  if (!provider) throw new Error('no provider to contract')

  return new ethers.Contract(nftmarketaddress, Market.abi, provider)
}

export {
  nftContract,
  marketContract,
  nftaddress,
  nftmarketaddress
}