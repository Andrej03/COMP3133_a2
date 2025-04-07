const { GraphQLUpload } = require('graphql-upload');
const { v4: uuidv4 } = require('uuid');
const { employees, users } = require('./data');

module.exports = {
  Upload: GraphQLUpload,
  Query: {
    employees: () => employees,
    employee: (_, { id }) => employees.find(emp => emp.id === id),
  },
  
  Mutation: {
    createEmployee: (_, { input }) => {
      const newEmployee = { id: uuidv4(), ...input, profilePicture: null };
      employees.push(newEmployee);
      return newEmployee;
    },

    updateEmployee: (_, { id, input }) => {
      const index = employees.findIndex(emp => emp.id === id);
      if (index === -1) {
        throw new Error('Employee not found');
      }
      employees[index] = { ...employees[index], ...input };
      return employees[index];
    },

    deleteEmployee: (_, { id }) => {
      const index = employees.findIndex(emp => emp.id === id);
      if (index !== -1) {
        employees.splice(index, 1);
        return true;
      }
      return false;
    },

    signup: (_, { name, email, password }) => {
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
      }
      const newUser = { id: uuidv4(), name, email, password };
      users.push(newUser);
      
      return {
        token: 'dummy-token',
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      };
    },

    login: (_, { email, password }) => {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      return {
        token: 'dummy-token',
        user: { id: user.id, name: user.name, email: user.email }
      };
    }
  }
};
