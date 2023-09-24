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
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CountdownTimer from "../component-library/components/CountDownTimer";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const SettleBet: React.FC = () => {
  const [choice, setChoice] = useState<boolean>();
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
          <Text fontSize={"3xl"} mb={4}>
            What was the result for:
          </Text>

          <Heading mb={8}>
            Mel is going to arrive to the venue by the 23rd of September at
            13:00
          </Heading>
          <Divider marginBottom={8} />
          <Flex width={"100%"} justifyContent={"space-evenly"} mb={8}>
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
            backgroundColor={"black"}
            rounded={"full"}
            width={"100%"}
            onClick={handleCreateBet}
            colorScheme="blue">
            Confirm result
          </Button>
          <Text>If you do it wrong, you’ll disappoint your friends 😢</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SettleBet;