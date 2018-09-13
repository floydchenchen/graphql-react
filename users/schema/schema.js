const graphql = require('graphql');
const axios = require('axios');


const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

/* DATA TYPES DEFINED TO QUERY */
const CompanyType = new GraphQLObjectType({
  name: "company",
  fields: () => ({
    id: { type:GraphQLString },
    name: { type:GraphQLString },
    description: { type:GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(response => response.data)
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () =>  ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { 
      type: CompanyType,
      // need resolve here since user type's company is different than user model in db
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(response => response.data)
      }
    }
  })
});

/* MUTATION DEFINED FOR ADD, DELETE AND EDIT USERS */
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        return axios.post("http://localhost:3000/users", { firstName, age })
          .then(response => response.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(response => response.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then(response => response.data);
      }
    }
  }
});

/* ROOT QUERY */
// if you give me a valid id, I can give you back an user
// use resolve() to actually go to db and grab that data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) { // args: whatever argument was passed into the original query, "id" in this case
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(response => response.data)
      }
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) { // args: whatever argument was passed into the original query, "id" in this case
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(response => response.data)
      }

    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});