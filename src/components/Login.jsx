import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../App';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(apiUrl + '/api/users/login', { username, password });

      // Guardar token y rol en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      console.log(response.data.role)
      history('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

//funcion para ir al menu publico
  const navigateToMenu = () => {
    history('/menu');
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Login</button>
      <button onClick={navigateToMenu}>Ver Menu</button>
    </form>
  );
};

export default Login;