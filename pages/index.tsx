import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import useLoadNFTs from "../src/hooks/useLoadNFTs";
import { useEffect } from "react";

const Home: NextPage = () => {
  const fetchNFTs = useLoadNFTs();
  useEffect(() => {
    useFetch();
  }, []);
  const useFetch = async () => {
    console.log("fetch");
    const NFTS = await fetchNFTs();
    console.log(NFTS);
  };
  return (
    <div className={styles.container}>
      <button onClick={fetchNFTs}>Fetch</button>
    </div>
  );
};

export default Home;
