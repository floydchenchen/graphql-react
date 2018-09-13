# Section 10: React Router and GraphQL
## integrating react router with graphql

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-12%20at%204.33.47%20PM.png)

#### SongDetail.js

```js
import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import fetchSong from '../queries/fetchSong';

class SongDetail extends Component {
  render() {
    return (
      <div>
        <h3>Song Detail</h3>
      </div>
    )
  }
}

export default graphql(fetchSong, {
  options: props => {
    return {
      variables: { id: props.params.id }
    }
  }
})(SongDetail);
```

## watching for data

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%201.05.01%20AM.png)

the flow of updating lyrics of a song:

![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%201.03.25%20AM.png)

## caching with DataIdFromObject

#### index.js

```js
const client = new ApolloClient({
  // tell apollo to use the id field to identify the data/obj
  dataIdFromObject: obj => obj.id
});
```

We use this method to tell the Apollo server to re-render the lyrics of a song

updated method: 
https://www.apollographql.com/docs/react/advanced/caching.html