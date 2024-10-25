import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast";
import {
    contract,
    tokenContract,
    ERC20,
    toEth,
    TOKEN_ICO_CONTRACT
} from "./constants";

const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;
const TOKEN_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;

const notifySuccess= (msg)=> toast.success(msg,{ duration: 3000 });
const notifyError = (msg)=> toast.error(msg, { duration: 3000 })

function CONVERT_TIMESTAMP_TO_READABLE(timestamp){
    const date = new Date(timestamp * 1000);
const readbaleTime= date.toLocaleString("en-US", {
month:"2-digit",
day:"2-digit",
hour:"2-digit",
minute:"2-digit",
second:"2-digit",
year:"numeric",
});
return readbaleTime;
}

function toWei(amount) {
    const toWei= ethers.utils.parseUnits(amount.toString());
    return toWei.toString();
}   

function parseErrorMsg(error) {
    const json=JSON.parse(JSON.stringify(error));
    return json?.reason || json?.error?.message;
}

export const SHORTEN_ADDRESS = (address) => {
    if(!address) return;
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
}

export const copyAddress= (text)=>{
    navigator.clipboard.writeText(text);
    notifySuccess("Address copied");
} 