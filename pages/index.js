import React,{ useEffect, useState } from "react";

import {
  Header,
  ICOSale,
  HeroSection,
  Loader,
  Footer,
  Pools,
  PoolsModel,
  WithdrawModal,
  Withdraw,
  Partners,
  Statistics,
  Token,
  Notification,
  Ask,
  Contact,
} from "../Components/index";

import { CONTRACT_DATA, CONTRACT_ADDRESS, deposit, withdraw, claimReward,addTokenToMetamask } from "../Context";
const index = () => {
  return(
    <>
    <Header />
    <Footer />
    </>
  )
};

export default index;
