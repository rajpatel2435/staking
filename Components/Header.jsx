import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { MdGeneratingTokens } from "../Components/ReactICON/index";


const Header = ({ page }) => {

  const [tokenBalComp, setTokenBalComp] = useState();

  const navigation = [{
    name: "Home",
    link: "/",

  }, {
    name: "Staking",
    link: "#staking",
  }, {
    name: " Crypto",
    link: "#crypto",
  }, {
    name: "Partners",
    link: "#partners",
  }

  ]
  return (
    <>
    <div className="p-2 max-w-7xl mx-auto">
      <div className="flex justify-between items-center text-white text-2xl">
        <div className="flex gap-2  items-center"> 
          <div> <img src="/img/logo.svg" alt="logo" /></div> 
          <div className="font-bold "> Crypto Boss </div>
           </div>
        <div className="flex items-center gap-3"> 
          {
            navigation.map((item, index) => {
              return (
                <div key={index} className=" cursor-pointer">
                  <a href={item.link} className="!no-underline">{item.name}</a>
                </div>
              );
            })
          }
           </div>
        <div><div>
          <ConnectButton />
        </div></div>
      </div>
      </div>
    </>
  );
};

export default Header;
