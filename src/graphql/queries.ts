import { gql } from "@apollo/client";

export const GET_ALL_WAGERED = gql`
  query GetAllWagered($gambler: String!) {
    wageredEvents(where: { gambler: $gambler }) {
      gambler
      tokenAddress
      amount
      contractAddress
    }
  }
`;

export const GET_ALL_WAGERED_PREV = gql`
  query GetWagered {
    wageredEvents(
      where: { gambler: "0x4fFACe9865bDCBc0b36ec881Fa27803046A88736" }
    ) {
      gambler
      tokenAddress
      amount
      contractAddress
    }
  }
`;

export const GET_ALL_MESSAGES_POSTED_IN_CONTRACT = gql`
  query GetAllMessagesPostedInContract {
    messagePostedEvents {
      author
      content
    }
  }
`;
