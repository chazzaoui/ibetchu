import {
  Flex,
  Image,
  Button,
  Heading,
  Divider,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CountdownTimer from "../component-library/components/CountDownTimer";
import { useNavigate, useParams } from "react-router-dom";
import { BETCHA_ROUND_CONTRACT } from "../abis/BetchaRound";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractReads,
  useToken,
  useAccount,
} from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { BigNumberish, ZeroAddress, ethers } from "ethers";
import { formatUnits } from "viem";
import { erc20ABI } from "../abis/erc20ABI";
import ConnectButton from "../component-library/components/ConnectButton/ConnectButton";
import { RWebShare } from "react-web-share";
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Bet: React.FC = () => {
  const [choice, setChoice] = useState<boolean>();
  const [approved, setApproved] = useState(false);
  let { address } = useParams();
  const nav = useNavigate();
  const [placedSuccesfull, setPlacedSuccesfull] = useState(false);
  const { authenticated } = usePrivy();
  const contract = {
    address: address as `0x${string}`,
    abi: BETCHA_ROUND_CONTRACT,
  };

  const { data } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: "settlementAvailableAt",
      },
      {
        ...contract,
        functionName: "wagerDeadlineAt",
      },
      {
        ...contract,
        functionName: "wagerTokenAddress",
      },
      {
        ...contract,
        functionName: "wagerTokenAmount",
      },
      {
        ...contract,
        functionName: "metadataURI",
      },
      {
        ...contract,
        functionName: "settlementInfo",
      },
      {
        ...contract,
        functionName: "resolver",
      },
    ],
    enabled: Boolean(address),
  });

  const isZeroAddress =
    data?.[2].result === "0x0000000000000000000000000000000000000000";

  const {
    config: voteConfig,
    error: voteConfigError,
    isLoading,
  } = usePrepareContractWrite({
    ...contract,
    functionName: "aightBet",
    args: [choice ? 1 : 0],
    enabled: Boolean(typeof choice === "boolean" && authenticated),
    value: isZeroAddress ? (data?.[3].result as any) : 0,
  });

  const {
    write: vote,
    isLoading: isWriting,
    isSuccess,
    error: voteError,
  } = useContractWrite({
    ...voteConfig,
    onSuccess(data) {
      setPlacedSuccesfull(true);
    },
    onError(error) {
      console.error(error.message);
      setPlacedSuccesfull(false);
    },
  });

  const [ipfsData, setIpfsData] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Fetch data from the IPFS URL when ipfsUrl changes
    if (data?.[4]) {
      fetch(data?.[4].result as RequestInfo)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          setIpfsData(data); //
        })
        .catch((error) => {
          console.error("Error fetching data from IPFS:", error);
        });
    }
  }, [data?.[4]]);

  const {
    data: tokenInfo,
    isLoading: decimalsLoading,
    error: decimalError,
  } = useToken({
    address: data?.[2].result as `0x${string}`,
    enabled: Boolean(data?.[2].result && !isZeroAddress),
  });

  const { config: approveConfig, error: approveConfigError } =
    usePrepareContractWrite({
      address: tokenInfo?.address,
      abi: erc20ABI,
      functionName: "approve",
      args: [address as `0x${string}`, data?.[3].result as any],
      enabled: Boolean(!isZeroAddress && authenticated),
    });

  const {
    write: approveContractResult,
    isLoading: isApproving,
    writeAsync: approveAsync,
    error: approveError,
  } = useContractWrite({
    ...approveConfig,
    onSuccess() {
      setApproved(true);
    },
    onError() {
      setApproved(false);
    },
  });

  return (
    <Flex
      padding={4}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      width={"100%"}
      minHeight={"100vh"}>
      <Image marginBottom={8} src="/BETCHA.png" alt="Betcha" />
      <Heading marginBottom={4}>
        {placedSuccesfull ? "You've bet!" : "Bet preview"}
      </Heading>
      <Divider marginBottom={8} />
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={["100%", "80%", "50%"]}
        height={"100%"}>
        <Flex
          padding={4}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100%"}
          height={"100%"}
          flexDirection={"column"}>
          {!placedSuccesfull ? null : (
            <Flex marginBottom={8} width={"100%"} justifyContent={"center"}>
              <Button
                hidden={choice === true}
                border={choice ? "1px" : "0px"}
                backgroundColor={"#F6F6F6"}
                onClick={() => setChoice(true)}>
                ✅ YES
              </Button>
              <Button
                hidden={choice === false}
                border={choice ? "0px" : "1px"}
                backgroundColor={"#F6F6F6"}
                onClick={() => setChoice(false)}>
                ❌ NO
              </Button>
            </Flex>
          )}
          <Heading hidden={placedSuccesfull} mb={4}>
            I bet you
          </Heading>
          <Flex width={"100%"} justifyContent={"center"} mb={4}>
            <Heading mr={4}>
              {formatUnits(
                (data?.[3].result as any) ?? 0,
                !isZeroAddress ? (tokenInfo?.decimals as number) : 18,
              )}
            </Heading>

            <Heading>{!isZeroAddress ? tokenInfo?.name : "ETH"}</Heading>
          </Flex>
          <Heading mb={4}>that</Heading>

          <Heading mb={8}>{ipfsData}</Heading>
          <Text fontWeight={"bold"}>Time left to bet:</Text>
          <CountdownTimer
            targetDate={
              data?.[1].result ? Number(data?.[1]?.result) * 1000 : Date.now()
            }
          />
          <Text marginBottom={8} marginTop={4} fontWeight={"bold"}>
            Settled by {String(data?.[6].result)}
          </Text>
          <Heading mb={8}>My bet:</Heading>
          {placedSuccesfull ? null : (
            <Flex
              marginBottom={8}
              width={"100%"}
              justifyContent={"space-evenly"}>
              <Button
                border={choice === true ? "1px" : "0px"}
                backgroundColor={"#F6F6F6"}
                onClick={() => setChoice(true)}>
                ✅ YES
              </Button>
              <Button
                border={choice === false ? "1px" : "0px"}
                backgroundColor={"#F6F6F6"}
                onClick={() => setChoice(false)}>
                ❌ NO
              </Button>
            </Flex>
          )}
          {placedSuccesfull ? (
            <RWebShare
              data={{
                text: "I betcha that",
                url: `https://betcha.lol/bet${address}`,
                title: "Betcha",
              }}
              onClick={() =>
                toast({
                  title: "shared/copied succesfully!!",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                })
              }>
              <Button
                backgroundColor={"black"}
                rounded={"full"}
                width={"100%"}
                colorScheme="blue">
                Copy bet invite link
              </Button>
            </RWebShare>
          ) : (
            <Button
              disabled={isLoading || isWriting}
              isLoading={isLoading || isWriting || isApproving}
              backgroundColor={"black"}
              rounded={"full"}
              width={"100%"}
              onClick={
                !approved && !isZeroAddress
                  ? () => approveContractResult?.()
                  : () => vote?.()
              }
              colorScheme="blue">
              {!approved && !isZeroAddress ? "Approve bet" : "Place Bet"}
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Bet;
