const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const app = express();

app.use('/graphql', expressGraphQL({ // pass in an "option" object
  schema,
  graphiql: true // used in a development environment
}));

app.listen(4000, () => {
  console.log('Listening on port 4000');
});