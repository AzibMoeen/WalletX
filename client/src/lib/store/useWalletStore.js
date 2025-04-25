import { create } from 'zustand';

const useWalletStore = create((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
  
  // Fetch wallet balance
  fetchBalance: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/transaction/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch balance');
      }
      
      set({
        balance: data.balance,
        isLoading: false,
      });
      
      return data.balance;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      });
    }
  },
  
  // Fetch transactions
  fetchTransactions: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/transaction/history', {
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
        isLoading: false,
      });
      
      return data.transactions;
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
      const response = await fetch('http://localhost:8000/api/transaction/transfer', {
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
      const response = await fetch('http://localhost:8000/api/transaction/deposit', {
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
  
  // Clear error state
  clearError: () => set({ error: null }),
}));

export default useWalletStore;