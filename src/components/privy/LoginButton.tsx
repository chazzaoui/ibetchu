import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { shortAddress } from "../../helpers";

const LoginButton = () => {
  const { login, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  if (!ready) return null;

  if (!authenticated) {
    // Use Privy login instead of wagmi's connect
    return (
      <button type="button" onClick={() => login()}>
        login
      </button>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center max-w-full px-4 overflow-x-hidden">
      <h2>Active Wallet {activeWallet?.address}</h2>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.address}>
            <button
              type="button"
              className="px-4 py-2 bg-black rounded-2xl text-white"
              // eslint-disable-next-line no-void
              onClick={() => void setActiveWallet(wallet)}>
              Activate {shortAddress(wallet.address)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoginButton;
