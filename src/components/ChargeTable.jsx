import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChargeTable = () => {
  const [table, setTable] = useState('');
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);

  const handleChargeTable = () => {
    axios.get(`http://localhost:5000/api/orders/table/${table}`)
      .then(response => {
        setOrders(response.data);
        const totalAmount = response.data.reduce((sum, order) => sum + order.total, 0);
        setTotal(totalAmount);
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  const handleMarkAsPaid = () => {
    axios.post(`http://localhost:5000/api/orders/charge/${table}`)
      .then(() => console.log('Table charged'))
      .catch(error => console.error('Error charging table:', error));
  };

  return (
    <div>
      <h1>Cobrar Mesa</h1>
      <div>
        <label>Mesa:</label>
        <input
          type="number"
          value={table}
          onChange={(e) => setTable(e.target.value)}
        />
      </div>
      <button onClick={handleChargeTable}>Cobrar</button>
      <div>
        <h2>Pedidos de la Mesa {table}</h2>
        <ul>
          {orders.map(order => (
            <li key={order.id}>{order.name} - {order.quantity}</li>
          ))}
        </ul>
        <h3>Total: {total}</h3>
        <button onClick={handleMarkAsPaid}>Cobrado</button>
      </div>
    </div>
  );
};

export default ChargeTable;