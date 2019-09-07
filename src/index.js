import { ApolloServer } from "apollo-server";

import { createStore } from "./utils";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

import { LaunchAPI } from "./datasources/launch";
import { UserAPI } from "./datasources/user";

const store = createStore();

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
