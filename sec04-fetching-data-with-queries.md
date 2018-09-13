# Section 04: Fetching Data with Queries

## nested queries

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-11%20at%202.00.23%20PM.png)

#### schema.js
```js
const CompanyType = new GraphQLObjectType({
  name: "company",
  fields: {
    id: { type:GraphQLString },
    name: { type:GraphQLString },
    description: { type:GraphQLString },
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    firstName: { type: GraphQLString},
    age: { type: GraphQLInt},
    // need resolve here since user type's company is different than user model in db
    company: { 
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(response => response.data)
      }
    }
  }
});
```

* left: user model used in database
* right: user type used by graphql
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-11%20at%202.03.07%20PM.png)

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-11%20at%202.20.29%20PM.png)

## multiple rootQuery entry points

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
```

## bidirectional relations

this is what we want:
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-11%20at%202.26.35%20PM.png)

a company is has a list of users, while a user has one company

### resolving circular reference
* `UserType` refers to `CompanyType` and vice versa.
* use arrow function for `fields` to form a closure and not instantly call the function

## query fragments

```json
query findCompany {
  apple: company(id: "2") {
		...companyDetails
  }
  
  google: company(id: "2") {
    ...companyDetails
    users {
      id
      age
      firstName
    }
  }
}

fragment companyDetails on company {
  id
  name
  description
}
```

result: 

```json
{
  "data": {
    "apple": {
      "id": "2",
      "name": "Google",
      "description": "search"
    },
    "google": {
      "id": "2",
      "name": "Google",
      "description": "search",
      "users": [
        {
          "id": "47",
          "age": 21,
          "firstName": "Samantha"
        },
        {
          "id": "11",
          "age": 25,
          "firstName": "Floyd"
        }
      ]
    }
  }
}
```

## introduction to mutations
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-11%20at%202.44.42%20PM.png)

### put vs patch
* put: completely replace the object
* patch: replace certain properties of an object

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-11%20at%203.00.13%20PM.png)


```js
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

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
```