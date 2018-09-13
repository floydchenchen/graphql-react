# Section 09: Automatic Data Caching

## refetching a query: delete query vs add query

### add

```js
import query from '../queries/fetchSongs';

...

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

### delete

```js
const mutation = gql(`
  mutation DeleteSong($id: ID) {
    deleteSong(id: $id) {
      id
    }
  }
`);

...

onSongDelete = (id) => {
    this.props.mutate({
      variables: { id },
    }).then(() => this.props.data.refetch());
  };
```

the reason we can use `this.props.data.refetch()` in `delete` is that: for `add`, we are using a query that is not associated with the component (it is imported), while `delete`'s `mutation` is.

## showing a particular song
