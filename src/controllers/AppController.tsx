import "../../.storybook/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import { useEffect, useState } from "react";
import { datadogRum } from "@datadog/browser-rum";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initialize } from "../helpers/i18n";
import { ENVIRONMENT } from "../helpers";
import Inbox from "../pages/inbox";
import Index from "../pages/index";
import Dm from "../pages/dm";
import CreateBet from "../pages/create-bet";
import Bet from "../pages/bet";
import PlacedBet from "../pages/placed-bet";
import SettleBet from "../pages/settle-bet";

const AppController: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    const initI18n = async () => {
      await initialize();
      setInitialized(true);
    };
    void initI18n();
  }, []);

  useEffect(() => {
    /* The initialization below will only happen 
    on our internal testing url (alpha.xmtp.chat)
    and is used for performance testing purposes.
    This tracking is meant to help surface insights 
    about performance based on team usage, and flag
    any performance degradations before they hit our
    production users. */
    if (window.location.hostname.includes(ENVIRONMENT.ALPHA)) {
      datadogRum.init({
        applicationId: import.meta.env.VITE_DATA_DOG_ID,
        clientToken: import.meta.env.VITE_DATA_DOG_TOKEN,
        site: "datadoghq.com",
        service: "inbox-web",
        env: "prod",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 0,
        trackUserInteractions: false,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: "mask",
      });

      datadogRum.startSessionReplayRecording();
    }
  }, []);

  return initialized ? (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/dm/:address" element={<Dm />} />
        <Route path="/bet/:address" element={<Bet />} />
        <Route path="/create" element={<CreateBet />} />
        <Route path="/placed-bet/:address" element={<PlacedBet />} />
        <Route path="/settle-bet" element={<SettleBet />} />
      </Routes>
    </Router>
  ) : null;
};

export default AppController;
