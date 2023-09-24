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
} from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CountdownTimer from "../component-library/components/CountDownTimer";
import { RWebShare } from "react-web-share";
import { useNavigate, useParams } from "react-router-dom";
import {
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import config from "../config";
import { BETCHA_ROUND_FACTORY_CONTRACT } from "../abis/BetchaRoundFactory";
import { BETCHA_ROUND_CONTRACT } from "../abis/BetchaRound";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const PlacedBet: React.FC = () => {
  const [choice, setChoice] = useState<boolean>();
  const nav = useNavigate();
  let { address } = useParams();
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
    ],
  });

  const toast = useToast();
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
      <Image marginBottom={8} src="./BETCHA.png" alt="Betcha" />
      <Heading marginBottom={4}>You've bet!</Heading>
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
          <Flex mb={8}>
            {choice ? (
              <Button
                border={choice ? "1px" : "0px"}
                backgroundColor={"#F6F6F6"}
                onClick={() => setChoice(true)}>
                ✅ YES
              </Button>
            ) : (
              <Button
                border={choice ? "0px" : "1px"}
                backgroundColor={"#F6F6F6"}
                onClick={() => setChoice(false)}>
                ❌ NO
              </Button>
            )}
          </Flex>

          <Heading mb={4}>I bet you</Heading>
          <Flex width={"100%"} justifyContent={"space-evenly"} mb={8}>
            <Heading>0.005</Heading>

            <Heading>ETH</Heading>
          </Flex>
          <Heading mb={4}>that</Heading>

          <Heading mb={8}>
            Mel is going to arrive to the venue by the 23rd of September at
            13:00
          </Heading>
          <Text fontWeight={"bold"}>Time left to bet:</Text>
          <CountdownTimer targetDate={targetDate} />
          <Text marginBottom={8} fontWeight={"bold"}>
            Settled by Charaf
          </Text>
          <RWebShare
            data={{
              text: "I betcha that",
              url: `https://ibetchu.vercel.app/bet${address}`,
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
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PlacedBet;
