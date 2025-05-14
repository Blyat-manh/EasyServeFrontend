import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';
import { useNavigate } from 'react-router-dom';

const Menu =()=>{
  const [inventory, setInventory] = useState([]);
  const history = useNavigate();

useEffect(() => {
    // Obtener inventario de la API
    axios.get(`${apiUrl}/api/inventory`)
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  const handleLogout = () => {
    history('/');
  };
  return (
    <div>
      <h1>Menu</h1>
      <button onClick={handleLogout}>Salir</button>

     <div>
  {/* Sección de Bebidas */}
  <h3>Bebidas</h3>
  <ul>
    {inventory
      .filter(item => item.type === 'bebida') // Filtra solo los ítems de tipo 'bebida'
      .sort((a, b) => a.price - b.price) // Ordena por precio
      .map(item => (
        <li key={item.id}>
          {item.name} - ${item.price}
        </li>
      ))}
  </ul>

  {/* Sección de Tapas */}
  <h3>Tapas</h3>
  <ul>
    {inventory
      .filter(item => item.type === 'tapa') // Filtra solo los ítems de tipo 'tapa'
      .sort((a, b) => a.price - b.price) // Ordena por precio
      .map(item => (
        <li key={item.id}>
          {item.name} - ${item.price}
        </li>
      ))}
  </ul>
</div>
    </div>
  );
};

export default Menu;