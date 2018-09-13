const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID } = graphql;
const UserType = require("./user_type");

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        // if signed in, return the user, else return null ==> not signed in
        return req.user
      }
    }
  }
});

module.exports = RootQueryType;
