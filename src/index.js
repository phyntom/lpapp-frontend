import React from 'react';
import ReactDOM from 'react-dom';
import 'rsuite/dist/styles/rsuite-default.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'mobx-react';
import rootStore from './stores/RootStore';
import individualPolicyStore from './stores/IndividualPolicyStore';
import bankStore from './stores/BankStore';
import userStore from './stores/UserStore';
import authStore from './stores/AuthStore';
import groupPolicyStore from './stores/GroupPolicyStore';
import branchStore from './stores/BranchStore';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.softblue.css';
import './index.css';

const stores = {
  rootStore,
  individualPolicyStore,
  groupPolicyStore,
  bankStore,
  userStore,
  authStore,
  branchStore
};

const Root = (
  <BrowserRouter>
    <Provider {...stores}>
      <App />
    </Provider>
  </BrowserRouter>
);

ReactDOM.render(Root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
