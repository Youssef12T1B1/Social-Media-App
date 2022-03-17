const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const jwt_Secret = require("../../config/.env").jwtSecret;
const { validateRegister, validateLogin } = require("../validator");

function Token(user) {
  return jwt.sign({ username: user.username, _id: user._id }, jwt_Secret, {
    expiresIn: "1h",
  });
}
module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      //validate Fields
      const { valid, errors } = validateRegister(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //unique username
      const Testuser = await User.findOne({ username });
      if (Testuser) {
        throw new UserInputError("Username already exists");
      }
      //hash password
      password = await bcrypt.hash(password, 12);
      const user = new User({
        username,
        email,
        password,
      });
      // new User res
      const result = await user.save();

      const token = Token(result);

      return {
        ...result._doc,
        token,
      };
    },
    async login(_, { username, password }) {
      const { errors, valid } = validateLogin(username, password);
      const user = await User.findOne({ username });
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      if (!user) {
        errors.connect = "User not found";
        throw new UserInputError("authentication failed", { errors });
      }
      const hashpass = await bcrypt.compare(password, user.password);
      if (!hashpass) {
        errors.connect = "User not found";
        throw new UserInputError("authentication failed", { errors });
      }

      const token = Token(user);

      return {
        ...user._doc,
        token,
      };
    },
  },
};
