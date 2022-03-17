const {ApolloServer, gql} = require('apollo-server')
const connectDb = require('./config/db')


connectDb()
const typeDefs = gql`
    type Query{
         sayHi : String!
    }
`

const resolvers = {
   Query: {
       sayHi:()=> 'hell' 
   }

}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen({ port: 4000})
.then(res =>{
    console.log(`server running at port ${res.url}`);
})
.catch(err =>{
    console.log(err);
})