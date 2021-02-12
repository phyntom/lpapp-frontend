import { instance } from './MainService';
import AuthService from '../api/AuthService';

export const fetchIndividualPoliciesByDates = async (startDate, endDate) => {
   const data = { startDate, endDate };
   return await instance.post('/api/reports/policies/indiv', JSON.stringify(data), {
      headers: {
         'Authorization': AuthService.getAccessToken(),
         'Content-Type': 'application/json',
      },
   });
};

export const fetchGroupPoliciesByDates = async (startDate, endDate) => {
   return await instance.POST(
      '/api/reports/policies/group',
      JSON.stringify({
         startDate: startDate,
         endDate: endDate,
      }),
      {
         headers: {
            'Authorization': AuthService.getAccessToken(),
            'Content-Type': 'application/json',
         },
      }
   );
};
