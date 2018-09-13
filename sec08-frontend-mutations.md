# Section 08: Front end Mutations
## query parameters/variables
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-12%20at%203.05.06%20PM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-12%20at%203.05.06%20PM.png)

## define query variables in React

#### SongCreate.js

```js
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class SongCreate extends Component {

  constructor(props) {
    super(props);
    this.state = { title: "" };
  }

  onSubmit = event => {
    event.preventDefault();
    this.props.mutate({
      variables: {
        title: this.state.title
      }
    });
  };

  render() {
    return (
      <div>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit}>
          <label>Song Title:</label>
          <input
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    )
  }
}

const mutation = gql(`
  mutation AddSong($title: String) {
    addSong(title: $title) {
      title
    }
  }
`);

export default graphql(mutation)(SongCreate);
```

## trouble shooting list fetching (cache related problem)
the left cold cache is what we desire and the right warm cache might be problematic on the last two steps
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-12%20at%203.25.43%20PM.png)
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-12%20at%203.29.59%20PM.png)

our job: re-run the query that fetches our list of songs after the mutation has been executed.

### refetching queries

#### SongCreate.js
```js
onSubmit = event => {
    event.preventDefault();
    this.props.mutate({
      variables: {
        title: this.state.title
      },
      refetchQueries: [{ query }]
    }).then(() => hashHistory.push('/'));
  };
```

## deletion by mutation

```js
onSongDelete = (id) => {
    this.props.mutate({
      variables: { id },
    }).then(() => this.props.data.refetch());
  };
  
  const mutation = gql(`
  mutation DeleteSong($id: ID) {
    deleteSong(id: $id) {
      id
    }
  }
`);

export default graphql(mutation)(
  graphql(query)(SongList)
);
```