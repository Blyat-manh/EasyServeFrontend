import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';

const PlaceOrder = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [inventory, setInventory] = useState([]);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    // Fetch inventory from API
    axios.get(apiUrl,'/api/inventory')
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  const handleAddToOrder = (item) => {
    setOrder([...order, item]);
  };

  const handleRemoveFromOrder = (item) => {
    setOrder(order.filter(i => i !== item));
  };

  const handleConfirmOrder = () => {
    const orderData = {
      table: selectedTable,
      items: order,
      completed: false,
    };
    axios.post(apiUrl,'/api/orders', orderData)
      .then(response => console.log('Order placed:', response.data))
      .catch(error => console.error('Error placing order:', error));
  };

  return (
    <div>
      <h1>Hacer Pedido</h1>
      <div>
        <label>Mesa:</label>
        <input
          type="number"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        />
      </div>
      <div>
        <h2>Inventario</h2>
        <ul>
          {inventory.map(item => (
            <li key={item.id}>
              {item.name} - {item.quantity}
              <button onClick={() => handleAddToOrder(item)}>Agregar</button>
              <button onClick={() => handleRemoveFromOrder(item)}>Quitar</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleConfirmOrder}>Confirmar Pedido</button>
      <div>
        <h2>Pedido Actual</h2>
        <ul>
          {order.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaceOrder;