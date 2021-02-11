import { instance } from './MainService';
import AuthService from '../api/AuthService';

class BankService {
  fetchBanks = async () => {
    return instance.get('/api/banks/', {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  createBank = bank => {
    return instance.post('/api/banks/', JSON.stringify(bank), {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  editBank = bank => {
    return instance.put('/api/banks/', JSON.stringify(bank), {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };
}

export default new BankService();
