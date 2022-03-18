const Post = require("../../models/post");
const { validateCreateComment } = require("../validator");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, { user }) {
      if (!user) throw new AuthenticationError("Auhtentication failed");
      const { valid, errors } = validateCreateComment(postId, body);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      if (body.trim() === "") {
        throw new UserInputError("Empty Comment");
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
  },
};
