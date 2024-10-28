import "../styles/globals.css";
import toast, { Toaster } from "react-hot-toast";
import merge from "lodash/merge";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  midnightTheme,
} from "@rainbow-me/rainbowkit";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// network setup
const HOLESKY= process.env.NEXT_PUBLIC_HOLESKY_RPC_URL;
const EXPLORER= process.env.NEXT_PUBLIC_EXPLORER;
const CHAIN_ID= process.env.NEXT_PUBLIC_CHAIN_ID;
const CURRENCY= process.env.NEXT_PUBLIC_CURRENCY;
const DECIMALS= process.env.NEXT_PUBLIC_NETWORK_DECIMALS;
const NAME= process.env.NEXT_PUBLIC_NETWORK_NAME;
const NETWORK= process.env.NEXT_PUBLIC_NETWORK;


export default function App({ Component, pageProps }) {

  console.log("RPC URL:", process.env.NEXT_PUBLIC_HOLESKY_RPC_URL);

  //network
// Network configuration
// Network configuration
const { chains, provider } = configureChains(
  [
    {
      id: Number(CHAIN_ID),
      name: NAME,
      network: NETWORK,
      nativeCurrency: {
        name: NAME,
        symbol: CURRENCY,
        decimals: Number(DECIMALS),
      },
      rpcUrls: {
        default: {
          http: process.env.NEXT_PUBLIC_HOLESKY_RPC_URL,  // Single string URL
        },
        public: {
          http: process.env.NEXT_PUBLIC_HOLESKY_RPC_URL,  // Single string URL
        },
      },
      blockExplorers: {
        default: {
          name: "Holescan",
          url: EXPLORER,
        },
      },
      testnet: true,
    },
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => {

        console.log("Connecting to chain:", chain.id);
        console.log(Number(CHAIN_ID));
        if (chain.id === Number(CHAIN_ID)) {
          console.log(process.env.NEXT_PUBLIC_HOLESKY_RPC_URL);
          return { http: process.env.NEXT_PUBLIC_HOLESKY_RPC_URL };  // Single string URL, not array
        }
        return null;
      },
      priority: 1,
    }),
  ]
);



  const { connectors } = getDefaultWallets({
    appName: "Staking Dapp",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  const myTheme= merge(midnightTheme(),{
    colors: {
      accentColor: "#562C7B",
      accentColorForeground: "white",
    },
  });
  return (
    <>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}  theme={myTheme}> <Component {...pageProps} />
      <Toaster /></RainbowKitProvider>

     
</WagmiConfig>
      <script src="js/bootstrap.bundle.min.js"></script>
      <script src="js/smooth-scrollbar.js"></script>
      <script src="js/splide.min.js"></script>
      <script src="js/three.min.js"></script>
      <script src="js/vanta.fog.min.js"></script>
      <script src="js/main.js"></script>
    </>
  );
}
