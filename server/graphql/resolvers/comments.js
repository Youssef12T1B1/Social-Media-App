const Post = require("../../models/post");

const {
  validateCreateComment,
  validateEditComment,
  validateDeleteComment,
} = require("../validator");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, { user }) {
      if (!user) throw new AuthenticationError("Auhtentication failed");
      const { valid, errors } = validateCreateComment(postId, body);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    async editComment(_, { postId, body, commentId }, { user }) {
      if (!user) throw new AuthenticationError("Authentication failed");
      const { valid, errors } = validateEditComment(postId, body, commentId);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const Testpost = await Post.findById(postId);
      if (!Testpost) {
        throw new UserInputError("The post has been deleted");
      }
      if (Testpost) {
        const FindIndex = Testpost.comments.findIndex(
          (com) => com.id === commentId
        );
        if (Testpost.comments[FindIndex].username === user.username) {
          Testpost.comments[FindIndex].body = body;
          await Testpost.save();
          return Testpost;
        } else {
          throw new UserInputError("no edit for u buddy");
        }
      }
    },
    async deleteComment(_, { postId, commentId }, { user }) {
      if (!user) throw new AuthenticationError("Authentication failed");
      const { valid, errors } = validateDeleteComment(postId, commentId);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const post = await Post.findById(postId);
      if (!post) throw new UserInputError("This Post has been Deleted");
      if (post) {
        const Index = post.comments.findIndex((com) => com.id === commentId);

        if (post.comments[Index].username === user.username) {
          post.comments.splice(Index, 1);
          await post.save();
          return post;
        } else {
          throw new UserInputError("no delete for u buddy");
        }
      }
    },
  },
};
