import { observable, action, runInAction } from 'mobx';
import UserService from '../api/UserService';
import FeedBack from '../util/FeedBack';

class UserStore {
  @observable users = [];
  @observable state = 'initial'; // pending | success | done | error ;
  @observable stateMessage = '';
  @observable user = {
    username: '',
    password: '',
    email: '',
    roles: [],
    bank: ''
  };
  @observable roles = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action async createUser(submittedUser) {
    try {
      const response = await UserService.addUser(submittedUser);
      runInAction(() => {
        const newUser = response.data;
        const username = newUser.username;
        this.state = 'success';
        this.stateMessage = `User with username ${username} created successfully`;
        this.getAllUsers();
        FeedBack.triggerMessage(
          'success',
          'User Creation',
          this.stateMessage,
          4000
        );
      });
    } catch (error) {
      runInAction(() => {
        if (error.message.includes('Network Error')) {
          FeedBack.triggerMessage(
            'error',
            'User Creation',
            error.response,
            4000
          );
          return;
        } else {
          FeedBack.triggerMessage(
            'error',
            'User Creation',
            error.response.data.message,
            4000
          );
        }
      });
    }
  }

  @action async editUser(submittedUser) {
    try {
      const response = await UserService.editUser(submittedUser);
      runInAction(() => {
        const newUser = response.data;
        console.log(newUser);
        const username = newUser.username;
        this.state = 'success';
        this.stateMessage = `User with username ${username} edited successfully`;
        this.getAllUsers();
        FeedBack.triggerMessage(
          'success',
          'User Modification',
          this.stateMessage,
          4000
        );
      });
    } catch (error) {
      runInAction(() => {
        if (error.message.includes('Network Error')) {
          FeedBack.triggerMessage(
            'error',
            'User Modification',
            error.response,
            4000
          );
          return;
        } else {
          FeedBack.triggerMessage(
            'error',
            'User Creation',
            error.response.data.message,
            4000
          );
        }
      });
    }
  }

  @action removeUser(user) {
    let newUsers = this.users.filter(
      selectedUser => user.userId !== selectedUser.userId
    );
    this.user.concat(newUsers);
  }

  @action async getAllUsers() {
    try {
      const response = await UserService.getAllUsers();
      runInAction(() => {
        let newUsers = response.data;
        this.users = newUsers;
      });
    } catch (error) {
      console.log(error.message);
      FeedBack.triggerMessage(
        'error',
        'Featching Users ...',
        error.message,
        4000
      );
    }
  }

  @action async getAllRoles() {
    try {
      const response = await UserService.getAllRoles();
      runInAction(() => {
        let newRoles = response.data;
        this.roles = newRoles;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error.message);
        FeedBack.triggerMessage(
          'error',
          'Featching Roles',
          error.message,
          4000
        );
      });
    }
  }

  @action resetState() {
    this.state = 'initial';
    this.stateMessage = '';
  }
}

export default new UserStore();
