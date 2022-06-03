import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';

import { MarketAddress, MarketAddressABI } from './constants';

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const nftCurrency = 'ETH';
  const [currentAccount, setCurrentAccount] = useState('');

  // Check if it is connected to wallet
  const checkIfWalletIsConnect = async () => {
    // While installing metamask, it has an ethereum object in the window
    if (!window.ethereum) return alert('Please install MetaMask.');

    // Fetch all the eth accounts
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    // Connecting account if exists
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    // Fetch all the eth accounts------------------------------------here----------------
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);

    // Reloading window
    window.location.reload();
  };

  // Checking if wallet is there in the start
  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount }}>
      {children}
    </NFTContext.Provider>
  );
};
