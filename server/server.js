const { ApolloServer, gql } = require("apollo-server");
const connectDb = require("./config/db");
const Is_Auth = require("./graphql/Middleware/auth");

connectDb();
const typeDefs = require("./graphql/TypeDef");

const resolvers = require("./graphql/resolvers/main");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: Is_Auth,
});

server
  .listen({ port: 4000 })
  .then((res) => {
    console.log(`server running at port ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
