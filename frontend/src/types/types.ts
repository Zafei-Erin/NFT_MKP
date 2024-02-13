export type NFT = {
  id: number;
  tokenId: number;
  uri: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  listed: boolean;
  owner: User;
  creator: User;
  creatorAddress: string;
  ownerAddress: string;
  offers: Offer[];
  sales: Sale[];
};

export type User = {
  id: number;
  address: string;
  createdNFTs: NFT[];
  ownNFTs: NFT[];
  offers: Offer[];
};

export type Offer = {
  id: number;
  price: number;
  createAt: Date;
  expireAt: Date;
  from: User;
  fromAddress: string;
  nft: NFT;
  nftId: number;
};

export type Sale = {
  id: number;
  price: number;
  date: Date;
  nft: NFT;
  nftId: number;
};

export type EthPriceType = {
  ethusd: string;
};
