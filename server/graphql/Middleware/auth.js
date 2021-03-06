const jwt = require("jsonwebtoken");
const jwtSecret = require("../../config/.env").jwtSecret;

module.exports = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split(" ")[1];

    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }

  return context;
};
