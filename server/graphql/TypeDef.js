const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    _id: ID!
    content: String!
    createdAt: String!
    username: String!
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
    editPost(postId: ID!): Post!
  }
`;
