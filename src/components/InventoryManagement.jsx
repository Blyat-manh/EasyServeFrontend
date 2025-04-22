import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });

  useEffect(() => {
    // Obtener inventario de la API
    axios.get(`${apiUrl}/api/inventory`)
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    // Validación del precio
    if (isNaN(newItem.price) || newItem.price <= 0) {
      console.error('El precio debe ser un número válido y mayor que 0');
      return;
    }

    // Crear artículo en el inventario
    axios.post(`${apiUrl}/api/inventory`, newItem)
      .then(response => setInventory([...inventory, response.data]))
      .catch(error => console.error('Error adding item:', error));
  };

  const handleDeleteItem = (id) => {
    // Eliminar artículo del inventario
    axios.delete(`${apiUrl}/api/inventory/${id}`)
      .then(() => {
        setInventory(inventory.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleUpdateItem = (id, updatedItem) => {
    // Validación del precio
    if (isNaN(updatedItem.price) || updatedItem.price <= 0) {
      console.error('El precio debe ser un número válido y mayor que 0');
      return;
    }

    // Actualizar artículo en el inventario
    axios.put(`${apiUrl}/api/inventory/${id}`, updatedItem)
      .then(response => {
        setInventory(inventory.map(item => item.id === id ? response.data : item));
      })
      .catch(error => console.error('Error updating item:', error));
  };

  return (
    <div>
      <h1>Gestión de Inventario</h1>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Nombre del Artículo"
          value={newItem.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={newItem.price}
          onChange={handleInputChange}
        />
        <button onClick={handleAddItem}>Agregar Artículo</button>
      </div>

      <ul>
        {inventory.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => handleDeleteItem(item.id)}>Eliminar</button>
            <button onClick={() => handleUpdateItem(item.id, { name: item.name, price: item.price })}>Actualizar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryManagement;
