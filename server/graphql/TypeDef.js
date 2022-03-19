const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    _id: ID!
    content: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Like {
    _id: ID!
    username: String!
    createdAt: String!
  }
  type Comment {
    _id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  input PostInput {
    content: String!
    username: String!
    user: ID!
  }
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  type User {
    _id: ID!
    username: String!
    token: String!
    createdAt: String!
  }
  type Query {
    getPosts: [Post]!
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(username: String!, password: String!): User!
    createPost(content: String!): Post!
    deletePost(postId: ID!): String!
    editPost(postId: ID!, content: String!): Post!
    createComment(postId: ID!, body: String!): Post!
    editComment(commentId: ID!, body: String!, postId: ID!): Post!
    deleteComment(commentId: ID!, postId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`;
