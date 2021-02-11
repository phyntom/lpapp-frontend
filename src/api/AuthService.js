import auth from './MainService';

class AuthService {
  
  authenticate = (username, password) => {
    return auth.post('/api/token/generate', {
      username: username,
      password: password
    });
  };

  isLoggedIn = () => {
    const userAccount = sessionStorage.getItem('jwtToken');
    if (!userAccount) {
      return false;
    }
    return true;
  };

  storeAccessToken = token => {
    sessionStorage.setItem('jwtToken', token);
  };

  storeLoggedInUser = user => {
    sessionStorage.setItem('authenticated', JSON.stringify(user));
  };

  getLoggedInUser = () => {
    return sessionStorage.getItem('authenticated');
  };

  removeLoggedInUser = () => {
    sessionStorage.clear();
  };

  getAccessToken = () => {
    return sessionStorage.getItem('jwtToken');
  };
}

export default new AuthService();
