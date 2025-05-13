import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  showPremium: false,
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.items = action.payload;
      const total = action.payload.reduce((sum, item) => sum + Number(item.amount), 0);
      state.showPremium = total > 10000;
    },
    addExpense(state, action) {
      state.items.unshift(action.payload); // Add to top
      const total = state.items.reduce((sum, item) => sum + Number(item.amount), 0);
      state.showPremium = total > 10000;
    },
    removeExpense(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const total = state.items.reduce((sum, item) => sum + Number(item.amount), 0);
      state.showPremium = total > 10000;
    },
  },
});

export const { setExpenses, addExpense, removeExpense } = expenseSlice.actions;
export default expenseSlice.reducer;