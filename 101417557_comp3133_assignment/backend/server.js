import 'dotenv/config';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';

const app = express();
app.use(cors());

// Define your GraphQL schema 
const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    department: String!
    position: String!
  }
  
  type Query {
    employees: [Employee]
  }
  
  type Mutation {
    addEmployee(name: String!, department: String!, position: String!): Employee
  }
`;  

// Start the GraphQL server
async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`GraphQL Server is running at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();
