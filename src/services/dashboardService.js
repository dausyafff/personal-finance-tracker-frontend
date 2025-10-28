import api from './api';

export const dashboardService = {
  getDashboardData: async () => {
    try{
      const response = await api.get('/dashboard');
      return response.data;
    } catch(error){
      throw error.response?.data || error.message;
    }
  },

  // get categories
  getCategories: async () => {
    try{
      const response = await api.get('/categories');
      return response.data;
    } catch(error){
      throw error.response?.data || error.message;
    }

  }
}