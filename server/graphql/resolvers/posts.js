const Post = require("../../models/post");
const { withFilter } = require("graphql-subscriptions");
const { validateCreatePost } = require("../validator");
const { UserInputError, AuthenticationError } = require("apollo-server");

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
    async createPost(_, { content }, { user, pubsub }) {
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
      pubsub.publish("NEW_POST", { newPost: res });
      return res;
    },
    async editPost(_, { postId, content }, { user }) {
      if (!user) throw new AuthenticationError("Authentication failed");
      const { valid, errors } = validateCreatePost(content);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const Testpost = await Post.findById(postId);
      if (Testpost.username !== user.username) {
        throw new UserInputError("no Edit for u buddy");
      }
      Testpost.content = content;
      Testpost.save();
      return Testpost;
    },
    async deletePost(_, { postId }, { user }) {
      try {
        if (!user) throw new AuthenticationError("Authentication failed");

        const Testpost = await Post.findById(postId);
        if (Testpost.username !== user.username) {
          throw new UserInputError("no delete for u buddy");
        }

        await Testpost.delete();
        return "Post Deleted";
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, { user }) {
      if (!user) throw new AuthenticationError("Authentication Failed");

      const post = await Post.findById(postId);
      if (!post) throw new UserInputError("No post Found");
      if (post) {
        if (post.likes.find((l) => l.username === user.username)) {
          post.likes = post.likes.filter((l) => l.username !== user.username);
        } else {
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: withFilter(
        (_, __, { user, pubsub }) => {
          return pubsub.asyncIterator(["NEW_POST"]);
        },
        ({ newPost }, _, { user }) => {
          if (newPost.user.username === user.username) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
