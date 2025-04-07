const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Upload

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    gender: String
    salary: Float
    position: String!
    department: String!
    joiningDate: String
    profilePicture: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type FilePayload {
    filename: String!
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
  }

  input EmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    gender: String
    salary: Float
    position: String!
    department: String!
    joiningDate: String
  }

  input EmployeeUpdateInput {
    firstName: String
    lastName: String
    email: String
    gender: String
    salary: Float
    position: String
    department: String
    joiningDate: String
  }

  type Mutation {
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    signup(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    uploadProfilePicture(file: Upload!): FilePayload!
  }
`;
