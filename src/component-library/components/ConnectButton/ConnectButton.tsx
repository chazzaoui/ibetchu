import React from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { shortAddress } from "../../../helpers";

const ConnectButton = () => {
  const { login, ready, authenticated, logout } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  if (!ready) return null;

  if (!authenticated) {
    // Use Privy login instead of wagmi's connect
    return (
      <div className="flex flex-col justify-center items-center w-full px-4 overflow-x-hidden py-8">
        <h1 className="text-5xl font-bold absolute top-64">Betcha</h1>
        <div className="w-full flex justify-center">
          <button
            type="button"
            className="w-1/2 text-xl py-2 bg-black rounded-3xl text-white"
            onClick={() => login()}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full px-4 overflow-x-hidden gap-y-2">
      <h1 className="text-5xl font-bold absolute top-28">Betcha</h1>
      <div className="flex flex-col items-center">
        <h2>
          Current Active Wallet:{" "}
          {activeWallet
            ? shortAddress(activeWallet?.address as string)
            : "No wallet"}
        </h2>
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet.address} className="my-4">
              <button
                type="button"
                className="px-4 py-2 bg-black rounded-3xl text-white disabled:bg-neutral-500"
                disabled={(activeWallet?.address as string) === wallet.address}
                // eslint-disable-next-line no-void
                onClick={() => void setActiveWallet(wallet)}>
                {(activeWallet?.address as string) === wallet.address
                  ? "(Current)"
                  : "Activate"}{" "}
                {shortAddress(wallet.address)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button
          type="button"
          className="px-8 py-2 bg-black rounded-3xl text-white"
          // eslint-disable-next-line no-void
          onClick={() => void logout()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ConnectButton;
