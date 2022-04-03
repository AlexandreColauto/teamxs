import Moralis from "moralis/types";
import React from "react";
import { useMoralis } from "react-moralis";

interface dictionary {
  [key: string]: string;
}

type fetchCollection = [Moralis.Object<Moralis.Attributes>[], dictionary];

function useFetchCollection() {
  const { enableWeb3, Moralis, isWeb3Enabled, isWeb3EnableLoading } =
    useMoralis();
  const fetchUserCollection = async (): Promise<fetchCollection | []> => {
    console.log(isWeb3Enabled);
    console.log(isWeb3EnableLoading);
    !isWeb3Enabled ? await enableWeb3() : null;
    if (!isWeb3Enabled) return [];

    const Collection = Moralis.Object.extend("collection");
    const query = new Moralis.Query(Collection);
    const address = Moralis.account;
    query.equalTo("owner", address);
    const results = await query.find();

    const colDictionary: dictionary = {};

    const _colAddr = results.map((col) => {
      console.log(col);
      const colName = col.get("name");
      const colAdd: string = col.get("collectionAddress").toLowerCase();
      console.log(colName);
      colDictionary[colAdd] = colName;
      return colAdd;
    });

    return [results, colDictionary];
  };

  const fetchAllCollections = async (): Promise<fetchCollection | []> => {
    console.log(isWeb3Enabled);
    console.log(isWeb3EnableLoading);
    !isWeb3Enabled ? await enableWeb3() : null;
    if (!isWeb3Enabled) return [];

    const Collection = Moralis.Object.extend("collection");
    const query = new Moralis.Query(Collection);
    const address = Moralis.account;
    const results = await query.find();

    const colDictionary: dictionary = {};
    console.log(results);
    const _colAddr = results.map((col) => {
      console.log(col);
      const colName = col.get("name");
      const colAdd: string = col.get("collectionAddress").toLowerCase();
      console.log(colName);
      colDictionary[colAdd] = colName;
      return colAdd;
    });

    return [results, colDictionary];
  };

  return [fetchUserCollection, fetchAllCollections];
}

export default useFetchCollection;
