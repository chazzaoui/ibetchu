import React from "react";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { BETCHA_ROUND_CONTRACT } from "../abis/BetchaRound";

const usePostMessage = (
  betchaRoundADdress: string,
  content: string,
  onSettledCallback?: () => void,
) => {
  const {
    config,
    error: preparePostMessageError,
    isError: isPreparePostMessageError,
  } = usePrepareContractWrite({
    abi: BETCHA_ROUND_CONTRACT,
    address: betchaRoundADdress as `0x${string}`,
    functionName: "post",
    args: [content ?? ""],
    onSettled(data, error) {
      console.log("Settled Prepare PostMessage:", { data, error });
    },
  });

  const {
    data: postMessageData,
    error: postMessageError,
    isError: isPostMessageError,
    status: postMessageStatus,
    write: postMessageWrite,
  } = useContractWrite({
    ...config,
    onSettled(data, error) {
      console.log("Settled MintERC1155:", { data, error });
      onSettledCallback?.();
    },
  });

  return { isPreparePostMessageError, postMessageWrite };
};

export default usePostMessage;
