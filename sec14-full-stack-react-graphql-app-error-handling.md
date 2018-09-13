# Section 13: Full Stack React GraphQL App - Error Handling
## race condition
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%202.22.46%20PM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%202.26.36%20PM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%202.27.59%20PM.png)

## fixing login process
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%202.30.15%20PM.png)

#### LoginForm.js

```js
// associate the query with the mutation
export default graphql(query)(
  graphql(mutation)(LoginForm)
);
```

## The need for Higher Order Components (HOC)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%202.45.56%20PM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%202.47.07%20PM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%202.48.49%20PM.png)

```js
import React, { Component } from "react";
import { graphql } from 'react-apollo';
import { hashHistory } from 'react-router';

import currentUserQuery from "../queries/CurrentUser";

export default (WrappedComponent) => {
  class RequireAuth extends Component {
    componentDidMount() {

      const {loading, user} = this.props.data;
      if (!loading && !user) {
        hashHistory.push("/login");
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return graphql(currentUserQuery)(RequireAuth);
}
```