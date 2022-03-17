const postsResolver = require("./posts");

const usersResolver = require("./users");

module.exports = {
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },

  Query: {
    ...postsResolver.Query,
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...postsResolver.Mutation,
  },
};
