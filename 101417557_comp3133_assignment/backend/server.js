// backend/server.js
require('dotenv').config();
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const app = express();
app.use(cors());

// Define your GraphQL schema (type definitions)
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

// Sample data store (for testing)
let employees = [
  { id: '1', name: 'Alice', department: 'HR', position: 'Manager' },
  { id: '2', name: 'Bob', department: 'IT', position: 'Developer' }
];

// Define resolvers for your schema
const resolvers = {
  Query: {
    employees: () => employees,
  },
  Mutation: {
    addEmployee: (_, { name, department, position }) => {
      const newEmployee = {
        id: String(employees.length + 1),
        name,
        department,
        position
      };
      employees.push(newEmployee);
      return newEmployee;
    },
  },
};

// Initialize Apollo Server with the schema and resolvers
async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Start the server
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`GraphQL Server is running at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();
