import { observable, action, computed, runInAction } from "mobx";
import moment from "moment";
import PolicyService from "../api/PolicyService";
import { rateData } from "../data/Rate";
import FeedBack from "../util/FeedBack";
import ArrayStore from "devextreme/data/array_store";
import notify from "devextreme/ui/notify";

class IndividualPolicyStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable policies = [];
  @observable customers = [];

  @observable loading = false;

  @observable customerPolicy = {
    rowId: "",
    rate: 0,
    netPremium: null,
    accessories: 1000,
    totalPremium: 0,
    loanAmount: 0,
    customer: {
      nationalId: "",
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: new Date(),
      age: 18,
      phoneNumber: "",
      spouse: ""
    }
  };
  @observable policy = {
    entityId: "",
    policyType: 1,
    startDate: new Date(),
    endDate: new Date(),
    duration: 1,
    sumInsured: null,
    branch: this.getUserBranch(this.user)
  };

  @observable policiesStore = new ArrayStore({
    key: "policyId",
    data: this.policies
  });

  insertPoliciesStore(policy) {
    this.policiesStore.push([
      {
        type: "insert",
        data: policy
      }
    ]);
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

  updatePoliciesStore(policy, policyId) {
    this.policiesStore.push([
      {
        type: "update",
        data: policy,
        key: policyId
      }
    ]);
  }

  @action updatePolicy(policy, policyId) {
    let updatedCustomerPolicy = policy.customerPolicies[0];
    if (updatedCustomerPolicy.customer.age && policy.duration) {
      updatedCustomerPolicy.rate = this.getCustomerRate(
        updatedCustomerPolicy.customer.age,
        policy.duration
      );
    }
    if (
      updatedCustomerPolicy.customer.age &&
      policy.duration &&
      policy.sumInsured
    ) {
      updatedCustomerPolicy.loanAmount = policy.sumInsured;
      updatedCustomerPolicy.rate = this.getCustomerRate(
        updatedCustomerPolicy.customer.age,
        policy.duration
      );
      updatedCustomerPolicy.netPremium = this.getCalculatedPremium(
        policy.sumInsured,
        updatedCustomerPolicy.rate
      );
      updatedCustomerPolicy.totalPremium = parseInt(
        updatedCustomerPolicy.netPremium + updatedCustomerPolicy.accessories
      );
    }
    policy.customerPolicies[0] = updatedCustomerPolicy;
    this.updatePolicies(policy);
  }

  @action updatePolicies(policy) {
    const updatedPolicies = this.policies.map((policyIdx, index) => {
      if (policyIdx.policyId === policy.policyId) {
        policyIdx = policy;
      }
      return policyIdx;
    });
    this.policies = updatedPolicies;
  }

  getCustomerRate(age, duration) {
    let rates = rateData.filter(rate => {
      return rate.age === age && parseInt(rate.periodMonth) === duration;
    });
    return rates[0].rate;
  }

  getCalculatedPremium(loanAmount, rate) {
    return Math.floor((loanAmount * rate * 0.77) / 1000);
  }

  @action updatePropertyCustomer(value, key) {
    if (key.includes("customer")) {
      let keys = key.split(".");
      if (key === "customer.birthDate") {
        let age = moment().year() - moment(value).year();
        this.updateAge(value);
        this.updateRate(age, this.policy.duration);
        if (this.policy.sumInsured) {
          this.updatePremium(this.policy.sumInsured);
        }
      }
      this.customerPolicy.customer[keys[1]] = value;
    } else {
      this.customerPolicy[key] = value;
    }
  }

  @action updatePropertyPolicy(value, key) {
    if (key === "branch") {
      this.policy.branch = value;
    } else {
      this.policy[key] = value;
    }
  }

  @action async fetchIdentity(nationalId) {
    try {
      // this.loading = true;
      const response = await PolicyService.getCustomerIdentity(nationalId);
      runInAction(() => {
        this.customerPolicy.customer.firstName = response.data.foreName;
        this.customerPolicy.customer.lastName = response.data.surnames;
        this.customerPolicy.customer.birthDate = moment(
          response.data.birthDate,
          "MM/DD/YYYY"
        ).toDate();
        this.customerPolicy.customer.spouse = response.data.spouse;
        let age =
          moment().year() -
          moment(response.data.birthDate, "MM/DD/YYYY").year();
        this.customerPolicy.customer.age = age;
        this.customerPolicy.customer.gender = response.data.sex;
        if (this.policy.duration) {
          this.updateRate(age, this.policy.duration);
        }
      });
    } catch (error) {
      runInAction(() => {
        FeedBack.triggerMessage(
          "error",
          "Search with National Id",
          error.message,
          2000
        );
      });
    }
  }

  @action saveIndividualPolicy(paraPolicy, customerPolicy) {
    this.policy = { ...paraPolicy };
    this.policy.startDate = moment(paraPolicy.startDate, true).format(
      "MM/DD/YYYY"
    );
    this.policy.endDate = moment(paraPolicy.endDate, true).format("MM/DD/YYYY");
    this.policy.entityName =
      customerPolicy.customer.firstName +
      " " +
      customerPolicy.customer.lastName;
    this.policy.bankName = paraPolicy.branch.bank.bankName;
    this.customerPolicy.customer.birthDate = moment(
      customerPolicy.customer.birthDate,
      true
    ).format("MM/DD/YYYY");
    let customerPolicies = [];
    customerPolicies.push(this.customerPolicy);
    this.policy.customerPolicies = customerPolicies;
    PolicyService.createIndividualPolicy(this.policy)
      .then(response => {
        runInAction(() => {
          FeedBack.triggerMessage(
            "success",
            "Policy Creation",
            "Policy has been created successfully",
            3000
          );
          this.getPolicies();
        });
      })
      .catch(error => {
        runInAction(() => {
          FeedBack.triggerMessage(
            "error",
            "Policy Creation",
            "Policy has not been created !!!",
            3000
          );
        });
      });
    this.policies.push(this.policy);
    this.reset();
  }

  @action removeCustomer = index => {
    let newCustomers = this.customers.filter(
      (customer, sIndex) => index !== sIndex
    );
    this.customers = newCustomers;
  };

  @action updatePremium(value) {
    const netPremium = this.getCalculatedPremium(
      value,
      this.customerPolicy.rate
    );
    this.customerPolicy.netPremium = netPremium;
    this.policy.sumInsured = value;
    this.customerPolicy.loanAmount = value;
    this.customerPolicy.totalPremium =
      netPremium + this.customerPolicy.accessories;
  }

  @action updateAge(date) {
    this.customerPolicy.customer.age =
      moment().year() - moment(date, "DD/MM/YYYY").year();
  }
  @action updateEndDate(duration) {
    this.policy.endDate = moment(this.policy.startDate)
      .add(duration, "month")
      .subtract(1, "day")
      .toDate();
  }
  @action updateRate(age, duration) {
    let rates = rateData.filter(rate => {
      return rate.age === age && parseInt(rate.periodMonth) === duration;
    });
    this.customerPolicy.rate = rates[0].rate;
  }

  @action getPolicies() {
    PolicyService.fetchPoliciesByPolicyType(1)
      .then(response => {
        runInAction(() => {
          let newPolicies = response.data;
          newPolicies.map((policy, index) => {
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
          this.policies = newPolicies;
          notify(`List of individual policies are retrieved`, "success", 1000);
        });
      })
      .catch(error => {
        runInAction(() => {
          console.log(error.response);
          notify(`Cannot get list of policies`, "error", 1000);
        });
      });
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

  @action reset() {
    this.customerPolicy = {
      rowId: "",
      rate: 0,
      netPremium: null,
      accessories: 1000,
      totalPremium: 0,
      loanAmount: 0,
      customer: {
        nationalId: "",
        firstName: "",
        lastName: "",
        gender: "",
        birthDate: moment(new Date())
          .subtract(18, "year")
          .subtract(1, "day")
          .toDate(),
        age: 18,
        phoneNumber: "",
        spouse: ""
      }
    };

    this.policy = {
      entityId: "",
      policyType: 1,
      startDate: new Date(),
      endDate: new Date(),
      duration: 1,
      sumInsured: null,
      branch: {}
    };
  }

  @computed get getPoliciesSize() {
    return this.policies.length;
  }
}

export default new IndividualPolicyStore();
