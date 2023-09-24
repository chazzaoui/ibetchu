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

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const PlacedBet: React.FC = () => {
  const [choice, setChoice] = useState<boolean>();
  const toast = useToast();
  const handleCreateBet = () => {
    // Log the values or send them to an API for further processing
    console.log({
      choice,
    });
  };
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
              url: "https://on.natgeo.com/2zHaNup",
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
