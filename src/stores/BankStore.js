import { observable, action, computed, runInAction } from 'mobx';
import BankService from '../api/BankService';
import notify from 'devextreme/ui/notify';
import FeedBack from '../util/FeedBack';
// configure({enforceActions: "observed"})

class BankStore {
  @observable banks = [];
  @observable bank = {
    bankName: null,
    bankType: '',
    maxSumInsured: 100000000,
    discount: 0
  };

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action addBank(createdBank) {
    this.banks.push(createdBank);
  }

  @action updateBank(bank) {
    BankService.editBank(bank)
      .then((response) => {
        runInAction(() => {
          let createdBank = response.data;
          let newBanks = this.banks.map((bankIdx, index) => {
            if (bankIdx.bankId === bank.bankId) return bank;
            else {
              return bankIdx;
            }
          });
          this.banks = newBanks;
          notify(`Bank with name ${createdBank.bankName} updated successfully`, 'success', 1000);
        });
      })
      .catch((error) => {
        runInAction(() => {
          this.state = 'error';
          this.stateMessage = error.message;
          notify(`Bank not updated successfully | Reason ${this.statusText}`, 'error', 1000);
          console.log(error.response.status + ' | ' + error.response.statusText);
        });
      });
  }

  @action removeBank(bank) {
    let newBanks = this.banks.filter((bankIndex) => bank.bankName !== bankIndex.bankName);
    this.banks.concat(newBanks);
  }

  @action async fetchBanks() {
    try {
      this.state = 'pending';
      const response = await BankService.fetchBanks();
      runInAction(() => {
        this.banks = response.data;
        this.state = 'success';
        notify(`Banks retreived successfully`, 'success', 1000);
      });
    } catch (error) {
      runInAction(() => {
        if (error.message.includes('Network Error')) {
          notify(`Error while fetcing banks | Reason ${error.message}`, 'error', 1000);
        } else {
          notify(`Error while fetcing banks | Reason ${error.response.statusText}`, 'error', 1000);
        }
        console.log(error.message);
      });
    }
  }

  @action reset() {
    this.bank = {
      bankName: null,
      bankType: '',
      maxSumInsured: 100000000,
      discount: 0
    };
  }

  @action resetState() {
    this.state = 'initial';
  }

  @computed get getBanks() {
    return this.banks.length;
  }

  @computed get getPending() {
    return this.state === 'pending';
  }
}

export default new BankStore();
