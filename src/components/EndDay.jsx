import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EndDay = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch completed orders from API
    axios.get('http://localhost:5000/api/orders/completed')
      .then(response => {
        setCompletedOrders(response.data);
        const totalAmount = response.data.reduce((sum, order) => sum + order.total, 0);
        setTotal(totalAmount);
      })
      .catch(error => console.error('Error fetching completed orders:', error));
  }, []);

  const handleEndDay = () => {
    axios.post('http://localhost:5000/api/cash/endday', { orders: completedOrders, total })
      .then(() => console.log('Day ended'))
      .catch(error => console.error('Error ending day:', error));
  };

  return (
    <div>
      <h1>Finalizar Día</h1>
      <div>
        <h2>Pedidos Completados</h2>
        <ul>
          {completedOrders.map(order => (
            <li key={order.id}>{order.name} - {order.quantity}</li>
          ))}
        </ul>
        <h3>Total del Día: {total}</h3>
        <button onClick={handleEndDay}>Confirmar</button>
      </div>
    </div>
  );
};

export default EndDay;