import {ethers} from "ethers";
import StakingDappABI from "./StakingDapp.json";
import TokenICO from "./TokenICO.json";
import CustomTokenABI from "./ERC20.json";

const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const TOKEN_ICO = process.env.NEXT_PUBLIC_TOKEN_ICO;

//Token
const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;

export function toEth(amount, decimals = 18) {
    const toEth = ethers.utils.formatUnits(amount, decimals);
    return toEth.toString();
}

export const tokenContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const {
        ethereum
    } = window;

    if (ethereum) {
        const signer = provider.getSigner();

        const contractReader = new ethers.Contract(
            DEPOSIT_TOKEN,
            CustomTokenABI.abi,
            signer
        );
        return contractReader;
    }
}


export const contract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const {
        ethereum
    } = window;

    if (ethereum) {
        const signer = provider.getSigner();

        const contractReader = new ethers.Contract(
            STAKING_DAPP_ADDRESS,
            StakingDappABI.abi,
            signer
        );
        return contractReader;
    }
}


export const ERC20 = async (address, userAddress) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const {
        ethereum
    } = window;
    if (ethereum) {
        const signer = provider.getSigner();

        const contractReader = new ethers.Contract(
            address,
            CustomTokenABI.abi,
            signer
        );
        const token = {
            name: await contractReader.name(),
            symbol: await contractReader.symbol(),
            balance: toEth(await contractReader.balanceOf(userAddress)),
            symbol: await contractReader.symbol(),
            totalSupply: toEth(await contractReader.totalSupply()),
            contractTokenBalance: toEth(await contractReader.balanceOf(STAKING_DAPP_ADDRESS)),
        }

        return token;
    }
}

export const LOAD_TOKEN_ICO = async () => {
    try {

        const contract = await TOKEN_ICO_CONTRACT();
        const tokenAddress = await contract.tokenAddress();

        const tokenDetails = await contract.getTokenDetails();
        const contractOwner = await contract.owner();
        const soldTokens = await contract.soldTokens();

        const ICO_TOKEN = await TOKEN_ICO_ERC20();

        const token = {
            tokenBal: ethers.utils.formatEther(tokenDetails.balance.toString()),
            name: tokenDetails.name,
            symbol: tokenDetails.symbol,
            supply: ethers.utils.formatEther(tokenDetails.supply.toString()),
            tokenPrice: ethers.utils.formatEther(tokenDetails.tokenPrice.toString()),
            tokenAddr: tokenDetails.tokenAddr,
            owner: contractOwner.toLowerCase(),
            soldTokens: soldTokens.toNumber(),
            token: ICO_TOKEN,
        };

        return token;

    } catch (error) {
        console.error(error);
    }
}
export const TOKEN_ICO_CONTRACT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const {
        ethereum
    } = window;

    if (ethereum) {
        const signer = provider.getSigner();

        const contractReader = new ethers.Contract(
            TOKEN_ICO,
            TokenICO.abi,
            signer
        );
        return contractReader;
    }
}


export const TOKEN_ICO_ERC20 = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const {
        ethereum
    } = window;

    try {
        if (ethereum) {
            const signer = provider.getSigner();

            const contractReader = new ethers.Contract(
                DEPOSIT_TOKEN,
                CustomTokenABI.abi,
                signer
            );

            //user address
            const userAddress = await signer.getAddress();
            const nativeBalance = await signer.getBalance();
            const balance = await contractReader.balanceOf(userAddress);

            const token = {
                address: await contractReader.address,
                name: await contractReader.name(),
                symbol: await contractReader.symbol(),
                decimals: await contractReader.decimals(),
                balance: toEth(await contractReader.balanceOf(balance)),
                supply: toEth(await contractReader.totalSupply()),
                nativeBalance: toEth(nativeBalance.toString()),
            }

            return token;
        }
    } catch (error) {
        console.error(error);
    }

}