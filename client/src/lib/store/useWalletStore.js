import { create } from 'zustand';

const useWalletStore = create((set, get) => ({
  balance: 0,
  transactions: [],
  requests: [],
  isLoading: false,
  error: null,
  
  // Fetch wallet balance
  fetchBalance: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/transactions/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch balance');
      }
      
      set({
        balance: data.wallet,
        isLoading: false,
      });
      
      return data.wallet;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      });
    }
  },
  
  // Fetch transactions (with optional period filter)
  fetchTransactions: async (period = null) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const url = period 
        ? `http://localhost:8000/api/transactions/filtered-history?period=${period}`
        : 'http://localhost:8000/api/transactions/history';
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch transactions');
      }
      
      set({
        transactions: data.transactions,
        stats: data.stats || null,
        isLoading: false,
      });
      
      return data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      });
    }
  },
  
  // Transfer funds
  transferFunds: async (transferData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/transactions/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Transfer failed');
      }
      
      // Update balance and transactions after successful transfer
      get().fetchBalance();
      get().fetchTransactions();
      
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      });
      throw error;
    }
  },
  
  // Deposit funds
  depositFunds: async (depositData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/transactions/deposit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depositData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Deposit failed');
      }
      
      // Update balance and transactions after successful deposit
      get().fetchBalance();
      get().fetchTransactions();
      
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      });
      throw error;
    }
  },
  
  // Request money from user
  requestMoney: async (requestData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/transactions/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Money request failed');
      }
      
      // Update requests list
      get().fetchMoneyRequests();
      
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      });
      throw error;
    }
  },
  
  // Pay a money request
  payMoneyRequest: async (requestId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/transactions/pay-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }
      
      // Update balance, transactions, and requests
      get().fetchBalance();
      get().fetchTransactions();
      get().fetchMoneyRequests();
      
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      });
      throw error;
    }
  },
  
  // Fetch money requests
  fetchMoneyRequests: async (type = null) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const url = type 
        ? `http://localhost:8000/api/transactions/requests?type=${type}`
        : 'http://localhost:8000/api/transactions/requests';
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      console.log(data);
      console.log("Fetched money requests:", data.requests);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch money requests');
      }
      
      set({
        requests: data.requests,
        isLoading: false,
      });
      
      return data.requests;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));

export default useWalletStore;