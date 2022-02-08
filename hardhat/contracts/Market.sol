// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
// Pesquisar sobre essa lib Reentrancy Guard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";


// PESQUISAR DIFERENÇA E VANTAGENS ENTRE UINT X UINT256
// ENTENDER TODOS OS ATRIBUTOS DO "MSG"

// LIB REENTRANCY
contract NFTMarket is ReentrancyGuard {
  // CONTADORES PARA MANIPULAR ARRAYS DE VENDA (SOLID NÃO TEM ARRAYS DINAMICOS)
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;
  // dono do contrato
  address payable owner;
  // preço de listagem do token
  // uint listingPrice = 0.0 ether;

  address payable mktplaceAddress = payable(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199);

  // set owner
  constructor() {
    owner = payable(msg.sender);
  }

  // Estrutura para cada item listado no mercado
  struct MarketItem {
    uint itemId;
    address nftContract;
    uint tokenId;
    address payable creator;
    address payable seller;
    address payable owner;
    uint price;
    bool sold;
  }

  // Pesquisar sobre o que é um mapping em solidity

  mapping(uint => MarketItem) private idToMarketItem;

  // Pesquisar sobre events em solidity
  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint indexed tokenId,
    address creator,
    address seller,
    address owner,
    uint price,
    bool sold
  );

  // /* Returns the listing price of the contract */
  // function getListingPrice() public view returns (uint) {
  //   return listingPrice;
  // }

  /* Places an item for sale on the marketplace */
  // Pesquisar o que seria o tipo nonReentrant//
  // pesquisar sobre reentrant atack

  function createMarketItem(
    address nftContract,
    uint tokenId,
    uint price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    // require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint itemId = _itemIds.current();
  
    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(msg.sender),
      payable(address(0)), // ajustando dono como um endereço vazio, pois ao disponibilizar para a venda o NFT não tem dono
      price,
      false
    );

    // transferindo o NFT para esse próprio contrato 
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    
    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      msg.sender,
      address(0), 
      price,
      false
    );
  }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
    address nftContract,
    uint itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");

    uint256 marketFee = SafeMath.div(msg.value, 100);
    uint256 creatorFee = SafeMath.mul(SafeMath.div(msg.value, 100), 5);

    uint256 creatorValue = SafeMath.sub(msg.value, SafeMath.add(marketFee, creatorFee));

    // valor é transferido aqui!!!
    // TRANSFERINDO O VALOR PARA O VENDEDOR
    // idToMarketItem[itemId].seller.transfer(msg.value);
    idToMarketItem[itemId].seller.transfer(creatorValue);
    
    /// FEE PARA O MARKETPLACE
    mktplaceAddress.transfer(marketFee);

    /// FEE PARA O CRIADOR
    idToMarketItem[itemId].creator.transfer(creatorFee);
    

    // transferir a propriedade do token para o comprador
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    // alterar owner do NFT
    idToMarketItem[itemId].owner = payable(msg.sender);
    // alterar status para vendido
    idToMarketItem[itemId].sold = true;
    // incrementar numero de itens vendidos
    _itemsSold.increment();

    console.log("owener: %s", owner);
    // pagar o dono do contrato, transferindo a comissão
    // payable(owner).transfer(listingPrice);
  }

  /* Returns all unsold market items */
  // Persquisar sobre o memory!!!!
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);

    for (uint i = 0; i < itemCount; i++) {
      /// verificar se o item não foi vendido, buscando pelo endereço vazio
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        // STORAGE TYPE
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns onlyl items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;
    // pega o tamanho do array (número de items do usuário)
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchCreatedByAddress(address userAddress) public view returns (MarketItem[] memory) {
    uint total = _itemIds.current();
    uint totalCreated = 0;

    uint i = 0;
    uint createdIndex = 0;

    for (i = 1; i <= total; i = SafeMath.add(i, 1)) {
      if (idToMarketItem[i].creator == userAddress) {
        totalCreated = SafeMath.add(totalCreated, 1);
      }
    }

    MarketItem[] memory items = new MarketItem[](totalCreated);

    for (i = 1; i <= total; i = SafeMath.add(i, 1)) { 
      if (idToMarketItem[i].creator == userAddress) {
        MarketItem memory currentItem = idToMarketItem[i];

        items[createdIndex] = currentItem;

        createdIndex = SafeMath.add(createdIndex, 1);
      }
    }

    return items;
  }

}