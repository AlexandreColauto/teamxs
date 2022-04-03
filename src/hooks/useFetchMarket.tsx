import { useMoralis } from "react-moralis";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import axios from "axios";

interface marketItms {
  collectionAddress: string;
  itemId: string;
  nftAddress: string;
  owner: string;
  price: string;
  sold: boolean;
  tokenId: string;
}

interface metadata {
  description: string;
  id: string;
  image: string;
  marketId: number;
  name: string;
  price: string;
  collectionAddress: string;
}

type fetchItems = (
  collectionAddress?: string | undefined
) => Promise<[marketItms[], metadata[]] | undefined>;
type filterNFTs = (
  collectionAddr: string,
  collections: marketItms[],
  metadata: metadata[]
) => [marketItms[], metadata[]];

const useFetchMarket = (): [fetchItems, filterNFTs] => {
  const { Moralis, isWeb3Enabled, isWeb3EnableLoading } = useMoralis();

  const fetchItems = async (
    collectionAddress?: string
  ): Promise<[marketItms[], metadata[]] | undefined> => {
    console.log(isWeb3EnableLoading + "" + isWeb3Enabled);
    if (!isWeb3Enabled) return;
    const marketAddress = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS;
    const userAddress = await Moralis.account;
    if (!marketAddress || !userAddress) return;

    const fetchItems = {
      contractAddress: marketAddress,
      functionName: "fetchAllCollection",
      abi: NFTMarket.abi,
    };
    const marketItms: any = await Moralis.executeFunction(fetchItems);
    const nftsMeta = await setNFTMetadata(marketItms);
    return [marketItms, nftsMeta];
  };

  async function setNFTMetadata(nftsMeta: marketItms[]) {
    return await Promise.all(
      nftsMeta.map(async (nft) => {
        const getURI = {
          contractAddress: nft.nftAddress,
          functionName: "uri",
          abi: NFT.abi,
          params: { "": nft.tokenId },
        };

        const markeet: any = await Moralis.executeFunction(getURI);
        const tokenIdString = nft.tokenId.toString().padStart(64, "0");
        const uri = markeet.replace("{id}", tokenIdString);
        const _metadata = await axios.get(uri);
        const metadata: metadata = _metadata.data;
        metadata.id = nft.tokenId;
        metadata.price = Moralis.Units.FromWei(nft.price);
        metadata.marketId = parseInt(nft.itemId);
        metadata.collectionAddress = nft.nftAddress;
        return metadata;
      })
    );
  }

  const filterNFTs: filterNFTs = (
    collectionAddr: string,
    collections: marketItms[],
    metadata: metadata[]
  ) => {
    const _collections = collections.filter((item) => {
      return item.collectionAddress === collectionAddr;
    });
    const _metadata = metadata.filter((item) => {
      return item.collectionAddress === collectionAddr;
    });
    return [_collections, _metadata];
  };
  return [fetchItems, filterNFTs];
};

export default useFetchMarket;
