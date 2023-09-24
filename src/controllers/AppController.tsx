import "../../.storybook/styles/globals.css";
import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initialize } from "../helpers/i18n";
import CreateBet from "../pages/create-bet";
import Bet from "../pages/bet";
import PlacedBet from "../pages/placed-bet";
import SettleBet from "../pages/settle-bet";
import Login from "../pages/login";
import AllBets from "../pages/all-bets";

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
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/bet/:address" element={<Bet />} />
        <Route path="/create" element={<CreateBet />} />
        <Route path="/placed-bet/:address" element={<PlacedBet />} />
        <Route path="/settle-bet" element={<SettleBet />} />
        <Route path="/all-bets" element={<AllBets />} />
      </Routes>
    </Router>
  ) : null;
};

export default AppController;
