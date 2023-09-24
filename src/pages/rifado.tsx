import { FormControl, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { BETCHA_ROUND_CONTRACT } from "../abis/BetchaRound";
import { parseEther } from "viem";

const Rifado = () => {
  const [betchaRoundAddress, setBetchaRoundAddress] = useState("");

  const { config: negativeOutcomeConfig } = usePrepareContractWrite({
    address: "0xb3a2eab23adc21ea78e1851dd4b1316cb2275d9e",
    abi: BETCHA_ROUND_CONTRACT,
    functionName: "aightBet",
    args: [0],
    value: parseEther(`${0.00069}`),
    onSettled(data, error) {
      console.log("Settled negativeOutcomeWrite:", { data, error });
    },
  });

  const { write: negativeOutcomeWrite } = useContractWrite({
    ...negativeOutcomeConfig,
    onSettled(data, error) {
      console.log("Settled negativeOutcomeWrite:", { data, error });
    },
  });

  const { config: positiveOutcomeConfig } = usePrepareContractWrite({
    address: "0xb3a2eab23adc21ea78e1851dd4b1316cb2275d9e",
    abi: BETCHA_ROUND_CONTRACT,
    functionName: "aightBet",
    args: [1],
    value: parseEther(`${0.00069}`),
    onSettled(data, error) {
      console.log("Settled positiveOutcomeWrite:", { data, error });
    },
  });

  const { write: positiveOutcomeWrite } = useContractWrite({
    ...positiveOutcomeConfig,
    onSettled(data, error) {
      console.log("Settled positiveOutcomeWrite:", { data, error });
    },
  });

  useEffect(() => {
    console.log(negativeOutcomeConfig);
    console.log(positiveOutcomeConfig);
  }, [negativeOutcomeConfig, positiveOutcomeConfig]);

  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <div className="w-full px-8 space-y-4 flex flex-col items-center">
        <input
          className="px-4 py-3 text-lg border-2 w-full rounded-lg"
          placeholder="Enter round address"
          value={betchaRoundAddress}
          onChange={(e) => setBetchaRoundAddress(e.target.value)}
        />
        <div className="flex gap-x-4 w-full">
          <button
            className="rounded-3xl bg-red-600 hover:bg-green-500 text-white px-4 py-3.5 text-xl w-3/5"
            onClick={() => {
              void negativeOutcomeWrite?.();
            }}>
            No way
          </button>
          <button
            className="rounded-3xl bg-green-900 hover:bg-green-800 text-white px-4 py-3.5 text-xl w-3/5"
            onClick={() => positiveOutcomeWrite?.()}>
            Yeah
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rifado;
