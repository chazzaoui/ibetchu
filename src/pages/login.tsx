import React from "react";
import ConnectButton from "../component-library/components/ConnectButton/ConnectButton";
import { usePrivy } from "@privy-io/react-auth";
import { Link } from "react-router-dom";

const Login = () => {
  const { authenticated } = usePrivy();

  return (
    <div className="h-screen flex flex-col justify-center items-center w-full">
      {authenticated && (
        <Link to="/create">
          <button
            type="button"
            className="px-8 py-2 bg-black rounded-3xl text-white disabled:bg-neutral-500">
            Create a bet
          </button>
        </Link>
      )}
      <ConnectButton />
    </div>
  );
};

export default Login;
