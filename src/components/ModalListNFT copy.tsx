import React, { Fragment, useEffect, useState } from "react";
import useListNft from "../hooks/useListNFT";
import { Dialog, Transition } from "@headlessui/react";
import type { metadata } from "../hooks/useLoadNFTs";

type props = {
  NFTToList: metadata;
  toggle: () => void;
  isOpen: boolean;
};

function ModalListNFT(props: props) {
  const [modalLoading, setModalLoading] = useState("");
  const [nftPrice, setNftPrice] = useState("");
  const [isOpen, setOpen] = useState(props.isOpen);
  const { NFTToList, toggle } = props;
  const list = useListNft();

  useEffect(() => {
    setOpen(props.isOpen);
    console.log("first");
  }, [props.isOpen]);

  const handleListing = (NFT: metadata) => {
    const callback = () => {
      toggle();
      setModalLoading("");
    };
    const options = {
      collectionAddr: NFT.address,
      id: NFT.id,
      nftPrice,
      callback,
    };
    list(options);
  };

  return (
    <div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          open={isOpen}
          as="div"
          className="fixed z-50 inset-0 overflow-y-auto"
          onClose={props.toggle}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <div className="">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        List Your NFT
                      </Dialog.Title>
                      <div className="title is-4">
                        Do you want to list this NFT?
                      </div>
                      <img src={NFTToList?.image} alt={NFTToList?.name} />
                      <br />
                      <div className="field">
                        <label className="label">
                          Item Price <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            placeholder="1000"
                            onChange={(e) => setNftPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={props.toggle}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleListing(NFTToList)}
                  >
                    List
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default ModalListNFT;
