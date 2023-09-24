import React from "react";
import {
  Alert,
  AlertDescription,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { formatDistance } from "date-fns";
import { SortDirection } from "@xmtp/xmtp-js";
import { GET_ALL_MESSAGES_POSTED_IN_CONTRACT } from "../graphql/queries";
import usePostMessage from "../hooks/usePostMessage";

const Trashtalk = () => {
  const [message, setMessage] = useState<string>("");
  const { data: messages, refetch: refetchMessages } = useQuery(
    GET_ALL_MESSAGES_POSTED_IN_CONTRACT,
    {
      variables: {
        contractAddress: "0xb3a2eab23adc21ea78e1851dd4b1316cb2275d9e",
      },
    },
  );

  const { isPreparePostMessageError, postMessageWrite } = usePostMessage(
    "0xb3a2eab23adc21ea78e1851dd4b1316cb2275d9e",
    message,
    refetchMessages,
  );

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const end = endOfMessagesRef.current;
    console.log(messages);
    if (!end || !messages) return;
    end.scrollIntoView();
  }, [messages, endOfMessagesRef]);

  const handlePostMessage = () => {
    if (isPreparePostMessageError) {
      return console.error("preparePostMessageError :(");
    }
    postMessageWrite?.();
  };

  return (
    <>
      <Box flex={6} minHeight={0} overflowY="scroll">
        {/* {messages?.map((message) => {
          const isFromSelf = message.senderAddress === clientAddress;
          return (
            <Box
              key={message.id}
              m={4}
              display="flex"
              justifyContent={isFromSelf ? "right" : "left"}>
              <VStack align={isFromSelf ? "right" : "left"}>
                <Card
                  borderRadius="2xl"
                  backgroundColor={isFromSelf ? "blue.400" : undefined}
                  color={isFromSelf ? "white.400" : undefined}
                  borderBottomRightRadius={isFromSelf ? 0 : undefined}>
                  <CardBody p={4}>{message.content}</CardBody>
                </Card>
                <Text
                  fontSize="xs"
                  color="whiteAlpha.500"
                  align={isFromSelf ? "right" : "left"}>
                  {formatDistance(message.sent, new Date(), {
                    addSuffix: true,
                  })}
                </Text>
              </VStack>
            </Box>
          );
        })} */}
        {/* <div ref={endOfMessagesRef} /> */}
      </Box>
      <Divider borderColor="whiteAlpha.400" />
      <Box p={2} flex={1}>
        <Box p={2} backgroundColor="whiteAlpha.200" borderRadius="2xl">
          <Textarea
            px={2}
            rows={1}
            backgroundColor="transparent"
            placeholder="Say gmeow"
            resize="none"
            border="none"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handlePostMessage();
              }
            }}
          />
          <Box display="flex" justifyContent="right">
            <Button disabled={!message} onClick={handlePostMessage}>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Trashtalk;
