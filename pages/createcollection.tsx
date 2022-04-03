import React, { ChangeEvent, useState } from "react";
import useCreateCollection from "../src/hooks/useCreateCollection";
const Moralis = require("moralis");

const CreateCollection = () => {
  const [imgUrl, setImgUrl] = useState("");
  const [formInput, updateFormInput] = useState({
    name: "Name",
    description: "",
  });
  const [modalValue, setModalValue] = useState("");
  const [sucessMessage, setSucessMessage] = useState(false);
  const [saveFile, create] = useCreateCollection();
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
  const submitCollection = async () => {
    const { name, description } = formInput;
    await create({
      name,
      description,
      imgUrl,
      setModalValue,
      success,
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
            <div className="title is-2">Create new Collection</div>
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

            <br />
            <div className="field">
              <label className="label">
                Collection Name <span style={{ color: "red" }}>*</span>
              </label>
              <div className="control">
                <input
                  className="input"
                  type="text"
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
            <label className="label">Collection logo </label>
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
            <br />
            <div className="field is-grouped">
              <div className="control">
                <button
                  className="button is-primary is-large"
                  onClick={submitCollection}
                >
                  Create
                </button>
              </div>
              <br />
              <br />
            </div>
          </div>
          <br />
          <br />
        </div>
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
  );
};

export default CreateCollection;
