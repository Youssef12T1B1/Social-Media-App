const postsResolver = require("./posts");
const usersResolver = require("./users");
const commentResolver = require("./comments");

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
    ...commentResolver.Mutation,
  },
};
