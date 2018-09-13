import React, { Component } from 'react';
import { graphql } from "react-apollo";
import { hashHistory } from 'react-router';

import AuthForm from "./AuthForm";
import mutation from "../mutations/Login";
import query from "../queries/CurrentUser";

class LoginForm extends Component {

  constructor(props) {
    super(props);

    this.state = { errors: [] };
  }

  componentWillUpdate(nextProps) {
    // just logged in ==> redirect to dashboard
    if (!this.props.data.user && nextProps.data.user) {
      hashHistory.push("/dashboard");
    }
  }

  onSubmit = ({ email, password }) => {
    this.props.mutate({
      variables: { email, password },
      refetchQueries: [{ query }]
    })
      .catch(res => {
        const errors = res.graphQLErrors.map( error =>  error.message);
        this.setState({ errors });
      });
  };

  render() {
    return (
      <div>
        <h3>Login</h3>
        <AuthForm onSubmit={this.onSubmit} errors={this.state.errors} />
      </div>
    )
  }
}

// associate the query with the mutation
export default graphql(query)(
  graphql(mutation)(LoginForm)
);