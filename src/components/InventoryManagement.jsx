import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  useEffect(() => {
    // Fetch inventory from API
    axios.get('http://localhost:5000/api/inventory')
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    axios.post('http://localhost:5000/api/inventory', newItem)
      .then(response => setInventory([...inventory, response.data]))
      .catch(error => console.error('Error adding item:', error));
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
          name="quantity"
          placeholder="Cantidad"
          value={newItem.quantity}
          onChange={handleInputChange}
        />
        <button onClick={handleAddItem}>Agregar Artículo</button>
      </div>
      <ul>
        {inventory.map(item => (
          <li key={item.id}>{item.name} - {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryManagement;