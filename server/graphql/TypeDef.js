const {gql} = require('apollo-server')


module.exports = gql`
type Post{
        _id : ID!
        content : String!
        createdAt: String!
        username: String!
    }
input RegisterInput{
    username: String!
    email: String!
    password: String!
    confirmPassword: String!

}    
type User{
    _id : ID!
    username: String!
    token:String!
    createdAt: String!
}
type Query{
    getPosts: [Post]!
}
type Mutation {
    register(registerInput:RegisterInput!): User!
}
`