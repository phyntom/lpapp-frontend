import { instance } from './MainService';
import AuthService from './AuthService';

class UtilDataService {
  fetchProvinces = () => {
    return instance.get('/api/utilities/provinces', {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };

  fetchDistricts = async () => {
    return await instance.get('/api/utilities/districts', {
      headers: {
        Authorization: AuthService.getAccessToken(),
        'Content-Type': 'application/json'
      }
    });
  };
}

export default new UtilDataService();
