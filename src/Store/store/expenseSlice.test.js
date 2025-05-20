import expenseReducer, {
  setExpenses,
  addExpense,
  removeExpense,
  activatePremium
} from './expenseSlice';

describe('expenseSlice', () => {
  const initialState = {
    items: [],
    showPremiumButton: false,
    isPremiumActivated: false,
    totalAmount: 0
  };

  test('should return the initial state', () => {
    expect(expenseReducer(undefined, {})).toEqual(initialState);
  });

  describe('setExpenses', () => {
    test('should set expenses and calculate total', () => {
      const expenses = [
        { id: '1', title: 'Book', amount: 5000 },
        { id: '2', title: 'Food', amount: 3000 }
      ];
      const newState = expenseReducer(initialState, setExpenses(expenses));
      
      expect(newState.items).toEqual(expenses);
      expect(newState.totalAmount).toBe(8000);
      expect(newState.showPremiumButton).toBe(false);
    });

    test('should show premium button when total > 10000', () => {
      const expenses = [
        { id: '1', title: 'Rent', amount: 8000 },
        { id: '2', title: 'Car', amount: 5000 }
      ];
      const newState = expenseReducer(initialState, setExpenses(expenses));
      
      expect(newState.showPremiumButton).toBe(true);
    });

    test('should not show button if premium is active', () => {
      const stateWithPremium = {
        ...initialState,
        isPremiumActivated: true
      };
      const expenses = [
        { id: '1', title: 'Rent', amount: 8000 },
        { id: '2', title: 'Car', amount: 5000 }
      ];
      const newState = expenseReducer(stateWithPremium, setExpenses(expenses));
      
      expect(newState.showPremiumButton).toBe(false);
    });
  });

  describe('addExpense', () => {
    test('should add expense to beginning of array', () => {
      const expense = { id: '1', title: 'Book', amount: 2000 };
      const newState = expenseReducer(initialState, addExpense(expense));
      
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(expense);
      expect(newState.totalAmount).toBe(2000);
    });

    test('should update total amount correctly', () => {
      const existingState = {
        ...initialState,
        items: [{ id: '1', title: 'Food', amount: 3000 }],
        totalAmount: 3000
      };
      const newExpense = { id: '2', title: 'Transport', amount: 1500 };
      const newState = expenseReducer(existingState, addExpense(newExpense));
      
      expect(newState.totalAmount).toBe(4500);
    });

    test('should show premium button when crossing threshold', () => {
      const existingState = {
        ...initialState,
        items: [{ id: '1', title: 'Rent', amount: 9500 }],
        totalAmount: 9500
      };
      const newExpense = { id: '2', title: 'Utilities', amount: 1000 };
      const newState = expenseReducer(existingState, addExpense(newExpense));
      
      expect(newState.showPremiumButton).toBe(true);
    });
  });

  describe('removeExpense', () => {
    const populatedState = {
      items: [
        { id: '1', title: 'Rent', amount: 8000 },
        { id: '2', title: 'Food', amount: 3000 }
      ],
      showPremiumButton: true,
      isPremiumActivated: false,
      totalAmount: 11000
    };

    test('should remove expense by id', () => {
      const newState = expenseReducer(populatedState, removeExpense('1'));
      
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].id).toBe('2');
      expect(newState.totalAmount).toBe(3000);
    });

    test('should update total amount when removing', () => {
      const newState = expenseReducer(populatedState, removeExpense('2'));
      
      expect(newState.totalAmount).toBe(8000);
    });

    test('should hide premium button when below threshold', () => {
      const newState = expenseReducer(populatedState, removeExpense('1'));
      
      expect(newState.showPremiumButton).toBe(false);
    });

    test('should do nothing if id not found', () => {
      const newState = expenseReducer(populatedState, removeExpense('999'));
      
      expect(newState).toEqual(populatedState);
    });
  });

  describe('activatePremium', () => {
    test('should activate premium and hide button', () => {
      const stateWithButton = {
        ...initialState,
        showPremiumButton: true,
        totalAmount: 15000
      };
      const newState = expenseReducer(stateWithButton, activatePremium());
      
      expect(newState.isPremiumActivated).toBe(true);
      expect(newState.showPremiumButton).toBe(false);
    });

    test('should not modify expenses or total', () => {
      const existingState = {
        items: [{ id: '1', title: 'Rent', amount: 5000 }],
        showPremiumButton: false,
        isPremiumActivated: false,
        totalAmount: 5000
      };
      const newState = expenseReducer(existingState, activatePremium());
      
      expect(newState.items).toEqual(existingState.items);
      expect(newState.totalAmount).toBe(existingState.totalAmount);
    });
  });
});