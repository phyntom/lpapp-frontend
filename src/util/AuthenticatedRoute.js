import React, { Component } from 'react';
import AuthService from '../api/AuthService';
import { Redirect, Route } from 'react-router-dom';

class AuthenticatedRoute extends Component {
  render() {
    if (!AuthService.isLoggedIn()) {
      return <Redirect to='/login' />;
    }
    return <Route {...this.props} />;
  }
}

export default AuthenticatedRoute;
