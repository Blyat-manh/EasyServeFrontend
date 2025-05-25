import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import '../styles/menu.scss';

const Menu = () => {
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${apiUrl}/api/inventory`)
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const getImageUrl = (item) => {
    if (item.image && typeof item.image === 'string' && item.image.startsWith('http')) {
      return item.image;
    }
    return 'https://via.placeholder.com/400x250';
  };

  const getDescription = (item) => item.description || 'Delicious item to enjoy!';

  const renderItems = (type) =>
    inventory
      .filter(item => item.type === type)
      .sort((a, b) => a.price - b.price)
      .map(item => (
        <div className="card" key={item.id}>
          <div className="card-image">
            <img src={getImageUrl(item)} alt={item.name} />
          </div>
          <div className="card-text">
            <h2 className="card-title">{item.name}</h2>
            <p className="card-body">{getDescription(item)}</p>
          </div>
          <div className="card-price">${item.price}</div>
        </div>
      ));

  return (
    <div className="menu">
      <div id="header">
        <h1>Bar Casa Jose</h1>
        <p>Comida casera española</p>
        <button className="btn-login" onClick={handleLogout}>Ir al login</button>
      </div>

      <section className="container">
        <h2>Bebidas</h2>
        {renderItems('bebida')}
      </section>

      <section className="container">
        <h2>Tapas</h2>
        {renderItems('tapa')}
      </section>

      <footer className="footer">
        <div className="footer-content">
          <h3>Bar Casa Jose</h3>
          <p>Dirección: Calle Falsa 123, Madrid, España</p>
          <p>Horario: Lun-Sab 06:00 - 15:30</p>
          <p>Reserva tu mesa: <a href="tel:+34911222333">+34 911 222 333</a></p>
          <p>© 2025 Bar Casa Jose. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
