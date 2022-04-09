import React, { useEffect, useState } from "react";
import useFetchMarket from "../src/hooks/useFetchMarket";
import { useMoralis } from "react-moralis";
import Moralis from "moralis/types";
import useFetchCollection from "../src/hooks/useFetchCollection";
import useBuyNFT from "../src/hooks/useBuyNFT";
import NFTTile from "../src/components/NFTTile";
import { useQuery } from "react-query";

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
  marketId?: number;
  name: string;
  price?: string;
  address: string;
}

function Explore() {
  const [fetchItems, filterItems] = useFetchMarket();
  const { isWeb3Enabled } = useMoralis();
  const [collectionList, setCollectionList] = useState<
    Moralis.Object<Moralis.Attributes>[]
  >([]);
  const [, fetchAll] = useFetchCollection();
  const [marketItms, setMarketItms] = useState<marketItms[]>();
  const [metadata, setMetadata] = useState<metadata[]>();
  const [filtered_metadata, setfiltered_Metadata] = useState<metadata[]>();
  const buy = useBuyNFT();
  const { isLoading } = useQuery("collection", {
    enabled: isWeb3Enabled,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    getItems();
  }, [isWeb3Enabled]);

  useEffect(() => {
    getCollections();
  }, [isLoading]);
  const getCollections = async () => {
    if (!isWeb3Enabled) return;
    const [_collections] = await fetchAll();
    if (!_collections) return;
    setCollectionList(_collections);
  };

  async function picklistChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const collectionName = e.target.value;
    console.log(collectionName);
    if (collectionName === "All Collections") {
      setfiltered_Metadata(metadata);
      return;
    }
    if (!marketItms || !metadata) return;
    const [_marketItms, _metadata] = filterItems(
      collectionName,
      marketItms,
      metadata
    );
    setfiltered_Metadata(_metadata);
  }
  const getItems = async () => {
    if (!isWeb3Enabled) return;
    const answer = await fetchItems();
    if (!answer) return;
    const [_marketItms, _metadata] = answer;
    setMarketItms(_marketItms);
    setMetadata(_metadata);
    setfiltered_Metadata(_metadata);
  };
  async function handleBuy(nftToBuy: metadata) {
    const callback = () => {
      console.log("all righ!");
    };
    await buy({ ...nftToBuy, callback });
  }

  return (
    <div className="pb-16">
      <p className="text-6xl  font-bold text-center py-14">
        Explore Collections
      </p>
      <div className="flex mt-4 bg-black w-8/12 mb-8 mx-auto border border-secondary rounded overflow-hidden">
        <span className="text-sm text-white  px-4 py-2 bg-secondary whitespace-no-wrap">
          Collection:
        </span>
        <select
          className=" py-2 w-full  bg-white"
          onChange={(e) => {
            picklistChange(e);
          }}
        >
          <option>All Collections</option>
          {collectionList.map((collection, i) => (
            <option key={i} value={collection.get("collectionAddress")}>
              {collection.get("name")}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div className="md:flex justify-center">
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {filtered_metadata &&
              filtered_metadata.map((nft, i) => (
                <NFTTile key={i} nft={nft} callback={handleBuy} button="Buy" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
