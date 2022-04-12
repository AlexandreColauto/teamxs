import React, { useEffect, useState } from "react";
import Toggle from "../src/components/Toggle";
import CreateCollection from "./createcollection";
import Mint from "./mint";

function Create() {
  const [collection, setColection] = useState(false);

  return (
    <div className="w-full mt-6 pb-24">
      <div className="justify-items-center items-center flex flex-col pt-5">
        <p className="text-6xl font-bold text-[#E8C39C]">Create a New</p>
        <p className="text-6xl font-bold text-[#E8C39C]">Collection or Item</p>
      </div>
      <div className=" justify-center flex mt-16">
        <Toggle callback={setColection} />
      </div>
      <div className="hidden "></div>
      {!collection ? <CreateCollection /> : <Mint />}
    </div>
  );
}

export default Create;
