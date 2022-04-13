import { useMoralis } from "react-moralis";
import { putObject } from "../../lib/s3";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import axios from "axios";

type uploadFile = (e: File) => Promise<string>;
interface props {
  name: string;
  description?: string;
  imgUrl?: string | null;
  callback: () => void;
  address: string;
  collectionName: string;
}
type create = (props: props) => Promise<boolean | undefined>;
function useCreateCollection(): [uploadFile, create] {
  const { isAuthenticated, Moralis, authenticate } = useMoralis();

  const mint: create = async (props) => {
    const ethers = Moralis.web3Library;

    const { name, description, imgUrl, callback, address, collectionName } =
      props;
    if (!name || !imgUrl) {
      //alert("Fill the required Information before minting.");
      //return false;
    }
    if (!isAuthenticated) authenticate();

    const currentId = {
      contractAddress: address,
      functionName: "currentId",
      abi: NFT.abi,
    };
    const [_tokenId, _fee] = (await Moralis.executeFunction(currentId)) as any;

    let tokenId = parseInt(_tokenId.toString(), 10) + 1;
    let fee = parseInt(_fee.toString(), 10);

    const mint = {
      contractAddress: address,
      functionName: "mint",
      abi: NFT.abi,
      params: {
        reciever: Moralis.account,
      },
    };
    try {
      const tokenHash: any = await Moralis.executeFunction(mint);

      if (tokenHash) {
        const contentType = "application/json"; // type of file
        const data = JSON.stringify({ name, description, image: imgUrl, fee });
        const tokenIdString = tokenId.toString().padStart(64, "0");
        // setup params for putObject
        const key = collectionName + "/" + tokenIdString + ".json";
        const body = data;
        const payload = {
          key,
          body,
          contentType,
        };

        const resp = await axios.post("/api/upload", payload);
      }
      await tokenHash.wait();
      callback();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const saveFile: uploadFile = async (e) => {
    console.log("uploading file");
    const data = e;
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();
    return file._url;
  };

  return [saveFile, mint];
}
export default useCreateCollection;
