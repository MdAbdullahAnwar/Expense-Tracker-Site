import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../Store/store/themeSlice';
import classes from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(state => state.theme.darkMode);
  
  return (
    <button 
      onClick={() => dispatch(toggleTheme())}
      className={`${classes.toggle} ${darkMode ? classes.dark : ''}`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};

export default ThemeToggle;