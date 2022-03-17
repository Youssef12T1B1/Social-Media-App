const Post = require("../../models/post");
const User = require("../../models/user");
const { validateCreatePost } = require("../validator");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { User } = require("./main");
module.exports = {
  Query: {
    async getPosts(_, __, { user }) {
      try {
        if (!user) throw new AuthenticationError("Authentication Failed");
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async getPost(_, { postId }, { user }) {
      try {
        if (!user) throw new AuthenticationError("Authentication Failed");
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { content }, { user }) {
      if (!user) throw new AuthenticationError("Authentication Failed");
      const { valid, errors } = validateCreatePost(content);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const post = new Post({
        content,
        username: user.username,
        user: user._id,
      });

      const res = await post.save();

      return res;
    },
    async editPost(_, { postId }, { user }) {
      if (!user) throw AuthenticationError("Authentication failed");

      const Testpost = await Post.findById(postId);
      if (Testpost.username !== user.username) {
        throw new UserInputError("no Edit for u buddy");
      }
    },
  },
};
