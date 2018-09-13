# Section 13: Full Stack React GraphQL App - Frontend
## figure out the current user
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%2011.25.34%20AM.png)

## including cookies with graphql requests
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%2012.01.00%20PM.png)

#### index.js
```js
// customized network interface instead of default one
// the new default network interface seems to fix the problem
const networkInterface = createNetworkInterface({
  uri: "/graphql",
  opts: {
    // send along cookies whenever it makes a query to the backend server.
    credentials: "same-origin"
  }
});

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: obj => obj.id
});
```

## authentication state

## automatic component rerender
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%2012.39.09%20PM.png)

#### Header.js
```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';

import query from "../queries/CurrentUser";
import mutation from "../mutations/Logout";

class Header extends Component {

  renderButtons = () => {

    const { loading, user } = this.props.data;

    if (loading) { return <div />; }

    if (user) {
      return (
        <li><a onClick={this.onLogoutClick}>Logout</a></li>
      )
    } else {
      return (
        <div>
          <li>
            <Link to="/signup">Sign up</Link>
          </li>
          <li>
            <Link to="/login">Log in</Link>
          </li>
        </div>
      )
    }
  };

  onLogoutClick = () => {
    this.props.mutate({
      // re-render
      refetchQueries: [{ query }]
    });
  };

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo left">
            Home
          </Link>
          <ul className="right">
            {this.renderButtons()}
          </ul>
        </div>
      </nav>
    )
  }
}

export default graphql(mutation)(
  graphql(query)(Header)
);
```

## login form design
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%2012.44.40%20PM.png)

## error handling with graphql
