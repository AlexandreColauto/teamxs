import React, { useEffect, useState } from "react";
import useLoadNFTs from "../src/hooks/useLoadNFTs";
import ModalListNFT from "../src/components/ModalListNFT";
import type { metadata } from "../src/hooks/useLoadNFTs";
import Link from "next/link";
import { useMoralis } from "react-moralis";

function CreatorsDashboard() {
  const { isWeb3Enabled } = useMoralis();
  const fetchNFTs = useLoadNFTs();
  const [userNFTsMetada, setUserNFTsMetada] = useState<metadata[]>();
  const [nftToList, setnftToList] = useState<metadata>();
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    console.log(modalOpen);
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    executeFectchNFTs();
  }, [isWeb3Enabled]);

  const executeFectchNFTs = async () => {
    const _metadata = await fetchNFTs();
    if (!_metadata.length) noNFTS();
    setUserNFTsMetada(_metadata);
  };

  const listNFT = async (nft: metadata) => {
    console.log(nftToList);
    setnftToList(nft);
    toggleModal();
    return <ModalListNFT isOpen={true} toggle={toggleModal} NFTToList={nft} />;
  };

  const noNFTS = () => {};
  return (
    <div>
      <div>
        <div className="mb-6">
          <div className="title is-2">Your NFTs</div>
          {!userNFTsMetada ? (
            <div>
              <div>
                <div className="is-flex is-justify-content-center">
                  <div style={{ textAlign: "center" }}>
                    <p className="title is-4">
                      {" "}
                      You currently have no NFT, you can mint another one.
                    </p>
                    <br />
                    <Link href="/mint">
                      <button className="button"> Mint </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {nftToList && (
                <ModalListNFT
                  isOpen={modalOpen}
                  toggle={() => toggleModal()}
                  NFTToList={nftToList}
                />
              )}
              <div className="column is-flex is-flex-wrap-wrap">
                {userNFTsMetada.map((nft, i) => (
                  <div key={i} className="column  is-one-third">
                    <div className="tile is-parent">
                      <div className="card tile is-child box">
                        <div className="card-image">
                          <figure className="image is-4by3">
                            <img
                              src={nft.image}
                              alt="Placeholder image"
                              hidden
                            />
                          </figure>
                        </div>
                        <div className="card-content">
                          <div className="title is-4">{nft.name}</div>
                          <button
                            className="button"
                            onClick={() => {
                              listNFT(nft);
                            }}
                          >
                            List{" "}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatorsDashboard;
