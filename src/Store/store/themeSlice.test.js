import themeReducer, { toggleTheme } from './themeSlice';

describe('themeSlice', () => {
  const initialState = {
    darkMode: false,
  };

  test('should return the initial state', () => {
    expect(themeReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should toggle darkMode to true', () => {
    const state = themeReducer(initialState, toggleTheme());
    expect(state.darkMode).toBe(true);
  });

  test('should toggle darkMode back to false', () => {
    const state = themeReducer({ darkMode: true }, toggleTheme());
    expect(state.darkMode).toBe(false);
  });
});