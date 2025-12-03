import api from "./api";

// ✅ METHOD 23: Enhanced error handling helper
const handleServiceError = (error, defaultMessage) => {
  if (error.response) {
    // Server responded dengan error status (422, 404, 500, dll)
    const serverMessage = error.response.data?.message || 
                         error.response.data?.error;
    throw new Error(serverMessage || `${defaultMessage}: ${error.response.status}`);
  } else if (error.request) {
    // Request dibuat tapi tidak ada response
    throw new Error('Network error. Please check your internet connection.');
  } else {
    // Error lainnya
    throw new Error(`${defaultMessage}: ${error.message}`);
  }
};

export const transactionsService = {
  // ✅ METHOD 24: Get all transactions (sudah bagus!)
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/transactions", { params });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Error fetching transactions");
    }
  },

  // ✅ METHOD 25: Get single transaction
  getById: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Error fetching transaction");
    }
  },

  // ✅ METHOD 26: Create new transaction
  create: async (transactionData) => {
    try {
      const response = await api.post("/transactions", transactionData);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Error creating transaction");
    }
  },
  
  // ✅ METHOD 27: Update transaction
  update: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Error updating transaction");
    }
  },

  // ✅ METHOD 28: Delete transaction
  delete: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Error deleting transaction");
    }
  },

  // ✅ METHOD 29: ADD THIS - Search transactions
  search: async (query, filters = {}) => {
    try {
      const params = { q: query, ...filters };
      const response = await api.get("/transactions/search", { params });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Error searching transactions");
    }
  },

  // ✅ METHOD 30: ADD THIS - Get financial summary
  getSummary: async () => {
    try {
      const response = await api.get("/transactions/summary");
      return response.data;
    } catch (error) {
      handleServiceError(error, "Error fetching financial summary");
    }
  },

  // ✅ METHOD 31: ADD THIS - Get expenses by category
  getExpensesByCategory: async () => {
    try {
      const response = await api.get("/transactions/expenses-by-category");
      return response.data;
    } catch (error) {
      handleServiceError(error, "Error fetching expenses by category");
    }
  },

  // ✅ METHOD 32: ADD THIS - Get transactions with filters (optional)
  getFiltered: async (filters = {}) => {
    try {
      const response = await api.get("/transactions/filter", { params: filters });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Error fetching filtered transactions");
    }
  }
};

// ✅ METHOD 33: Export default
export default transactionsService;