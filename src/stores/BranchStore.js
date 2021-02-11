import { observable, action, runInAction } from 'mobx';
import { Branch } from './../model/Branch';
import BranchService from '../api/BranchService';
import FeedBack from './../util/FeedBack';

class BranchStore {
  @observable branch;
  @observable branches = [];
  @observable districts = [];

  constructor() {
    this.branch = new Branch('', '', '', '');
  }

  @action addBranch(branch) {
    new BranchService()
      .createBranch(branch)
      .then(response => {
        runInAction(() => {
          let createdBranch = response.data;
          FeedBack.triggerMessage(
            'success',
            `Branch ${createdBranch.branchName} created successfully`,
            4000
          );
        });
      })
      .catch(error => {
        runInAction(() => {
          console.log(error.message);
        });
      });
  }

  @action editBranch() {}

  @action fetchBranches() {
    new BranchService().fetchBranches().then(response => {
      runInAction(() => {
        this.branches = response.data;
      });
    });
  }
}

export default new BranchStore();
