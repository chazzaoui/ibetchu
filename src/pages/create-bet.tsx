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
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  usePrepareContractWrite,
  useContractWrite,
  useToken,
  useAccount,
  useContractEvent,
  useWaitForTransaction,
} from "wagmi";
import config from "../config";
import { BETCHA_ROUND_FACTORY_CONTRACT } from "../abis/BetchaRoundFactory";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import { parseUnits, decodeEventLog } from "viem";
import { GET_ALL_WAGERED } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";

const CreateBet: React.FC = () => {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [crypto, setCrypto] = useState("");
  const [betDescription, setBetDescription] = useState("");
  const [dateTime, setDateTime] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [stringTime, setStringTime] = useState("");
  const [timeToBet, setTimeToBet] = useState("");
  const [settler, setSettler] = useState(address);
  const nav = useNavigate();
  const [ipfsUrl, setIpfsUrl] = useState("");

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
        ? parseUnits(amount, (tokenDecimals as number) ?? 0)
        : parseUnits("0", (tokenDecimals as number) ?? 0),
      [address!],
      BigInt(Math.floor(Date.now() / 1000) + Number(timeToBet) * 60),
      BigInt(Math.floor(dateTime / 1000)),
      ipfsUrl,
    ],
    enabled: Boolean(amount && timeToBet && dateTime && crypto),
  });

  const {
    write: createRound,
    isLoading: isWriting,
    isSuccess,
    error: wth,
    data: createRoundTxHash,
  } = useContractWrite({
    ...createRoundConfig,
    onSuccess(data) {
      console.log({ data });
    },
    onError(error) {
      console.error(error.message);
    },
  });

  // Get address of deployed contract
  const { data: createRoundTxReceipt } = useWaitForTransaction({
    hash: createRoundTxHash?.hash!,
  });
  const deployedAddress = useMemo(() => {
    if (!createRoundTxReceipt || !createRoundTxReceipt.logs) return;
    for (const log of createRoundTxReceipt.logs) {
      if (!log) continue;
      try {
        const { args } = decodeEventLog({
          abi: BETCHA_ROUND_FACTORY_CONTRACT,
          eventName: "BetchaRoundCreated",
          topics: log.topics,
          data: log.data,
        });
        return args.deployedAddress;
      } catch (err) {
        continue;
      }
    }
  }, [createRoundTxReceipt]);

  useEffect(() => {
    if (!deployedAddress) return;
    nav(`/bet/${deployedAddress}`);
  }, [deployedAddress]);

  const handleDate = (date: any) => {
    const unixTimestamp = new Date(date).getTime();
    setDateTime(Math.round(unixTimestamp));
  };

  const handleUpload = async (text: string) => {
    setLoading(true);
    try {
      const web3Storage = new Web3Storage({
        token: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
      });
      const file = new File([betDescription], "betDescription.txt", {
        type: "text/plain",
      });
      const cid = await web3Storage.put([file], { wrapWithDirectory: false });
      const url = `https://ipfs.io/ipfs/${cid}`;
      setIpfsUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBet = async () => {
    await handleUpload(betDescription);
  };

  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const {
    loading: walletLoading,
    error: walletError,
    data: allWageredBets,
  } = useQuery(GET_ALL_WAGERED, {
    variables: { gambler: activeWallet?.address },
  });

  useEffect(() => {
    console.log(allWageredBets);
  }, [allWageredBets]);

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
              <div>
                <h1 className="text-4xl">All Bets</h1>
                {allWageredBets.map((item) => {
                  <Flex
                    padding={4}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                    width={"100%"}>
                    <Heading></Heading>
                  </Flex>;
                })}
              </div>
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
                      <option value={ethers.ZeroAddress}>Ethereum</option>
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
                  <Input value={address} />
                </FormControl>

                <Button
                  onClick={ipfsUrl ? () => createRound?.() : handleCreateBet}
                  backgroundColor={"black"}
                  rounded={"full"}
                  width={"100%"}
                  isLoading={isWriting || isLoading || loading}
                  disabled={
                    isWriting ||
                    isLoading ||
                    !amount ||
                    !timeToBet ||
                    !dateTime ||
                    !crypto ||
                    !tokenInfo?.decimals
                  }
                  colorScheme="blue">
                  {ipfsUrl ? "Create Bet" : "Save data"}
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
