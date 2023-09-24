import {
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Heading,
  Divider,
  Text,
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
} from "wagmi";
import { BigNumber, ethers } from "ethers";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Bet: React.FC = () => {
  const [choice, setChoice] = useState<boolean>();
  let { address } = useParams();
  const nav = useNavigate();
  const contract = {
    address: address as `0x${string}`,
    abi: BETCHA_ROUND_CONTRACT,
  };
  const {
    config: voteConfig,
    error,
    isLoading,
  } = usePrepareContractWrite({
    ...contract,
    functionName: "aightBet",
    args: [choice ? 1 : 0],
    enabled: Boolean(choice),
  });

  const {
    write: vote,
    isLoading: isWriting,
    isSuccess,
    error: wth,
  } = useContractWrite({
    ...voteConfig,
    onSuccess(data) {
      nav(`placed-bet/${address}`);
      console.log({ data });
    },
    onError(error) {
      console.error(error.message);
    },
  });

  const handleCreateBet = () => {
    vote?.();
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

  const [ipfsData, setIpfsData] = useState("");

  useEffect(() => {
    // Fetch data from the IPFS URL when ipfsUrl changes
    if (data?.[4]) {
      fetch(data?.[4])
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
    address: data?.[2],
    enabled: Boolean(data && data?.length > 0),
  });

  console.log({ data });
  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + 1);
  return (
    <Flex
      padding={4}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      width={"100%"}
      height={"100vh"}>
      <Image marginBottom={8} src="/BETCHA.png" alt="Betcha" />
      <Heading marginBottom={4}>Bet preview</Heading>
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
          <Heading mb={4}>I bet you</Heading>
          <Flex width={"100%"} justifyContent={"space-evenly"} mb={8}>
            <Heading>
              {ethers.utils.formatUnits(
                (data?.[3] as BigNumber) ?? 0,
                tokenInfo?.decimals,
              )}
            </Heading>

            <Heading>{tokenInfo?.name}</Heading>
          </Flex>
          <Heading mb={4}>that</Heading>

          <Heading mb={8}>{ipfsData}</Heading>
          <Text fontWeight={"bold"}>Time left to bet:</Text>
          <CountdownTimer
            targetDate={data?.[1] ? data?.[1]?.toNumber() * 1000 : Date.now()}
          />
          <Text marginBottom={8} fontWeight={"bold"}>
            Settled by {data?.[6]}
          </Text>
          <Heading mb={8}>My bet:</Heading>
          <Flex marginBottom={8} width={"100%"} justifyContent={"space-evenly"}>
            <Button
              border={choice ? "1px" : "0px"}
              backgroundColor={"#F6F6F6"}
              onClick={() => setChoice(true)}>
              ✅ YES
            </Button>
            <Button
              border={choice ? "0px" : "1px"}
              backgroundColor={"#F6F6F6"}
              onClick={() => setChoice(false)}>
              ❌ NO
            </Button>
          </Flex>
          <Button
            disabled={isLoading || isWriting}
            isLoading={isLoading || isWriting}
            backgroundColor={"black"}
            rounded={"full"}
            width={"100%"}
            onClick={handleCreateBet}
            colorScheme="blue">
            Place Bet
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Bet;
