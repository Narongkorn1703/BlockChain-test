import "./App.css";
import "antd/dist/antd.css";
import styled from "@emotion/styled";
import { Button, Input, Tabs, Typography } from "antd";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";
const Container = styled.div`
  padding: 16px 40px;
`;
const { TabPane } = Tabs;
const greeterAddress = "0x1dc54fAAFd3103146cC0Be41c99D1A467CEf469b";
const tokenAddress = "0x3d613CD27c2d7d3aA567939e8e31BAB2b90C3204";
function App() {
  const [greeting, setGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();
  const [balances, setBalances] = useState(0);
  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        signer
      );
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const contract = new ethers.Contract(
        tokenAddress,
        Token.abi,
        provider
      );
      const balance = await contract.balanceOf(account);
      setBalances(balance.toString());
      console.log("Balance: ", balance.toString());
    }
  }

  useEffect(() => {
    getBalance();
  }, []);
  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        tokenAddress,
        Token.abi,
        signer
      );
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(
        `${amount} Coins successfully sent to ${userAccount}`
      );
    }
  }
  return (
    <Container>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Greeting" tabKey="1" key="1">
          <Button onClick={fetchGreeting}>Fetch Greeting</Button>
          <Button onClick={setGreeting}>Set Greeting</Button>

          <Input
            onChange={(e) => setGreetingValue(e.target.value)}
            placeholder="Set greeting"
            style={{ marginTop: 16 }}
          />
        </TabPane>
        <TabPane tab="Transfer" tabKey="2" key="2">
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "16px 0",
            }}>
            <Button onClick={getBalance}>Get Balance</Button>
            <Typography style={{ padding: "0 16px" }}>
              CurrentBalance : {balances}
            </Typography>
          </div>

          <Input
            onChange={(e) => setUserAccount(e.target.value)}
            placeholder="Account ID"
          />
          <Input
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "16px 0",
            }}>
            <Button type="primary" onClick={sendCoins}>
              Send Coins
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </Container>
  );
}

export default App;
