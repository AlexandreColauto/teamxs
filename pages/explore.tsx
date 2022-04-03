import React, { useEffect, useState } from "react";
import useFetchMarket from "../src/hooks/useFetchMarket";
import { useMoralis } from "react-moralis";
import Moralis from "moralis/types";
import useFetchCollection from "../src/hooks/useFetchCollection";
import useBuyNFT from "../src/hooks/useBuyNFT";

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
type props = {
  marketId: number;
  price: string;
};
function explore() {
  const [fetchItems, filterItems] = useFetchMarket();
  const { isWeb3Enabled } = useMoralis();
  const [collectionList, setCollectionList] = useState<
    Moralis.Object<Moralis.Attributes>[]
  >([]);
  const [collection, setCollection] =
    useState<Moralis.Object<Moralis.Attributes>>();
  const [, fetchAll] = useFetchCollection();
  const [marketItms, setMarketItms] = useState<marketItms[]>();
  const [metadata, setMetadata] = useState<metadata[]>();
  const [filtered_marketItms, setfiltered_MarketItms] =
    useState<marketItms[]>();
  const [filtered_metadata, setfiltered_Metadata] = useState<metadata[]>();
  const buy = useBuyNFT();

  useEffect(() => {
    getItems();
    getCollections();
  }, [isWeb3Enabled]);

  const getCollections = async () => {
    const [_collections] = await fetchAll();
    if (!_collections) return;
    setCollectionList(_collections);
  };

  async function picklistChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const collectionName = e.target.value;
    console.log(collectionName);
    if (collectionName === "All Collections") {
      setCollection(undefined);
      return;
    }
    if (!marketItms || !metadata) return;
    const selectedCollection = collectionList.filter((item) => {
      return item.get("name") === collectionName;
    });
    const [_marketItms, _metadata] = filterItems(
      selectedCollection[0].get("collectionAddress"),
      marketItms,
      metadata
    );
    setfiltered_Metadata(_metadata);
    setfiltered_MarketItms(_marketItms);
  }
  const getItems = async () => {
    const answer = await fetchItems();
    if (!answer) return;
    const [_marketItms, _metadata] = answer;
    setMarketItms(_marketItms);
    setMetadata(_metadata);
    setfiltered_Metadata(_metadata);
  };
  async function handleBuy(nftToBuy: props) {
    const callback = () => {
      console.log("all righ!");
    };
    await buy({ ...nftToBuy, callback });
  }

  return (
    <div>
      explore
      <select
        onChange={(e) => {
          picklistChange(e);
        }}
      >
        <option>All Collections</option>
        {collectionList.map((collection, i) => (
          <option key={i}>{collection.get("name")}</option>
        ))}
      </select>
      <div>
        {filtered_metadata &&
          filtered_metadata.map((nft, i) => (
            <div key={i} className="column  is-one-third">
              <div className="tile is-parent">
                <div className="card tile is-child box">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={nft.image} alt="Placeholder image" />
                    </figure>
                  </div>
                  <div>
                    <div className="title is-4">{nft.name}</div>
                    <p>Price: {nft.price} Matic</p>
                    <button
                      className="button"
                      onClick={() => {
                        handleBuy(nft);
                      }}
                    >
                      {" "}
                      Buy{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default explore;
