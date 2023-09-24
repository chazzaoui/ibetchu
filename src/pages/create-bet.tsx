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
import {
  usePrepareContractWrite,
  useContractWrite,
  useToken,
  useAccount,
} from "wagmi";
import config from "../config";
import { BETCHA_ROUND_FACTORY_CONTRACT } from "../abis/BetchaRoundFactory";
import { BigNumber, ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const CreateBet: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [crypto, setCrypto] = useState("");
  const [betDescription, setBetDescription] = useState("");
  const [dateTime, setDateTime] = useState(Date.now());
  const [timeToBet, setTimeToBet] = useState("");
  const [settler, setSettler] = useState("");
  const nav = useNavigate();
  const {
    data: tokenInfo,
    isLoading: decimalsLoading,
    error: decimalError,
  } = useToken({
    address: crypto as `0x${string}`,
    enabled: Boolean(
      crypto && crypto !== "0x0000000000000000000000000000000000000000",
    ),
  });

  const tokenDecimals =
    crypto !== "0x0000000000000000000000000000000000000000"
      ? tokenInfo?.decimals
      : "18";

  const { address } = useAccount();

  const {
    config: createRoundConfig,
    error,
    isLoading,
  } = usePrepareContractWrite({
    address: config.addresses["base"]?.BetchaFactory,
    abi: BETCHA_ROUND_FACTORY_CONTRACT,
    functionName: "createRound",
    args: [
      crypto as `0x${string}`,
      amount
        ? ethers.utils.parseUnits(amount, tokenDecimals ?? 0)
        : ethers.utils.parseUnits("0", tokenDecimals ?? 0),
      [address!],
      BigNumber.from(Date.now() + timeToBet),
      BigNumber.from(dateTime),
    ],
    enabled: Boolean(
      amount &&
        settler &&
        timeToBet &&
        dateTime &&
        crypto &&
        tokenInfo?.decimals,
    ),
  });

  const {
    write: createRound,
    isLoading: isWriting,
    isSuccess,
    error: wth,
  } = useContractWrite({
    ...createRoundConfig,
    onSuccess(data) {
      console.log({ data });
      nav(`./placed-bet/${data.hash}`);
    },
    onError(error) {
      console.error(error.message);
    },
  });

  const handleDate = (date: any) => {
    const unixTimestamp = new Date(date).getTime() / 1000;
    console.log(unixTimestamp);
    setDateTime(unixTimestamp);
  };

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
    createRound?.();
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
                      <option value={ethers.constants.AddressZero}>
                        Ethereum
                      </option>
                      <option value="0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA">
                        USDC
                      </option>
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
                    onChange={(date) => handleDate(date)}
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
                  width={"100%"}
                  isLoading={isWriting || isLoading}
                  disabled={
                    isWriting ||
                    isLoading ||
                    !amount ||
                    !settler ||
                    !timeToBet ||
                    !dateTime ||
                    !crypto ||
                    !tokenInfo?.decimals
                  }
                  colorScheme="blue">
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
