import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSDK } from "@metamask/sdk-react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

import { convertGweiToEth } from "./services/utils";
import Button from "./Components/Button";
import contract from "./JavierToken.json";
import CardBoard from "./Components/CardBoard";
import ResultModal from "./Components/ResultModal";
import BetForm from "./Components/BetForm";
// localhost
// const CONTRACT_ADDRESS = "0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f";
// sepolis
const CONTRACT_ADDRESS = "0xD34ee1B94ecdAd638984B032d3c76adaffeD8Ed6";

function DApp() {
  const [account, setAccount] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [userWin, setUserWin] = useState(false);
  const [activeNumber, setActiveNumber] = useState(0);
  const [betNumber, setBetNumber] = useState(1);
  const [betAmount, setBetAmount] = useState(1);
  const [tokenData, setTokenData] = useState({});
  const [balance, setBalance] = useState();
  const [contractToken, setContractToken] = useState();
  const { sdk, connected } = useSDK();

  useEffect(() => {
    if (account !== "") {
      async function getNewUserBalance() {
        await getUserBalance();
      }
      getNewUserBalance();
    }
  }, [account]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      // here I get the account public key via MetaMask provider and store
      // it in the account variable state, which triggers a re-render
      const accountAddress = accounts?.[0];

      // initializing ethers now that we have the account
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner(0);
      const javierToken = new ethers.Contract(
        CONTRACT_ADDRESS,
        contract.abi,
        signer
      );

      // get information about the contract token
      const tokenName = await javierToken.name();
      const tokenSymbol = await javierToken.symbol();
      const totalSupply = await javierToken.totalSupply();
      setTokenData({
        name: tokenName,
        symbol: tokenSymbol,
        totalSupply: convertGweiToEth(totalSupply),
      });

      setContractToken(javierToken);
      setAccount(accountAddress);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };

  const getUserBalance = async () => {
    const balGwei = await contractToken?.balanceOf(account);
    setBalance(convertGweiToEth(balGwei));
  };

  const requestTokens = async () => {
    try {
      const tx = await contractToken.mintForNewMember();

      contractToken.on("AddNewMember", async (member) => {
        const balGwei = await contractToken.balanceOf(account);
        const totalSupply = await contractToken.totalSupply();
        setTokenData({
          ...tokenData,
          totalSupply: convertGweiToEth(totalSupply),
        });
        setBalance(convertGweiToEth(balGwei));
      });
    } catch (e) {
      alert("You have already received the initial allowance");
      console.log("Error");
    }
  };

  const playGame = async () => {
    // generating random integer
    const interval = setInterval(() => {
      let value = Math.floor(Math.random() * (10 - 1)) + 1;
      setActiveNumber(value);
    }, 300);

    // call contract
    try {
      const amount = ethers.parseEther(`${betAmount}`);
      const tx = await contractToken.playBet(betNumber, amount);

      // if contract emits event, then stop interval and get new balance
      contractToken.on("BetOutcome", async (player, guess, randNo) => {
        clearInterval(interval);
        setActiveNumber(randNo);
        if (guess != randNo) {
          setUserWin(false);
        } else {
          setUserWin(true);
        }
        setOpenModal(true);
        await getUserBalance();
      });
    } catch (err) {
      clearInterval(interval);
      console.log(err);
      alert("Transaction not executed");
    }
  };

  const handleBetNumber = (event) => {
    setBetNumber(event.target.value);
  };

  const handleBetAmount = (event) => {
    setBetAmount(event.target.value);
  };

  return (
    <div className="bg-green-100 h-max">
      <div className="flex-col p-20 text-center border-2 border-black">
        {account ? (
          <div>
            <div className="mb-4">
              {account && `Connected account: ${account}`}
            </div>
            <div className="flex justify-center">
              <div className="pr-6">
                <div>{`User balance: ${balance} ${tokenData.symbol}`}</div>
                <div>{`Total supply: ${tokenData.totalSupply} ${tokenData.symbol}`}</div>
              </div>
              <div>
                <Button onClick={requestTokens}>Request Tokens</Button>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <CardBoard activeNumber={activeNumber} selNumber={betNumber} />
            </div>
            <div className="pt-6 flex-col">
              <BetForm
                betNumber={betNumber}
                handleBetNumber={handleBetNumber}
                betAmount={betAmount}
                handleBetAmount={handleBetAmount}
                maxBetAmount={balance}
              />
              <div className="py-2"></div>
              <Button onClick={playGame}>Play</Button>
            </div>
            <Modal
              open={openModal}
              onClose={() => {
                setOpenModal(false);
              }}
              center
            >
              <ResultModal userWin={userWin} />
            </Modal>
          </div>
        ) : (
          <Button onClick={connect}>Connect Wallet</Button>
        )}
      </div>
    </div>
  );
}

export default DApp;
