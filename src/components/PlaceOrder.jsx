import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';

const PlaceOrder = () => {
  const [tables, setTables] = useState([]); // Mesas con órdenes
  const [selectedTable, setSelectedTable] = useState('');
  const [inventory, setInventory] = useState([]); // Inventario de productos
  const [order, setOrder] = useState([]); // Pedido actual
  const [dailyRevenue, setDailyRevenue] = useState(0); // Total ganado del día

  // Obtener inventario y mesas desde la API
  useEffect(() => {
    axios.get(apiUrl + '/api/inventory')
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));

    // Obtener las mesas con sus pedidos
    axios.get(apiUrl + '/api/orders')
      .then(response => {
        const ordersByTable = response.data.reduce((acc, order) => {
          if (!acc[order.table_number]) acc[order.table_number] = [];
          acc[order.table_number].push(order);
          return acc;
        }, {});
        setTables(ordersByTable);
      })
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  // Función para agregar un artículo al pedido
  const handleAddToOrder = (item) => {
    setOrder([...order, item]);
  };

  // Función para eliminar un artículo del pedido
  const handleRemoveFromOrder = (item) => {
    setOrder(order.filter(i => i.id !== item.id));
  };

  // Confirmar el pedido
  const handleConfirmOrder = () => {
    const orderData = {
      table_number: selectedTable,
      items: order,
      total: calculateTotal(order), // Calculamos el total
    };

    axios.post(apiUrl + '/api/orders', orderData)
      .then(response => {
        console.log('Order placed:', response.data);
        setTables(prevTables => ({
          ...prevTables,
          [selectedTable]: [...(prevTables[selectedTable] || []), response.data],
        }));
        setOrder([]); // Limpiar el pedido actual
      })
      .catch(error => console.error('Error placing order:', error));
  };

  // Función para calcular el total del pedido
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Función para confirmar el cobro
  const handleMarkAsPaid = (tableNumber) => {
    const ordersToPay = tables[tableNumber] || [];
    const totalForTable = ordersToPay.reduce((total, order) => total + parseFloat(order.total), 0);

    // Sumar el total ganado en el día
    axios.post(apiUrl + '/api/daily_revenue', { total: totalForTable })
      .then(() => {
        setDailyRevenue(prevRevenue => prevRevenue + totalForTable); // Actualizar el total del día
        // Borrar las órdenes para la mesa una vez cobrado
        axios.delete(apiUrl + `/api/orders/${tableNumber}`)
          .then(() => {
            setTables(prevTables => {
              const newTables = { ...prevTables };
              delete newTables[tableNumber]; // Eliminar la mesa
              return newTables;
            });
            console.log('Mesa cobrada y órdenes eliminadas.');
          })
          .catch(error => console.error('Error deleting orders for table:', error));
      })
      .catch(error => console.error('Error updating daily revenue:', error));
  };

  return (
    <div>
      <h1>Hacer Pedido</h1>

      {/* Seleccionar mesa */}
      <div>
        <label>Mesa:</label>
        <input
          type="number"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        />
      </div>

      {/* Mostrar inventario */}
      <div>
        <h2>Inventario</h2>
        <ul>
          {inventory.map(item => (
            <li key={item.id}>
              {item.name} - {item.quantity}
              <button onClick={() => handleAddToOrder({ ...item, quantity: 1 })}>Agregar</button>
              <button onClick={() => handleRemoveFromOrder(item)}>Quitar</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmar pedido */}
      <button onClick={handleConfirmOrder}>Confirmar Pedido</button>

      {/* Mostrar pedido actual */}
      <div>
        <h2>Pedido Actual</h2>
        <ul>
          {order.map((item, index) => (
            <li key={index}>{item.name} - {item.quantity}</li>
          ))}
        </ul>
      </div>

      {/* Mostrar mesas con sus pedidos */}
      <div>
        <h2>Pedidos por Mesa</h2>
        {Object.keys(tables).map((tableNumber) => (
          <div key={tableNumber}>
            <h3>Mesa {tableNumber}</h3>
            <ul>
              {tables[tableNumber].map(order => (
                <li key={order.id}>
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.name} - {item.quantity}
                    </div>
                  ))}
                  <p>Total: {order.total}</p>
                  <button onClick={() => handleMarkAsPaid(tableNumber)}>Cobrar</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mostrar ganancias del día */}
      <div>
        <h2>Ganancias del Día: {dailyRevenue}</h2>
      </div>
    </div>
  );
};

export default PlaceOrder;
