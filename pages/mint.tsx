import React, { ChangeEvent, useEffect, useState } from "react";
import useMint from "../src/hooks/useMint";
import useFetchCollection from "../src/hooks/useFetchCollection";
import Moralis from "moralis";
import Link from "next/link";
import { useMoralis } from "react-moralis";

const Mint = () => {
  const [imgUrl, setImgUrl] = useState("");
  const [formInput, updateFormInput] = useState({
    name: "Name",
    description: "",
  });
  const [modalValue, setModalValue] = useState("");
  const [sucessMessage, setSucessMessage] = useState(false);
  const [collectionList, setCollectionList] = useState<
    Moralis.Object<Moralis.Attributes>[]
  >([]);
  const [collection, setCollection] =
    useState<Moralis.Object<Moralis.Attributes>>();
  const [saveFile, mint] = useMint();
  const [fetch] = useFetchCollection();
  const { isAuthenticated, Moralis, isWeb3Enabled, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    getCollections();
  }, [isWeb3Enabled]);

  const getCollections = async () => {
    const [_collections] = await fetch();
    if (!_collections) return;
    setCollectionList(_collections);
    setCollection(_collections[0]);
  };

  async function picklistChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const collectionName = e.target.value;
    for (let i = 0; i < collectionList.length; i++) {
      if (collectionList[i].get("name") === collectionName) {
        setCollection(collectionList[i]);
      }
    }
  }
  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const data = e?.target?.files[0];
    const fileURL = await saveFile(data);
    setImgUrl(fileURL);
  }

  const success = () => {
    setImgUrl("");
    updateFormInput({ name: "", description: "" });
    if (!sucessMessage) {
      setSucessMessage(true);
      setTimeout(function () {
        setSucessMessage(false);
      }, 5000);
    }
  };
  const executeMint = async () => {
    if (!collection || !formInput) return;
    const { name, description } = formInput;
    const collectionName = collection.get("name");
    const address = collection.get("collectionAddress");
    console.log(address);
    console.log(collectionName);
    await mint({
      name,
      description,
      imgUrl,
      setModalValue,
      success,
      address,
      collectionName,
    });
  };

  return (
    <div>
      {sucessMessage && (
        <div className="notification is-success is-justify-content-center is-flex">
          <button
            className="delete"
            onClick={() => setSucessMessage(false)}
          ></button>
          <p className="title is-4">Success! 🎉🎉🎉</p>
        </div>
      )}

      <div className="mt-6" style={{ marginBottom: "13rem" }}>
        <div className="columns ">
          <div className="column is-6 is-offset-3">
            <div className="title is-2">Create new item</div>
            <p
              className="help"
              style={{
                fontSize: "xx-small",
                position: "relative",
                bottom: "12px",
              }}
            >
              <span style={{ color: "red" }}>*</span> Required fields{" "}
            </p>
            <br />
            <label className="label">
              Asset <span style={{ color: "red" }}>*</span>
            </label>
            <p className="help"> Img, Gif or Video to tokenize.</p>
            {imgUrl && (
              <img className="rounded mt-4" width="350" src={imgUrl} />
            )}
            <div className="file is-boxed">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  name="resume"
                  onChange={onChange}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">Choose a file…</span>
                </span>
              </label>
            </div>
            <br />
            <div className="field">
              <label className="label">
                Item Name <span style={{ color: "red" }}>*</span>
              </label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={formInput.name}
                  placeholder="Crypto something..."
                  onChange={(e) =>
                    updateFormInput({ ...formInput, name: e.target.value })
                  }
                />
              </div>
            </div>
            <br />
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={formInput.description}
                  placeholder="What's the history of your NFT"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>
            <br />
            <label className="label">
              Collection <span style={{ color: "red" }}>*</span>
            </label>
            {!!collectionList.length && (
              <div>
                <div className="field">
                  <div className="control">
                    <div className="select">
                      <select
                        onChange={(e) => {
                          picklistChange(e);
                        }}
                      >
                        {collectionList.map((collection, i) => (
                          <option key={i}>{collection.get("name")}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <br />
                <div className="field is-grouped">
                  <div className="control">
                    <button
                      className="button is-primary is-large"
                      onClick={executeMint}
                    >
                      Mint
                    </button>
                  </div>
                </div>
              </div>
            )}{" "}
            {!collectionList.length && (
              <div>
                <p>Please create a collection first</p>
                <div className="control mt-2">
                  <Link href="/createcollection">
                    <button className="button  is-small">
                      Create Collection
                    </button>
                  </Link>
                </div>
                <br />
                <br />
                <div className="control">
                  <button className="button is-primary is-large" disabled>
                    Mint
                  </button>
                </div>
              </div>
            )}
            <br />
            <br />
          </div>

          <br />
          <br />
          <div className={`modal ${modalValue}`} id="modal-list">
            <div className="modal-background"></div>
            <div
              className="is-flex is-justify-content-center modal-content"
              style={{ textAlign: "center", background: "white" }}
            >
              <div>
                <a className="button mt-6 is-large is-loading is-ghost"></a>
                <p className="title is-4 mb-6">
                  Processing, do not refresh the page.
                </p>
              </div>
            </div>
            <button
              className="modal-close is-large"
              aria-label="close"
              onClick={() => setModalValue("")}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
