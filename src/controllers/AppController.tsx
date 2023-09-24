import "../../.storybook/styles/globals.css";
import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initialize } from "../helpers/i18n";
import CreateBet from "../pages/create-bet";
import Bet from "../pages/bet";
import PlacedBet from "../pages/placed-bet";
import SettleBet from "../pages/settle-bet";
import Login from "../pages/login";
import AllBets from "../pages/all-bets";
import { configureChainsConfig } from "../lib/wagmiClientPrivy";
import { Box, Flex, Select } from "@chakra-ui/react";
import { useWallets } from "@privy-io/react-auth";
import Trashtalk from "../pages/trashtalk";

function SwitchNetworks() {
  const chains = configureChainsConfig.chains;
  const { wallets } = useWallets();
  const switchNetworks = useCallback(
    (chainId: number) => {
      for (const wallet of wallets) {
        wallet.switchChain(chainId);
      }
    },
    [wallets],
  );

  return (
    <Flex mt={4} justifyContent="center">
      <Box maxWidth="480px">
        <Select
          onChange={(event) => {
            switchNetworks(Number(event.target.value));
          }}>
          {chains.map((chain) => (
            <option value={chain.id}>{chain.name}</option>
          ))}
        </Select>
      </Box>
    </Flex>
  );
}

const AppController: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    const initI18n = async () => {
      await initialize();
      setInitialized(true);
    };
    void initI18n();
  }, []);

  return initialized ? (
    <>
      <SwitchNetworks />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/bet/:address" element={<Bet />} />
          <Route path="/create" element={<CreateBet />} />
          <Route path="/placed-bet/:address" element={<PlacedBet />} />
          <Route path="/settle-bet" element={<SettleBet />} />
          <Route path="/all-bets" element={<AllBets />} />
          <Route path="/trashtalk/:address" element={<Trashtalk />} />
        </Routes>
      </Router>
    </>
  ) : null;
};

export default AppController;
