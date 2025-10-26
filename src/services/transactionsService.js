import api from "./api";

// crud handling error
export const transactionsService = {
  // get all transactions
  getAll: async () =>{
    try{
      const response = await api.get("/transactions");
      return response.data;
    } catch (error) {
      throw new Error("Error fetching transactions: " + error.message);
    }
  },

  // get single transaction
  getById: async (id) =>{
    try{
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching transaction: " + error.message);
    }
  },

  // Post create new transaction
  create: async (transactionData) =>{
    try{
      const respone = await api.post("/transactions", transactionData);
      return respone.data;
    } catch (error) {
      throw new Error("Error creating transaction: " + error.message);
    }
  },
  
  // Put update transaction
  update: async (id, transactionData) =>{
    try{
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error("Error updating transaction: " + error.message);
    }
  },

  // Delete transaction
  delete: async (id) =>{
    try{
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error deleting transaction: " + error.message);
    }
  },
};