import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "https://indexer-betcha-production.up.railway.app/",
  cache: new InMemoryCache(),
});
