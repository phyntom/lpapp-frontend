import { observable, action, computed, runInAction } from "mobx";
import moment from "moment";
import PolicyService from "../api/PolicyService";
import { rateData } from "../data/Rate";
import ArrayStore from "devextreme/data/array_store";
import notify from "devextreme/ui/notify";

class GroupPolicyStore {
  @observable customerPolicies = [];
  @observable policies = [];

  @observable customerPolicy = {
    customer: {
      nationalId: "",
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: moment(new Date())
        .subtract(18, "year")
        .toDate(),
      age: 18,
      phoneNumber: "",
      email: "",
      spouse: "",
      duration: ""
    },
    rowId: 1,
    loanAmount: 0,
    rate: "",
    netPremium: "",
    accessories: 1000,
    totalPremium: 0,
    duration: ""
  };
  @observable policy = {
    entityName: "",
    entityId: "",
    policyType: 2,
    startDate: new Date(),
    endDate: new Date(),
    duration: 1,
    sumInsured: 0,
    branch: {}
  };

  @observable policiesStore = new ArrayStore({
    // key: 'rowId',
    data: this.policies
  });

  @action changePropertyPolicy(value, key) {
    if (key === "branch") {
      this.policy.branch = value;
    } else {
      this.policy[key] = value;
    }
  }

  @action initPolicy(user) {
    this.policy = {
      entityId: "",
      policyType: 1,
      startDate: new Date(),
      endDate: new Date(),
      duration: 1,
      sumInsured: null,
      branch: this.getUserBranch(user)
    };
  }

  @action changePolicyDuration(duration) {
    this.policy.duration = duration;
    this.policy.endDate = moment(this.policy.startDate)
      .add(duration, "month")
      .subtract(1, "day")
      .toDate();
    let newCustomerPolicies = this.customerPolicies.map(customerPolicy => {
      customerPolicy.duration = duration;
      return customerPolicy;
    });
    for (let customerPolicy of newCustomerPolicies) {
      this.updateCustomerPolicy(customerPolicy, customerPolicy.rowId);
    }
  }
  @action updateCustomerPolicy(customerPolicy, rowId) {
    if (customerPolicy.customer.age && this.policy.duration) {
      customerPolicy.rate = this.getCustomerRate(
        customerPolicy.customer.age,
        this.policy.duration
      );
      customerPolicy.duration = this.policy.duration;
    }
    if (
      customerPolicy.customer.age &&
      this.policy.duration &&
      customerPolicy.loanAmount
    ) {
      customerPolicy.rate = this.getCustomerRate(
        customerPolicy.customer.age,
        this.policy.duration
      );
      customerPolicy.netPremium = this.getCustomerPremium(
        customerPolicy.loanAmount,
        customerPolicy.rate
      );
      customerPolicy.totalPremium = parseInt(
        customerPolicy.netPremium + customerPolicy.accessories
      );
      customerPolicy.duration = this.policy.duration;
    }
    this.customerPolicy = customerPolicy;
    // this.updateCustomerStore(this.customerPolicy, rowId);
    let sum = 0;
    for (let customerPolicy of this.customerPolicies) {
      sum += parseInt(customerPolicy.loanAmount);
    }
    this.insertCustomerPolicies(customerPolicy);
    this.updateCustomerPolicies(customerPolicy);
    this.policy.sumInsured = sum;
  }
  /**
   * method to insert customerPolicy into customerPolicies
   * if it doesn't exist
   * @param {*} customerPolicy
   */
  @action insertCustomerPolicies(customerPolicy) {
    /**
     * check if the customerPolicy already exists if not add it
     */
    let foundCustomerPolicy = this.customerPolicies.find(
      customerPolicyIdx => customerPolicyIdx.rowId === customerPolicy.rowId
    );
    if (!foundCustomerPolicy) {
      this.customerPolicies.push(customerPolicy);
    }
  }
  /**
   * update customerPolicies array to populate the store
   * @param {*} customerPolicy
   */
  updateCustomerPolicies(customerPolicy) {
    const updatedCustomerPolicies = this.customerPolicies.map(
      (customerPolicyIdx, index) => {
        if (customerPolicyIdx.rowId === customerPolicy.rowId) {
          customerPolicyIdx = customerPolicy;
        }
        return customerPolicyIdx;
      }
    );
    this.customerPolicies = updatedCustomerPolicies;
  }
  /**
   * method to fetch the identity througn NIDA
   * @param {*} nationalId
   * @param {*} rowId
   */
  @action async fetchIdentity(nationalId, rowId) {
    try {
      // this.loading = true;
      const response = await PolicyService.getCustomerIdentity(nationalId);
      this.customer = {};
      runInAction(() => {
        this.customerPolicy.customer.nationalId = nationalId;
        this.customerPolicy.customer.firstName = response.data.foreName;
        this.customerPolicy.customer.lastName = response.data.surnames;
        this.customerPolicy.customer.birthDate = moment(
          response.data.birthDate,
          "MM/DD/YYYY"
        ).toDate();
        this.customerPolicy.customer.spouse = response.data.spouse;
        this.customerPolicy.customer.age =
          moment().year() -
          moment(response.data.birthDate, "MM/DD/YYYY").year();
        this.customerPolicy.customer.gender = response.data.sex;
        this.customerPolicy.rowId = rowId;
        this.updateCustomerPolicy(this.customerPolicy, rowId);
      });
    } catch (error) {
      runInAction(() => {
        console.log(error.message);
        notify(
          "Failed to search with national id | Switching to use fake identity",
          "error",
          600
        );
        // this.updateCustomerPolicy(PolicyService.getFakeIdentity(rowId), rowId);
      });
    }
  }
  /**
   * method to calculate the rate
   * @param {*} age
   * @param {*} duration
   */
  getCustomerRate(age, duration) {
    let rates = rateData.filter(rate => {
      return rate.age === age && parseInt(rate.periodMonth) === duration;
    });
    return rates[0].rate;
  }
  /**
   * method to add policy to the database
   * @param {*} paraPolicy
   * @param {*} paraCustomers
   */
  @action async addPolicy(paramPolicy, paramCustomerPolicies) {
    let policy = { ...paramPolicy };
    policy.customerPolicies = paramCustomerPolicies;
    policy.startDate = moment.utc(paramPolicy.startDate).format("MM/DD/YYYY");
    policy.endDate = moment.utc(paramPolicy.endDate).format("MM/DD/YYYY");
    policy.bankName = paramPolicy.branch.bank.bankName;
    policy.policyType = 2;
    let newCustomerPolicies = paramCustomerPolicies.map((data, index) => {
      data.customer.birthDate = moment(data.customer.birthDate).format(
        "MM/DD/YYYY"
      );
      return data;
    });
    policy.customerPolicies = newCustomerPolicies;
    try {
      const response = await PolicyService.createGroupPolicy(policy);
      let createdPolicy = {};
      runInAction(() => {
        createdPolicy = response.data;
        notify(
          `Policy ${createdPolicy.policyNumber} Created Successfully`,
          "success",
          600
        );
        this.getPolicies();
      });
    } catch (error) {
      console.log(error);
      notify("Policy not created Successfully", "error", 600);
    }
  }

  @action async updatePolicy(paramPolicy, paramCustomerPolicies) {
    let policy = { ...paramPolicy };
    policy.customerPolicies = paramCustomerPolicies;
    policy.startDate = moment(paramPolicy.startDate).format("MM/DD/YYYY");
    policy.endDate = moment(paramPolicy.endDate).format("MM/DD/YYYY");
    let newCustomerPolicies = paramCustomerPolicies.map((data, index) => {
      data.customer.birthDate = moment(data.customer.birthDate).format(
        "MM/DD/YYYY"
      );
      return data;
    });
    policy.customerPolicies = newCustomerPolicies;
    try {
      const response = await PolicyService.updateGroupPolicy(policy);
      let createdPolicy = {};
      runInAction(() => {
        createdPolicy = response.data;
        notify(
          `Policy ${createdPolicy.policyNumber} Updated Successfully`,
          "success",
          600
        );
        this.getPolicies();
      });
    } catch (error) {
      console.log(error);
      notify("Policy not created Successfully", "error", 600);
    }
  }

  /**
   * method to get the user bankName
   * @param {*} user
   */
  getUserBranch(user) {
    if (user) {
      return user.branch;
    } else {
      return {};
    }
  }

  getCustomerPremium(loanAmount, rate) {
    return Math.floor((loanAmount * rate * 0.77) / 1000);
  }

  @computed get getSizePolicy() {
    return this.policies.length;
  }

  @action getPolicies() {
    PolicyService.fetchPoliciesByPolicyType(2)
      .then(response => {
        runInAction(() => {
          let searchedPolicies = response.data;
          searchedPolicies.map((policy, index) => {
            let startDate = policy.startDate;
            let endDate = policy.endDate;
            policy.startDate = moment(startDate, "MM/DD/YYYY").toDate();
            policy.endDate = moment(endDate, "MM/DD/YYYY").toDate();
            let newCustomerPolicies = policy.customerPolicies.map(
              customerPolicy => {
                let birthDate = customerPolicy.customer.birthDate;
                customerPolicy.customer.birthDate = moment(
                  birthDate,
                  "MM/DD/YYYY"
                ).toDate();
                return customerPolicy;
              }
            );
            policy.customerPolicies = newCustomerPolicies;
            return policy;
          });
          this.policies = searchedPolicies;
        });
      })
      .catch(error => {
        runInAction(() => {
          console.log(error.response);
          console.log(
            error.response.status + " | " + error.response.statusText
          );
        });
      });
  }

  sortCustomerPolicies = customerPolicies => {
    return customerPolicies.sort(
      (customerPolicyIndexOne, customerPolicyIndexTwo) =>
        customerPolicyIndexOne.customerPolicyId >
        customerPolicyIndexTwo.customerPolicyId
          ? 1
          : -1
    );
  };

  @action selectEditPolicy(paramPolicyId) {
    let foundPolicy = this.policies.find(policy => {
      return policy.policyId === parseInt(paramPolicyId);
    });
    if (foundPolicy) {
      this.policy = foundPolicy;
      let sortedCustomerPolicies = this.sortCustomerPolicies(
        foundPolicy.customerPolicies
      );
      this.customerPolicies = sortedCustomerPolicies.map(
        (customerPolicy, index) => {
          customerPolicy.rowId = index + 1;
          let birthDate = customerPolicy.customer.birthDate;
          customerPolicy.customer.birthDate = moment(
            birthDate,
            "DD/MM/YYYY"
          ).toDate();
          return customerPolicy;
        }
      );
    }
  }

  @action reset() {
    this.policies = [];
    this.customerPolicies = [];
    this.customerPolicy = {
      customer: {
        nationalId: "",
        firstName: "",
        lastName: "",
        gender: "",
        birthDate: moment(new Date())
          .subtract(18, "year")
          .toDate(),
        age: 18,
        phoneNumber: "",
        email: "",
        spouse: "",
        duration: ""
      },
      rowId: 1,
      loanAmount: 0,
      rate: "",
      netPremium: "",
      accessories: 1000,
      totalPremium: 0,
      duration: ""
    };
    this.policy = {
      entityName: "",
      entityId: "",
      policyType: 2,
      startDate: new Date(),
      endDate: new Date(),
      duration: 1,
      sumInsured: 0,
      branch: {}
    };
  }

  transformCustomerPolicy(customerPolicies) {
    let customers = customerPolicies.map((data, index) => {
      data.customer.netPremium = data.netPremium;
      data.customer.accessories = data.accessories;
      data.customer.rate = data.rate;
      return data.customer;
    });
    return customers;
  }
}

export default new GroupPolicyStore();
