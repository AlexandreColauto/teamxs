import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import axios from "axios";
import useFetchCollection from "./useFetchCollection";
import { useCallback, useMemo, useState } from "react";
import Moralis from "moralis/types";

interface metadata {
  address: string;
  collection?: string;
  description: string;
  id: string;
  image: string;
  name: string;
  price?: string;
  marketId?: number;
  fee?: number;
}
function useLoadNFTs() {
  const Web3Api = useMoralisWeb3Api();
  const [, fetch] = useFetchCollection();
  const { isAuthenticated, Moralis, chainId } = useMoralis();

  const fetchNFTs = async (): Promise<
    | [metadata[], Moralis.Object<Moralis.Attributes>[], boolean]
    | [undefined, undefined, boolean]
  > => {
    const useraddress = Moralis.account;
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
    const [collections, addressDic, loading] = await fetch();

    if (!useraddress || !collections) return [, , loading];

    const options: typeof Moralis.Web3API.account.getNFTs.arguments = {
      chain: chainId,
      address: useraddress,
    };
    const _userNFTsCollections = await Moralis.Web3API.account.getNFTs(options);
    if (!_userNFTsCollections) return [, , loading];
    if (!_userNFTsCollections.result) return [, , loading];
    const userNFTsCollections = _userNFTsCollections.result.filter((nft) => {
      return Object.keys(addressDic).includes(nft.token_address.toLowerCase());
    });

    const nftsMeta: metadata[] = [];
    await Promise.all(
      userNFTsCollections.map(async (nft) => {
        if (!nft.token_uri) return;
        try {
          console.log(nft.token_uri);
          const metadata = await axios.get(nft.token_uri);
          metadata.data.collection = addressDic
            ? addressDic[nft.token_address]
            : "";
          metadata.data.address = nft.token_address;
          metadata.data.id = nft.token_id;
          nftsMeta.push(metadata.data);
        } catch (err) {
          const dataPlaceHolder = {
            address: nft.token_address,
            id: nft.token_id,
            description: "Not Available",
            image: "/logo.png",
            name: "Not Available",
          };
        }
      })
    );

    return [nftsMeta, collections, loading];
  };
  return fetchNFTs;
}

export type { metadata };

export default useLoadNFTs;
