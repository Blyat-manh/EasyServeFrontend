import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const [tables, setTables] = useState({});
  const [selectedTable, setSelectedTable] = useState('');
  const [inventory, setInventory] = useState([]);
  const [order, setOrder] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState(0);

  const history = useNavigate();
  const navigateToDashboard = () => {
    history('/dashboard');
  };

  // Cargar inventario y pedidos al iniciar
  useEffect(() => {
    axios.get(`${apiUrl}/api/inventory`)
      .then(res => setInventory(res.data))
      .catch(err => console.error('Error fetching inventory:', err));

    axios.get(`${apiUrl}/api/orders`)
      .then(res => {
        const grouped = res.data.reduce((acc, order) => {
          if (!acc[order.table_number]) acc[order.table_number] = [];
          acc[order.table_number].push(order);
          return acc;
        }, {});
        setTables(grouped);
      })
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  // Agregar al pedido actual
  const handleAddToOrder = (item) => {
    setOrder(prev => {
      const found = prev.find(i => i.id === item.id);
      return found
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  // Quitar del pedido actual
  const handleRemoveFromOrder = (item) => {
    setOrder(prev => {
      const found = prev.find(i => i.id === item.id);
      if (!found) return prev;
      if (found.quantity > 1) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i);
      } else {
        return prev.filter(i => i.id !== item.id);
      }
    });
  };

  // Calcular total
  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  // Confirmar pedido y enviarlo
  const handleConfirmOrder = () => {
    if (!selectedTable || order.length === 0) return alert('Mesa y pedido son requeridos');

    const orderData = {
      table_number: selectedTable,
      items: order,
      total: calculateTotal(order),
    };

    axios.post(`${apiUrl}/api/orders`, orderData)
      .then(res => {
        setTables(prev => ({
          ...prev,
          [selectedTable]: [...(prev[selectedTable] || []), res.data],
        }));
        setOrder([]);
      })
      .catch(err => console.error('Error placing order:', err));
  };

  // Marcar mesa como pagada
  const handleMarkAsPaid = (tableNumber) => {
    const orders = tables[tableNumber] || [];
    const total = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    axios.post(`${apiUrl}/api/daily_revenue`, { total })
      .catch(err => console.warn('Warning: revenue endpoint not found (optional)', err));

    axios.delete(`${apiUrl}/api/orders/${tableNumber}`)
      .then(() => {
        const updated = { ...tables };
        delete updated[tableNumber];
        setTables(updated);
        setDailyRevenue(prev => prev + total);
      })
      .catch(err => console.error('Error deleting orders for table:', err));
  };

  return (
    <div>
      <h1>Hacer Pedido</h1>
      <button onClick={navigateToDashboard}>Volver</button>

      {/* Selección de mesa */}
      <div>
        <label>Mesa:</label>
        <input
          type="number"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        />
      </div>

      {/* Inventario disponible */}
      <div>
        <h2>Inventario</h2>
        <ul>
          {inventory.map(item => (
            <li key={item.id}>
              {item.name} - {item.quantity}
              <button onClick={() => handleAddToOrder(item)}>Agregar</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Pedido actual */}
      <div>
        <h2>Pedido Actual</h2>
        <ul>
          {order.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity} x ${item.price} = ${(item.price * item.quantity).toFixed(2)}
              <button onClick={() => handleRemoveFromOrder(item)}>Quitar</button>
            </li>
          ))}
        </ul>
        <p><strong>Total:</strong> ${calculateTotal(order)}</p>
        <button onClick={handleConfirmOrder}>Confirmar Pedido</button>
      </div>

      {/* Pedidos por mesa */}
      <div>
        <h2>Pedidos por Mesa</h2>
        {Object.keys(tables).map(table => (
          <div key={table}>
            <h3>Mesa {table}</h3>
            <ul>
              {tables[table].map(order => (
                <li key={order.id}>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name} - {item.quantity}
                    </div>
                  ))}
                  <p>Total: ${order.total}</p>
                </li>
              ))}
            </ul>
            <button onClick={() => handleMarkAsPaid(table)}>Cobrar Mesa {table}</button>
          </div>
        ))}
      </div>

      {/* Ganancias del día */}
      <div>
        <h2>Ganancias del Día: ${dailyRevenue.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default PlaceOrder;
