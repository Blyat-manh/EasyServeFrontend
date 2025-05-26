import { FaSun, FaMoon } from "react-icons/fa";
import '../styles/themeSwitch.scss';

const ThemeSwitch = ({ theme, setTheme }) => {
  const handleChange = (e) => setTheme(e.target.checked ? "dark" : "light");

  return (
    <label className="theme-switch">
      <input
        className="theme-switch__input"
        type="checkbox"
        role="switch"
        name="dark"
        onChange={handleChange}
        checked={theme === "dark"}
        aria-checked={theme === "dark"}
        aria-label="Cambiar tema"
      />
      <span className="theme-switch__inner">
        {theme === "dark" ? <FaSun className="theme-switch__icon" /> : <FaMoon className="theme-switch__icon" />}
      </span>
      <span className="theme-switch__sr">Cambiar tema</span>
    </label>
  );
};

export default ThemeSwitch;