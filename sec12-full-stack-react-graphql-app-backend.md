# Section 12: Full Stack React GraphQL App - Backend
## App Overview
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%201.43.04%20AM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%201.43.11%20AM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%201.43.27%20AM.png)

## App Challenges


| Problem | Solution |
| --- | --- |
| Need to show multiple pages | Use React Router for navigation |
| Need to store user data | Store users in MongoDB |
| Users shouldn’t be able to see all details about other users | ??? |
| Need to validate inputs | ??? |
| Need soem solution for authentication | Passport.js |
| Passport isn’t designed with GraphQL in mind | ??? |

## authentication approach
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%202.14.07%20AM.png)

### first authentication approach: decoupled approach
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%2010.29.56%20AM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%2010.33.52%20AM.png)

* pros: easy to separate code and implement
* cons: not work the way graphql intends to

### first authentication approach: coupled approach
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%2010.31.59%20AM.png)

* pros: works the way graphQL intends to 
* cons: passport is not designed to work with graphql, so it adds complexity

## the user type
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%2010.39.02%20AM.png)

#### user_type.js

```js
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString
} = graphql;

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    email: { type: GraphQLString }
  }
});

module.exports = UserType;
```

## the signup, logout and login mutation
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%2010.43.37%20AM.png)

```js
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString
} = graphql;
const UserType = require("./types/user_type");
const AuthService = require("../services/auth");

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.signup({ email, password , req });
      }
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, req) {
        const { user } = req;
        req.logout();
        return user;
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.login({ email, password , req });
      }
    }
  }
});

module.exports = mutation;
```

## checking authentication status

#### root_query_type.js

```js
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
```
