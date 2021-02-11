import { instance } from './MainService';
import AuthService from '../api/AuthService';
import moment from 'moment';
import faker from 'faker';

class PolicyService {
  getCustomerIdentity = async (nationalId) => {
    return await instance.get(`/api/customers/id/${nationalId}`, {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  getFakeIdentity(paramRowId) {
    let fakeIdentity = {
      rowId: paramRowId,
      accessories: 1000,
      customer: {
        firstName: faker.name.firstName(1),
        lastName: faker.name.lastName(1),
        nationalId: faker.finance.bic(),
        gender: 'M',
        age: faker.random.number({ min: 18, max: 60 }),
        birthDate: moment(new Date())
          .subtract(18, 'year')
          .toDate(),
        spouse: faker.name.findName(),
        phoneNumber: faker.phone.phoneNumber(),
        email: faker.internet.email(faker.name.firstName(1), faker.name.lastName(1), 'gmail.com')
      }
    };

    return fakeIdentity;
  }

  createIndividualPolicy = async (postData) => {
    return await instance.post('/api/policies', JSON.stringify(postData), {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  createGroupPolicy = async (postData) => {
    return await instance.post('/api/policies', JSON.stringify(postData), {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  updateGroupPolicy = async (postData) => {
    return await instance.put('/api/policies', JSON.stringify(postData), {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  fetchPolicies = async () => {
    return await instance.get('/api/policies', {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  fetchPoliciesByPolicyType = async (policyType) => {
    return await instance.get('/api/policies/search', {
      params: {
        policyType: policyType
      },
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };
}

export default new PolicyService();
