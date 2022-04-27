import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import { NextPage } from "next";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faCircleDot } from "@fortawesome/free-solid-svg-icons";
const Header: NextPage = () => {
  const marketAddress = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS;
  const {
    authenticate,
    isAuthenticated,
    user,
    isWeb3Enabled,
    enableWeb3,
    web3,
    chainId,
    Moralis,
  } = useMoralis();
  const [networkMsg, setNetworkMsg] = useState(false);
  const [chainIdUser, setchainIdUser] = useState("");
  const chainIdEnv = process.env.NEXT_PUBLIC_CHAIN_ID;

  useEffect(() => {
    tryWeb3();
  }, [isAuthenticated]);

  useEffect(() => {
    const unsubscribe = Moralis.onChainChanged((chain: any) => {
      console.log(chain);
      setchainIdUser(chain);
      verifyNetwork();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    verifyNetwork();
  }, [chainId]);

  const tryWeb3 = async () => {
    !isWeb3Enabled && isAuthenticated ? enableWeb3() : null;
  };
  async function login() {
    tryWeb3();
    if (!user) {
      const user = await authenticate({
        signingMessage: "Log in using Moralis",
      });
    }
  }

  async function verifyNetwork() {
    console.log(chainId);
    if (!chainId) return;
    if (chainId !== chainIdEnv) {
      setNetworkMsg(true);
    } else {
      setNetworkMsg(false);
    }
  }

  const changeNetwork = async () => {
    try {
      if (!chainIdEnv) return;
      await Moralis.switchNetwork(chainIdEnv);
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          const chainId = "0x89";
          const chainName = "Polygon Mainnet";
          const currencyName = "MATIC";
          const currencySymbol = "MATIC";
          const rpcUrl = "https://polygon-rpc.com";
          const blockExplorerUrl = "https://polygonscan.com/";

          await Moralis.addNetwork(
            chainId,
            chainName,
            currencyName,
            currencySymbol,
            rpcUrl,
            blockExplorerUrl
          );
        } catch (error: any) {
          console.log(error.message);
        }
      }
    }
  };

  return (
    <div>
      <nav
        className="flrelative
        w-full
        flex flex-wrap
        items-center
        justify-between
        py-4
        bg-[#F2F2F2]
        text-gray-500
        hover:text-gray-700
        focus:text-gray-700
        shadow-lg
        navbar navbar-expand-lg navbar-light"
        role="navigation"
        aria-label="main navigation"
        style={{ boxShadow: "0px 15px 30px rgba(62, 19, 77, 0.09)" }}
      >
        {networkMsg && (
          <div className=" flex w-full">
            <div className="mx-auto bg-red-500 rounded-xl px-2 text-white bg-opacity-40 justify-content-center flex mb-0">
              <button
                className="delete"
                onClick={() => setNetworkMsg(false)}
              ></button>
              <button
                onClick={() => changeNetwork()}
                className="button is-warning"
              >
                <p className="title is-5">
                  Look&apos;s like you are in a different network than Polygon
                  Mainnet, click here and let me change for you.🤗
                </p>{" "}
              </button>
            </div>
          </div>
        )}
        <div className=" mr-10"></div>
        <div className="flow-root">
          <div className="float-left">
            <Link href="/">
              <Image src="/logo.png" alt="logo" width="72" height="72" />
            </Link>
          </div>

          <div className="float-right mt-4 mx-6">
            <Link href="/">
              <p className="text-3xl text-[#344D34] font-black cursor-pointer">
                NFT Marketplace
              </p>
            </Link>
          </div>
        </div>
        <div className="ml-auto ">
          <Link href="/explore">
            <p className="text-lg mx-6 mt-1 font-bold text-[#344D34] cursor-pointer hover:drop-shadow hover:scale-105">
              Explore
            </p>
          </Link>
        </div>
        <Link href="/create">
          <p className="text-lg mx-6 mt-1 font-bold cursor-pointer text-[#344D34] hover:drop-shadow hover:scale-105">
            Create
          </p>
        </Link>
        <button
          className="mx-6 mt-1 cursor-pointer hover:drop-shadow hover:scale-105"
          onClick={login}
        >
          <span className="w-25">
            <FontAwesomeIcon
              icon={faWallet}
              className="w-7 h-7 text-[#344D34]"
            />
          </span>
        </button>
        <Link href="/creatorsdashboard">
          <div className="mx-6 cursor-pointer hover:drop-shadow hover:scale-105 text-[#344D34]">
            <span className="icon">
              <FontAwesomeIcon icon={faCircleDot} className="w-7 h-7" />
            </span>
          </div>
        </Link>
        <div className=" ml-2"></div>
        <div></div>
      </nav>
    </div>
  );
};

export default Header;
