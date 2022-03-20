const jwt = require("jsonwebtoken");
const jwtSecret = require("../../config/.env").jwtSecret;
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
module.exports = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split(" ")[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split(" ")[1];
  }
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }
  context.pubsub = pubsub;
  return context;
};
