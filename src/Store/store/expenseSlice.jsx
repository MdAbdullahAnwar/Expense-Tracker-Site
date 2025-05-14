
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  showPremiumButton: false,
  isPremiumActivated: false,
  totalAmount: 0
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.items = action.payload;
      state.totalAmount = action.payload.reduce((sum, item) => sum + item.amount, 0);
      state.showPremiumButton = state.totalAmount > 10000 && !state.isPremiumActivated;
    },
    addExpense(state, action) {
      state.items.unshift(action.payload);
      state.totalAmount += action.payload.amount;
      state.showPremiumButton = state.totalAmount > 10000 && !state.isPremiumActivated;
    },
    removeExpense(state, action) {
      const expense = state.items.find(item => item.id === action.payload);
      if (expense) {
        state.totalAmount -= expense.amount;
      }
      state.items = state.items.filter(item => item.id !== action.payload);
      state.showPremiumButton = state.totalAmount > 10000 && !state.isPremiumActivated;
    },
    activatePremium(state) {
      state.isPremiumActivated = true;
      state.showPremiumButton = false;
    }
  }
});

export const { setExpenses, addExpense, removeExpense, activatePremium } = expenseSlice.actions;
export default expenseSlice.reducer;