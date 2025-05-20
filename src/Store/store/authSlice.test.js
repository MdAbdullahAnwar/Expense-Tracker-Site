import authReducer, { 
  login, 
  logout, 
  activatePremium, 
  deactivatePremium 
} from './authSlice';

describe('authSlice', () => {
  const initialState = {
    isLoggedIn: false,
    token: null,
    userId: null,
    premiumActivated: false
  };

  // Test 1: Initial state
  test('should return the initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  // Test 2: Login action
  test('should handle login with token and userId', () => {
    const payload = { token: 'test-token', userId: 'test-user' };
    const newState = authReducer(initialState, login(payload));
    
    expect(newState.isLoggedIn).toBe(true);
    expect(newState.token).toBe('test-token');
    expect(newState.userId).toBe('test-user');
    expect(newState.premiumActivated).toBe(false);
  });

  // Test 3: Logout action
  test('should handle logout by resetting state', () => {
    const loggedInState = {
      isLoggedIn: true,
      token: 'existing-token',
      userId: 'existing-user',
      premiumActivated: true
    };
    const newState = authReducer(loggedInState, logout());
    
    expect(newState).toEqual(initialState);
  });

  // Test 4: Activate premium
  test('should activate premium', () => {
    const newState = authReducer(initialState, activatePremium());
    expect(newState.premiumActivated).toBe(true);
  });

  // Test 5: Deactivate premium
  test('should deactivate premium', () => {
    const premiumState = {
      ...initialState,
      premiumActivated: true
    };
    const newState = authReducer(premiumState, deactivatePremium());
    expect(newState.premiumActivated).toBe(false);
  });
});