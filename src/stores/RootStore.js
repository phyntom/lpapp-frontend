import PolicyStore from './IndividualPolicyStore'
import BankStore from './BankStore';
import UserStore from './UserStore';

class RootStore {
    constructor(){
        this.policyStore = new PolicyStore(this);
        this.bankStore = new BankStore(this);
        this.userStore = new UserStore(this);
    }

}
export default RootStore;