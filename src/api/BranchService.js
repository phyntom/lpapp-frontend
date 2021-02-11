import { instance } from './MainService';
import AuthService from './AuthService';

class BranchService {
  createBranch = async data => {
    return await instance.post('/api/branches', JSON.stringify(data), {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  editBranch = async data => {
    return await instance.put('/api/branches', JSON.stringify(data), {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  fetchBranches = () => {
    return instance.get('/api/branches', {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };
}

export default BranchService;
