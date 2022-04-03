import { useMoralis } from "react-moralis";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
type props = {
  marketId: number;
  price: string;
  callback: () => void;
};

const BuyNFT = () => {
  const { Moralis, isWeb3Enabled } = useMoralis();
  const buy = async (props: props) => {
    !isWeb3Enabled ? await Moralis.enableWeb3() : null;
    const marketAddress = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS;
    const userAddress = await Moralis.account;
    if (!marketAddress || !userAddress) return;

    const { marketId, price, callback } = props;

    const listItem = {
      contractAddress: marketAddress,
      functionName: "performATransaction",
      abi: NFTMarket.abi,
      params: {
        itemId: marketId,
      },
      msgValue: Moralis.Units.ETH(price),
    };
    const listTransaction: any = await Moralis.executeFunction(listItem);
    await listTransaction.wait();

    console.log("all right!");
    callback();
  };

  return buy;
};

export default BuyNFT;
