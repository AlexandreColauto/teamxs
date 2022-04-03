import React, { useState, useEffect } from "react";
import Link from "next/link";
const Moralis = require("moralis");
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { NextPage } from "next";
const ROUTE_POST_ID = "/explorer/[id]";

const Header: NextPage = () => {
  const marketAddress = "0x47bB10F98034Ba0b06037601106b0793972816BD";
  const {
    authenticate,
    isAuthenticated,
    user,
    isWeb3Enabled,
    enableWeb3,
    web3,
  } = useMoralis();

  useEffect(() => {
    tryWeb3();
  }, []);

  const tryWeb3 = () => {
    !isWeb3Enabled ? enableWeb3() : null;
  };
  async function login() {
    console.log(isAuthenticated);
    if (!user) {
      const user = await authenticate({
        signingMessage: "Log in using Moralis",
      });
    }
  }

  return (
    <div>
      <nav
        className="navbar"
        role="navigation"
        aria-label="main navigation"
        style={{ boxShadow: "0px 15px 30px rgba(62, 19, 77, 0.09)" }}
      >
        <div className="navbar-brand">
          <Link href="/">
            <a className="navbar-item">Logo</a>
          </Link>
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <Link href="/createcollection">
                <div className="button is-white">Create Collection</div>
              </Link>
            </div>
            <div className="navbar-item">
              <Link href="/mint">
                <div className="button is-white">Mint</div>
              </Link>
            </div>
            <div className="navbar-item">
              <Link href="/explore">
                <div className="button is-white">Explore</div>
              </Link>
            </div>
            <div className="navbar-item">
              <Link href="/creatorsdashboard">
                <div className="button is-white ">
                  <span className="icon">
                    Dashboard
                    <i className="fas fa-user" />
                  </span>
                </div>
              </Link>
            </div>
            <div className="navbar-item">
              <button className="button is-white" onClick={login}>
                <span className="icon">
                  <i className="fas fa-wallet" />
                </span>
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
