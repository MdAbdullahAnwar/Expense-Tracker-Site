import store from './index';
import { login } from './authSlice';
import { toggleTheme } from './themeSlice';

describe('Redux Store', () => {
  test('should have auth, expenses, and theme slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('expenses');
    expect(state).toHaveProperty('theme');
  });

  test('auth slice should update state on login', () => {
    const token = 'dummy_token';
    const userId = 'user_123';

    store.dispatch(login({ token, userId }));

    const authState = store.getState().auth;
    expect(authState.isLoggedIn).toBe(true);
    expect(authState.token).toBe(token);
    expect(authState.userId).toBe(userId);
  });

  test('theme slice should toggle darkMode', () => {
    const prevState = store.getState().theme.darkMode;

    store.dispatch(toggleTheme());

    const newState = store.getState().theme.darkMode;
    expect(newState).toBe(!prevState);
  });
});