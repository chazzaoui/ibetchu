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
} from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CreateBet: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [crypto, setCrypto] = useState("");
  const [betDescription, setBetDescription] = useState("");
  const [dateTime, setDateTime] = useState<Value>(new Date());
  const [timeToBet, setTimeToBet] = useState("");
  const [settler, setSettler] = useState("");
  const handleCreateBet = () => {
    // Log the values or send them to an API for further processing
    console.log({
      amount,
      crypto,
      betDescription,
      dateTime,
      timeToBet,
      settler,
    });
  };

  return (
    <Flex
      padding={4}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      width={"100%"}>
      <Image marginBottom={8} src="./BETCHA.png" alt="Betcha" />
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        width={["100%", "80%", "50%"]}>
        <Tabs width={"100%"} isFitted={true}>
          <TabList width={"100%"}>
            <Tab>My bets</Tab>
            <Tab>Create bet</Tab>
          </TabList>

          <TabPanels width={"100%"}>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <Flex
                padding={4}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                flexDirection={"column"}>
                <Heading mb={4}>I bet you</Heading>
                <Flex mb={8}>
                  <FormControl flex="1">
                    <FormLabel>Amount</FormLabel>
                    <Input
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                    />
                  </FormControl>

                  <FormControl flex="1" ml={4}>
                    <FormLabel>Crypto</FormLabel>
                    <Select
                      placeholder="Select crypto"
                      value={crypto}
                      onChange={(e) => setCrypto(e.target.value)}>
                      <option value="ethereum">Ethereum</option>
                      <option value="polygon">Polygon</option>
                      <option value="usdc">USDC</option>
                    </Select>
                  </FormControl>
                </Flex>
                <Heading mb={4}>that</Heading>

                <FormControl mb={8}>
                  <Input
                    placeholder="Say what you are betting"
                    value={betDescription}
                    onChange={(e) => setBetDescription(e.target.value)}
                  />
                </FormControl>
                <Heading mb={8}>by the</Heading>
                <Box marginBottom={8}>
                  <DatePicker
                    selected={dateTime}
                    onChange={(date) => setDateTime(date)}
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    showTimeInput
                  />
                </Box>
                <FormControl mb={8}>
                  <FormLabel>Time to Bet (minutes)</FormLabel>
                  <Input
                    placeholder="Enter time to bet"
                    value={timeToBet}
                    onChange={(e) => setTimeToBet(e.target.value)}
                  />
                </FormControl>

                <FormControl mb={8}>
                  <FormLabel>Who Will Settle It</FormLabel>
                  <Input
                    placeholder="Enter settler"
                    value={settler}
                    onChange={(e) => setSettler(e.target.value)}
                  />
                </FormControl>

                <Button
                  onClick={handleCreateBet}
                  backgroundColor={"black"}
                  rounded={"full"}
                  width={"100%"}>
                  Create Bet
                </Button>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
};

export default CreateBet;
