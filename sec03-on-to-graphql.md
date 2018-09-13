# Section 03: On To GraphQL
## What is graphQL
### three problems with restful routing
* deciding a URL schema gets tough when we have heavily nested relationships.
* when fetching heavily nested data we might make too many http requests to get data.
* we are vulnerable to over fetching data.

### graph
the graph that GraphQL refers to is the data structure graph

### an example to find all user(id: 23)'s friends companies
 
 1. find user with {id: 23} first
 2. find all friends of the user
 3. then find all companies associated with its friends

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-06%20at%2012.30.17%20AM.png)

```
query {
    user(id: "23") {
        friends {
            company {
                name
            }            
        }
    }
}
```

## working with graphQL

```shell
npm install --save express express-graphql graphql lodash
```

## registering graphql with express
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-06%20at%2012.50.34%20AM.png)

In fact graphQL is just a middleware of express 

## graphql schema
what our data looks like and how can we access the data
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-06%20at%201.00.56%20AM.png)


### schema/schema.js

```js
const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    firstName: { type: GraphQLString},
    age: { type: GraphQLInt}
  }
});
```

## root queries
an entry point into our data

```js
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
      
      }
    }
  }
});
```

## resolving with data

```js
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) { // args: whatever argument was passed into the original query, "id" in this case
        return _.find(users, {id: args.id});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
```

## the GraphiQL tool
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-11%20at%2012.17.01%20PM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-11%20at%2012.19.30%20PM.png)


## using JSON Server

#### package.json
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "json:server": "json-server --watch db.json"
  },
```

#### db.json

```json
{
  "users": [
    {
    "id": "23",
    "firstName": "Bill",
    "age": 20
    },
    {
      "id": "47",
      "firstName": "Samantha",
      "age": 21
    }
  ]
}
```

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-11%20at%2012.19.30%20PM.png)

#### schema.js
```js
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
    }
  }
});
```