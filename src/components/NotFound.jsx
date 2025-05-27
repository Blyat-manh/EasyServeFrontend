import { useNavigate } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch';
import '../styles/login.scss';

const NotFound = ({ theme, setTheme }) => {
  const navigate = useNavigate();

  return (
    <div className="form-wrapper">
      <div className="login-form">
        <div className="segment">
          <h2>Error 404</h2>
          <p>¿Cómo has llegado aquí?</p>
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>

        <div className="segment">
          <button className="button red" onClick={() => navigate('/')}>
            Ir al inicio
          </button>
          <button className="button gray" onClick={() => navigate(-1)}>
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
