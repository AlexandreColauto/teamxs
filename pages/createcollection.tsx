import React, { ChangeEvent, useState } from "react";
import Processing from "../src/components/Processing";
import ToastError from "../src/components/ToastError";
import ToastSucess from "../src/components/ToastSucess";
import useCreateCollection from "../src/hooks/useCreateCollection";
import { useMoralis } from "react-moralis";

const CreateCollection = () => {
  const [imgUrl, setImgUrl] = useState("");
  const [formInput, updateFormInput] = useState({
    name: "Name",
    description: "",
    fee: "",
  });
  const { isAuthenticated, authenticate } = useMoralis();
  const [isSuccess, setisSuccess] = useState(false);
  const [isError, setisError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saveFile, create] = useCreateCollection();

  const success = () => {
    setImgUrl("");
    updateFormInput({ name: "", description: "", fee: "" });
    setProcessing(false);
    if (!isSuccess) {
      setisSuccess(true);
      setTimeout(function () {
        setisSuccess(false);
      }, 5000);
    }
  };
  const submitCollection = async () => {
    const { name, description, fee } = formInput;
    if (!isAuthenticated) authenticate();
    setProcessing(true);
    const result = await create({
      name,
      description,
      imgUrl,
      fee,
      callback: success,
    });
    if (!result) {
      setProcessing(false);
      if (!isError) {
        setisError(true);
        setTimeout(function () {
          setisError(false);
        }, 5000);
      }
    }
  };

  return (
    <div>
      <div className="mx-auto mt-10 w-1/2 text-center bg-white rounded-xl">
        <div className="p-8 pl-14">
          <p className="text-5xl font-bold text-[#404D3A] my-6">
            Create New Collection
          </p>
          <label className="mt-12 text-2xl font-normal label">
            Collection Name
          </label>
          <div className="">
            <input
              className="rounded bg-inherit border-2 border-[#404D3A] pl-1"
              type="text"
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
            />
          </div>
          <div className="mt-8">
            <label className="text-2xl">Description</label>
            <div className="">
              <input
                className="pl-1 rounded bg-inherit border-2 border-[#404D3A]"
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    description: e.target.value,
                  })
                }
              ></input>
            </div>
          </div>
          <div className="mt-8">
            <label className="text-2xl">Creator Fee (%))</label>
            <div className="">
              <input
                className="pl-1 rounded bg-inherit border-2 border-[#404D3A]"
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    fee: e.target.value,
                  })
                }
              ></input>
            </div>
          </div>
          <button
            className="mt-8 bg-[#404D3A] text-[#E8C39C]  rounded-lg p-2 hover:drop-shadow"
            onClick={submitCollection}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
