import {
    BigNumber,
    ethers
} from "ethers";
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

const notifySuccess = (msg) => toast.success(msg, {
    duration: 3000
});
const notifyError = (msg) => toast.error(msg, {
    duration: 3000
})

function CONVERT_TIMESTAMP_TO_READABLE(timestamp) {
    const date = new Date(timestamp * 1000);
    const readbaleTime = date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        year: "numeric",
    });
    return readbaleTime;
}

function toWei(amount) {
    const toWei = ethers.utils.parseUnits(amount.toString());
    return toWei.toString();
}

function parseErrorMsg(error) {
    const json = JSON.parse(JSON.stringify(error));
    return json?.reason || json?.error?.message;
}

export const SHORTEN_ADDRESS = (address) => {
    if (!address) return;
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
}

export const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess("Address copied");
}

export async function CONTRACT_DATA(address) {
    try {
        const contractObj = await contract();

  
        const stakingTokenObj = await tokenContract();


        if (address) {
            const contractOwner = await contractObj.owner();
            const contractAddress =  contractObj.address;

            const notifications = await contractObj.getNotifications();

            const _notificationsArray = await Promise.all(
                notifications.map(async ({
                    poolId,
                    amount,
                    user,
                    typeOf,
                    timestamp
                }) => {
                    return {
                        poolId: poolId.toNumber(),
                        amount: toEth(amount.toString()),
                        user,
                        typeOf,
                        timestamp: CONVERT_TIMESTAMP_TO_READABLE(timestamp.toNumber())
                    }
                }));

            let poolInfoArray = [];
            const poolLength = await contractObj.poolCount();
            const length = poolLength.toNumber();
            for (let i = 0; i < length; i++) {
                const poolInfo = await contractObj.poolInfo(i);

                const userInfo = await contractObj.userInfo(i, address);
                const userReward = await contractObj.pendingReward(i, address);

                const tokenPoolInfoA = await ERC20(poolInfo.depositToken, address);
                const tokenPoolInfoB = await ERC20(poolInfo.rewardToken, address);

                const pool = {
                    depositTokenAddress: poolInfo.depositToken,
                    rewardTokenAddress: poolInfo.rewardToken,
                    depositToken: tokenPoolInfoA,
                    rewardToken: tokenPoolInfoB,
                    depositedAmount: toEth(poolInfo.depositedAmount.toString()),
                    apy: poolInfo.apy.toNumber(),
                    lockDays: poolInfo.lockDays.toNumber(),

                    amount: toEth(userInfo.amount.toString()),
                    userReward: toEth(userReward.toString()),
                    lockUntil: CONVERT_TIMESTAMP_TO_READABLE(userInfo.lockUntil.toNumber()),
                    lastRewardAt: toEth(userInfo.lastRewardAt.toString()),
                };

                poolInfoArray.push(pool);
            }

            const totalDepositAmount = poolInfoArray.reduce((total, pool) => {
                return total + parseFloat(pool.depositedAmount);
            });


            const rewardToken = await ERC20(REWARD_TOKEN, address);
            const depositToken = await ERC20(DEPOSIT_TOKEN, address);

            const data = {
                contractOwner: contractOwner,
                contractAddress: contractAddress,
                notifications: _notificationsArray.reverse(),
                poolInfoArray: poolInfoArray,
                totalDepositAmount: totalDepositAmount,
                rewardToken: rewardToken,
                depositToken: depositToken,
                tokenLogo: TOKEN_LOGO,
                contractTokenBalance: depositToken.contractTokenBalance - totalDepositAmount,
            }

            return data;

        }
    } catch (error) {
        console.log(error);
        return parseErrorMsg(error);

    }
}


export async function deposit(poolID, amount, address) {
    try {
        notifySuccess(" calling contract......");

        const contractObj = await contract();
        const stakingTokenObj = await tokenContract();

        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

        const currentAllowance = await stakingTokenObj.allowance(address, contractObj.address);
        // cuurent allowance is less than amount
        if (currentAllowance.lt(amountInWei)) {
            notifySuccess("Approving.....");
            const approveTx = await stakingTokenObj.approve(contractObj.address, amountInWei);

            await approveTx.wait();
            console.log(`Approved ${amountInWei.toString()} token for staking`);
        }

        const gasEstimation = await contractObj.estimateGas.deposit(Number(poolID), amountInWei);

        notifySuccess(" Staking token call.....");

        const stakeTx = await contractObj.deposit(poolID, amountInWei, {
            gasLimit: gasEstimation,
        });

        const receipt = await stakeTx.wait();
        notifySuccess(" Token taken successfully.....");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}

export async function transferToken(amount, transferAddress) {
    try {
        notifySuccess(" calling contract......");

        const contractObj = await contract();
        const stakingTokenObj = await tokenContract();

        const approveTx = await stakingTokenObj.transfer(transferAddress, amount);
        await approveTx.wait();
        console.log(`Approvced ${amount.toString()} token for staking`);
        notifySuccess("Token transfer successfull");
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}

export async function withdraw(poolID, amount) {
    try {
        notifySuccess(" calling contract......");

        const contractObj = await contract();
        const stakingTokenObj = await tokenContract();

        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);


        const gasEstimation = await contractObj.estimateGas.withdraw(Number(poolID), amountInWei, {
            gasLimit: gasEstimation,
        });
        const withdrawTx = await contractObj.withdraw(Number(poolID), amountInWei);
        const receipt = await withdrawTx.wait();
        console.log(`Withdrawn ${amount.toString()} token from staking`);
        notifySuccess("Withdraw successfull");

        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}

export async function claimReward(poolID) {
    try {
        notifySuccess(" calling contract......");

        const contractObj = await contract();
        const stakingTokenObj = await tokenContract();

        const gasEstimation = await contractObj.estimateGas.claimReward(Number(poolID));
        const claimTx = await contractObj.claimReward(Number(poolID));
        const receipt = await claimTx.wait();
        console.log(`Claimed ${amount.toString()} token from staking`);
        notifySuccess("Claim reward successfull");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}

export async function createPool(pool) {
    try {
        const { _depositToken, _rewardToken, _lockDays, _apy, _amount } = pool;

        if (!_depositToken || !_rewardToken || !_lockDays || !_apy || !_amount) {
            notifyError("All fields are required");
            return;
        }

        const contractObj = await contract();
        const gasEstimation = await contractObj.estimateGas.addPool(_depositToken, _rewardToken, Number(_apy), Number(_lockDays));

        const stakeTx = await contractObj.addPool(_depositToken, _rewardToken, Number(_apy), Number(_lockDays), {
            gasLimit: gasEstimation,
        });

        const receipt = await stakeTx.wait();

        notifySuccess("Pool created successfully");

        return receipt;

    } catch (error) {
        console.log(error);
    }
}

export async function modifyPool(poolID, amount) {

    try {
        notifySuccess(" calling contract......");

        const contractObj = await contract();

        const gasEstimation = await contractObj.estimateGas.modifyPool(Number(poolID), Number(amount));

        const data = await contractObj.modifyPool(Number(poolID), Number(amount), {
            gasLimit: gasEstimation,
        });

        const receipt = await data.wait();
        notifySuccess("Pool modified successfully");
        return receipt;

    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
};

// withdrw token from pool
export async function sweep(tokenData) {

    try {

        const { token, amount } = tokenData;
        if (!token || !amount) {
            notifyError("All fields are required");
            return;
        }

        const contractObj = await contract();

        const transferAmount = ethers.utils.parseEther(amount);

        const gasEstimation = await contractObj.estimateGas.sweep(token, transferAmount);

        const data = await contractObj.sweep(token, transferAmount, {
            gasLimit: gasEstimation,
        });

        const receipt = await data.wait();
        notifySuccess("Sweep successfull");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}

// add token to metamask

export const addTokenToMetamask = async (token) => {

    if (window.ethereum) {
        const contract = await tokenContract();

        const tokenDecimals = await contract.decimals();
        const tokenAddress =  contract.address;
        const tokenSymbol = await contract.symbol();
        const tokenImage =  TOKEN_LOGO;

        try {
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: tokenImage
                    },
                },
            })

            if (wasAdded) {
                notifySuccess("Token added to metamask");
            } else {
                notifyError("Token not added to metamask");
            }
        } catch (error) {
            notifyError("Token not added to metamask");
        }

    } else {
        notifyError("Please install metamask");
    }
};



// ICO Contract

export const BUY_TOKEN = async (amount) => {
    try {
        const contract = await TOKEN_ICO_CONTRACT();

        const tokenDetails = await contract.getTokenDetails();
        const availableTokens = ethers.utils.formatEther(tokenDetails.balance.toString());

        if (availableTokens > 1) {
            const price = ethers.utils.formatEther(tokenDetails.tokenPrice.toString()) * Number(amount);

            const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

            const transaction = await contract.buyTokens(Number(amount), {
                value: payAmount.toString(),
                gasLimit: ethers.utils.hexlify(8000000),

            });

            const receipt = await transaction.wait();
            notifySuccess("Token purchased successfully");
            return receipt;
        } else {
            notifyError("Not enough tokens available");
            return "receipt";
        }
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}


export const TOKEN_WITHDRAW = async () => {
    try {
        const contract = await TOKEN_ICO_CONTRACT();

        const tokenDetails = await contract.getTokenDetails();
        const availableTokens = ethers.utils.formatEther(tokenDetails.balance.toString());

        if (availableTokens > 1) {
            const transaction = await contract.withdrawAllTokens();
            const receipt = await transaction.wait();
            notifySuccess("Token withdraw successfully");
            return receipt;
        } else {
            notifyError("Not enough tokens available");
            return "receipt";
        }
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}

export const UPDATE_TOKEN = async (_address) => {
    try {
        const contract = await TOKEN_ICO_CONTRACT();
        if (!_address) {
            notifyError("Please enter address");
            return;
        }

        const gasEstimation = await contract.estimateGas.updateToken(_address);
        const transaction = await contract.updateToken(_address, {
            gasLimit: gasEstimation,
        });
        const receipt = await transaction.wait();
        notifySuccess("Token updated successfully");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}

export const UPDATE_TOKEN_PRICE = async (price) => {
    try {
        if (!price) {
            notifyError("Please enter price");
            return;
        }
        const contract = await TOKEN_ICO_CONTRACT();

        const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

        const gasEstimation = await contract.estimateGas.updateTokenSalePrice(payAmount);
        const transaction = await contract.updateTokenSalePrice(payAmount, {
            value: payAmount.toString(),
            gasLimit: gasEstimation,
        });
        const receipt = await transaction.wait();
        notifySuccess("Token price updated successfully");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}