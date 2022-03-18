const Post = require("../../models/post");

const { validateCreateComment, validateEditComment } = require("../validator");
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
      const { valid, errors } = validateEditComment();
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const Testpost = await Post.findById(postId);
      if (!Testpost) {
        throw new UserInputError("The post has been deleted");
      }
      if (Testpost) {
        if (Testpost.username !== user.username) {
          throw new UserInputError("no Edit for u buddy");
        }
      }
      Testpost.content = content;
      Testpost.save();
      return Testpost;
    },
  },
};
