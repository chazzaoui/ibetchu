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
  useToast,
  useToken,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { BETCHA_ROUND_CONTRACT } from "../abis/BetchaRound";
import { useParams } from "react-router-dom";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const SettleBet: React.FC = () => {
  const [choice, setChoice] = useState<boolean>();
  let { address } = useParams();
  const [placedSuccesfull, setPlacedSuccesfull] = useState(false);
  const [ipfsData, setIpfsData] = useState("");
  const contract = {
    address: address as `0x${string}`,
    abi: BETCHA_ROUND_CONTRACT,
  };

  const {
    config: settleConfig,
    error: settleConfigError,
    isLoading,
  } = usePrepareContractWrite({
    ...contract,
    functionName: "settle",
    args: [choice ? 1 : 0],
  });

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

  const {
    write: settle,
    isLoading: isVoting,
    error: settleError,
  } = useContractWrite({
    ...settleConfig,
    onSuccess(data) {
      setPlacedSuccesfull(true);
    },
    onError(error) {
      console.error(error.message);
      setPlacedSuccesfull(false);
    },
  });

  console.log({ settle });

  const handleCreateBet = () => {
    settle?.();
  };

  console.log({ settleError, settleConfigError });

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
      <Heading marginBottom={4}>Settle bet</Heading>
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
          {placedSuccesfull ? (
            <Heading>Done!</Heading>
          ) : (
            <>
              <Text fontSize={"3xl"} mb={4}>
                What was the result for:
              </Text>
              <Heading mb={8}>{ipfsData}</Heading>
              <Divider marginBottom={8} />
              <Flex width={"100%"} justifyContent={"space-evenly"} mb={8}>
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
              <Button
                isLoading={isLoading || isVoting}
                backgroundColor={"black"}
                rounded={"full"}
                width={"100%"}
                onClick={handleCreateBet}
                colorScheme="blue">
                Settle!
              </Button>
              <Text>If you do it wrong, you’ll disappoint your friends 😢</Text>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SettleBet;
