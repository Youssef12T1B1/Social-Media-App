const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const express = require("express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const connectDb = require("./config/db");
const Is_Auth = require("./graphql/Middleware/auth");

connectDb();

const typeDefs = require("./graphql/TypeDef");
const resolvers = require("./graphql/resolvers/main");
const app = express();
const httpSrever = createServer(app);
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server: httpSrever,
    path: "/graphql",
  }
);

let apolloServer = null;
async function startServer() {
  apolloServer = new ApolloServer({
    schema,

    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: Is_Auth,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
startServer();

httpSrever.listen({ port: 4000 });
