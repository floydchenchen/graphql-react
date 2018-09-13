# Section 07: Gotchas with Queries in React
## handling pending queries

#### SongList.js

```js
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class SongList extends Component {

  constructor(props) {
    super(props);
  }

  renderSongs() {
    return (this.props.data.songs.map( song => {
      return (
        <li key={song.id} className="collection-item">{song.title}</li>
      )
    }))
  };

  render() {
    if (this.props.data.loading) {
      return (
        <div>Loading...</div>
      )
    }

    return (
      <ul className="collection">
        {this.renderSongs()}
      </ul>
    )
  }
}

const query = gql(`
  {
    songs {
      id
      title
    }
  }
`);

export default graphql(query)(SongList);
```

## architecture review
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-12%20at%202.44.58%20PM.png)


#### SongCreate.js

```js
import React, { Component } from 'react';

class SongCreate extends Component {

  constructor(props) {
    super(props);
    this.state = { title: "" };
  }

  render() {
    return (
      <div>
        <h3>Create a New Song</h3>
        <form>
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

export default SongCreate;
```

#### index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import SongList from './components/SongList';
import App from './components/App';
import SongCreate from './components/SongCreate';

const client = new ApolloClient({});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Router history={hashHistory}>
        <Route path="/" component={App} >
          <IndexRoute  component={SongList} />
          <Route path="song/new" component={SongCreate} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
```