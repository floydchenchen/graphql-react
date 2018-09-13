# Section 11: More on Client Side Mutations
## Optimistic UI updates and handling optimistic response
![](https://raw.githubusercontent.com/floydchenchen/pictures/master/Screen%20Shot%202018-09-13%20at%201.30.04%20AM.png)

#### LyricList.js
```js
onLike = (id, likes) => {
    this.props.mutate({
      variables: { id },
      optimisticResponse: {
        __typename: "Mutation",
        likeLyric: {
          id: id,
          __typename: "LyricType",
          likes: likes + 1
        }
      }
    });
  };
```