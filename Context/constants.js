import ethers from "ethers";
import StakingDappABI from "./StakingDapp.json";
import TokenICO from "./TokenICO.json";
import CustomTokenABI from "./ERC20.json";

const  STAKING_DAPP_ADDRESS= process.env.NEXT_PUBLIC_STAKING_DAPP;
const TOKEN_ICO= process.env.NEXT_PUBLIC_TOKEN_ICO;

//Token
const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;

export function toEth(amount,decimals=18){
    const toEth= ethers.utils.formatUnits(amount,decimals);
    return toEth.toString();
}

export const tokenContract= async ()=>{
    const provider= new ethers.providers.Web3Provider(window.ethereum);

    const { ethereum } = window;

    if( ethereum){
        const signer= provider.getSigner();

        const contractReader= new ethers.Contract(
            DEPOSIT_TOKEN,
            CustomTokenABI.abi,
            signer
        );
        return contractReader;
    }
}


export const contract= async ()=>{
    const provider= new ethers.providers.Web3Provider(window.ethereum);

    const { ethereum } = window;

    if( ethereum){
        const signer= provider.getSigner();

        const contractReader= new ethers.Contract(
            DEPOSIT_TOKEN,
            CustomTokenABI.abi,
            signer
        );
        return contractReader;
    }
}


export const ERC20= async ()=>{
    const provider= new ethers.providers.Web3Provider(window.ethereum);

    const { ethereum } = window;

}
