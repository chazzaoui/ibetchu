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

const Convo = () => {
  const { data: messages, refetch: refetchMessages } = useQuery(
    GET_ALL_MESSAGES_POSTED_IN_CONTRACT,
    {
      variables: {
        contractAddress: "0x4fFACe9865bDCBc0b36ec881Fa27803046A88736",
      },
    },
  );

  const { address: clientAddress } = useAccount();

  const [message, setMessage] = useState<string>("");
  const send = useCallback(async () => {
    setMessage("");
    await conversation.send(message);
    refetchMessages();
  }, [conversation, message, refetchMessages]);

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const end = endOfMessagesRef.current;
    if (!end || !messages) return;
    end.scrollIntoView();
  }, [messages, endOfMessagesRef]);

  return (
    <>
      <Box flex={6} minHeight={0} overflowY="scroll">
        {messages?.map((message) => {
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
        })}
        <div ref={endOfMessagesRef} />
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
                send();
              }
            }}
          />
          <Box display="flex" justifyContent="right">
            <Button disabled={!message} onClick={send}>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default function DmPage() {
  const { query } = useRouter();
  const peerAddress = useMemo(() => {
    try {
      const address = z
        .string()
        .startsWith("0x")
        .length(42)
        .parse(query.address) as string;
      return address;
    } catch (err) {
      return null;
    }
  }, [query.address]);
  const { data: user } = trpc.users.getByWallet.useQuery(
    peerAddress as string,
    {
      enabled: Boolean(peerAddress),
    },
  );
  const { address: clientAddress } = useAccount();
  const isMessagingSelf =
    peerAddress?.toLowerCase() === clientAddress?.toLowerCase();

  // XMTP
  const {
    clientId,
    client,
    init: initXmtp,
    conversationsList: {
      data: conversations,
      isLoading: isConversationsLoading,
      refetch: refetchConversations,
    },
  } = useXmtpClient();
  const { data: canMessage, isLoading: isCanMessageLoading } = useQuery({
    queryKey: [clientId, peerAddress as string] as const,
    queryFn: async ({ queryKey }) => client!.canMessage(queryKey[1]),
    enabled: Boolean(client && peerAddress),
    staleTime: 60_000,
  });

  const existingConversationWithPeer = useMemo(
    () =>
      conversations?.find(
        (convo) =>
          convo.peerAddress.toLowerCase() === peerAddress?.toLowerCase(),
      ),
    [conversations, peerAddress],
  );

  const startConversation = useCallback(async () => {
    if (!client || !peerAddress || isConversationsLoading) return;

    // NB: This creates a "topic", and that topic seems to be deterministic on
    // the client,peer address pair (so you can only have 1 conversation between
    // a pair of addresses)
    const conversation = await client.conversations.newConversation(
      peerAddress,
    );
    refetchConversations();
  }, [client, refetchConversations, isConversationsLoading, peerAddress]);

  // Automatically start new conversation if one doesn't exist
  useEffect(() => {
    if (
      !client ||
      !peerAddress ||
      !canMessage ||
      isCanMessageLoading ||
      isConversationsLoading ||
      existingConversationWithPeer ||
      isMessagingSelf
    ) {
      return;
    }
    startConversation();
  }, [
    client,
    peerAddress,
    isConversationsLoading,
    existingConversationWithPeer,
    canMessage,
    isCanMessageLoading,
    isMessagingSelf,
    startConversation,
  ]);

  if (isMessagingSelf) {
    return (
      <PageWithAppBar>
        <Alert status="error">You can{`'`}t message yourself!</Alert>
      </PageWithAppBar>
    );
  }

  return (
    <PageWithAppBar>
      <Box
        position="relative"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        overflow="hidden">
        <VStack pt={2} flex={1}>
          <Avatar />
          <Text fontSize="xs">{user?.username || peerAddress}</Text>
          {!client && <Button onClick={initXmtp}>Init XMTP</Button>}
        </VStack>
        <Divider borderColor="whiteAlpha.400" />
        {!canMessage && !isCanMessageLoading && (
          <Alert>
            <AlertDescription>Recipient has not enabled XMTP</AlertDescription>
          </Alert>
        )}
        {existingConversationWithPeer && (
          <Convo conversation={existingConversationWithPeer} />
        )}
      </Box>
    </PageWithAppBar>
  );
}
