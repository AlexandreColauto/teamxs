import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="bg-secondary pb-16">
      <div className="flex p-10 justify-between h-10/12 items-center leading-loose ">
        <div>
          <p className="text-7xl font-bold ">
            Collect, Sell or <br />
            Create <span className="text-white">Cat NFTs</span>
          </p>
          <p className="text-[#2c5878] mt-8 font-thin text-lg">
            A marketplace for cat lovers that raises funds for rescues and makes{" "}
            <br />
            the world a <em>meower</em> place. Oh, and get a free NFT when you
            make a <br />
            donation (tax deductible) of $50 or more to your favourite rescue.
            <br />
          </p>
          <div className="mt-10">
            <Link href="/explore">
              <button className="bg-primary text-white py-2 px-8 font-bold rounded-2xl hover:bg-normal">
                Explore Collections
              </button>
            </Link>
            <button className="text-primary  py-2 px-8 font-bold rounded-2xl hover:text-white">
              Why this matters
            </button>
          </div>
        </div>
        <div>
          <Image src="/logo.png" alt="logo" width="380" height="380" />
        </div>
      </div>
    </div>
  );
};

export default Home;
