import "./App.css";
import { useMemo } from "react";

import Home from "./Home";

import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { createTheme, ThemeProvider } from "@material-ui/core";

import Background from './background.jpeg';
import { CenterFocusStrong } from "@material-ui/icons";

import {
  Nav,
  NavLogo,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";

import { BrowserRouter as Router, Route } from "react-router-dom";

const treasury = new anchor.web3.PublicKey(
  process.env.REACT_APP_TREASURY_ADDRESS!
);

const config = new anchor.web3.PublicKey(
  process.env.REACT_APP_CANDY_MACHINE_CONFIG!
);

const candyMachineId = new anchor.web3.PublicKey(
  process.env.REACT_APP_CANDY_MACHINE_ID!
);

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);

const txTimeout = 30000; // milliseconds (confirm this works for your project)

const theme = createTheme({
    palette: {
        type: 'dark',
    },
    overrides: {
        MuiButtonBase: {
            root: {
                justifyContent: 'flex-start',
            },
        },
        MuiButton: {
            root: {
                textTransform: undefined,
                padding: '12px 16px',
            },
            startIcon: {
                marginRight: 8,
            },
            endIcon: {
                marginLeft: 8,
            },
        },
    },
});

var sectionStyle = {
  paddingTop: "200px",
  paddingBottom: "250px",
  width: "100%",
  height: "100%",
  backgroundImage: "url(" + Background + ")",
  textAlign: "center" as const,
};

var divStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const Navbar = () => {
  return (
      <>
         <Nav>
          <NavLogo to="/">
              Auction Store
          </NavLogo>
          <Bars />

          <NavMenu>
              <NavLink to="/" >
                  Home
              </NavLink>
              <NavLink to="/about" >
                  About
              </NavLink>
              <NavLink to="/contact" >
                  Contact
              </NavLink>
              <NavLink to="/signin" >
                  Team
              </NavLink>
              <NavBtn>
                  <NavBtnLink to="/sign-up">Go To Store</NavBtnLink>                
              </NavBtn>
          </NavMenu> 
         </Nav> 
      </>
  );
};

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network })
    ],
    []
  );

  return (
      <ThemeProvider theme={theme}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={true}>
            <WalletDialogProvider>
              <Router>
                <Navbar/>
              </Router>
              <div style={ sectionStyle }>
                <h2> Welcome to Auction Store<br/></h2>
                <p> We provide the most rare mint collections around the internet,<br/>
                  kindly connect your wallet and start minting today. </p>
                <div style={ divStyle }>
                  <Home
                  candyMachineId={candyMachineId}
                  config={config}
                  connection={connection}
                  startDate={startDateSeed}
                  treasury={treasury}
                  txTimeout={txTimeout}
                  />
                </div>
              </div>
            </WalletDialogProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
  );
};

export default App;
