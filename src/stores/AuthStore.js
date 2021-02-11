import { observable, action, runInAction } from 'mobx';
import AuthService from '../api/AuthService';
import FeedBack from '../util/FeedBack';

class AuthStore {
  @observable token;
  @observable isLoggedIn = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action authenticate(username, password) {
    AuthService.authenticate(username, username)
      .then(response => {
        runInAction(() => {
          const token = response.data.token;
          const user = response.data.user;
          if (token) {
            this.token = token;
            AuthService.storeAccessToken(token);
            AuthService.storeLoggedInUser(user);
            this.isLoggedIn = true;
            FeedBack.triggerNotification(
              'success',
              'Login Status',
              'Successfully Logged In !!!',
              3
            );
          }
        });
      })
      .catch(error => {
        runInAction(() => {
          FeedBack.triggerNotification(
            'error',
            'Login Status',
            'Invalid username or password !!!',
            3
          );
        });
      });
  }
}

export default new AuthStore();
