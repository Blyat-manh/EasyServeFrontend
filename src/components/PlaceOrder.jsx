import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../App";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const [tables, setTables] = useState({});
  const [selectedTable, setSelectedTable] = useState("");
  const [inventory, setInventory] = useState([]);
  const [order, setOrder] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingTable, setEditingTable] = useState(null);

  const history = useNavigate();
  const navigateToDashboard = () => {
    history("/dashboard");
  };

  // Obtener pedidos y productos
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/inventory`)
      .then((res) => setInventory(res.data))
      .catch((err) => console.error("Error cargando inventario:", err));

    axios
      .get(`${apiUrl}/api/orders`)
      .then((res) => {
        const grouped = res.data.reduce((acc, order) => {
          const table = order.table_number;
          if (!acc[table]) acc[table] = [];
          acc[table].push(order);
          return acc;
        }, {});
        setTables(grouped);
      })
      .catch((err) => console.error("Error cargando pedidos:", err));
  }, []);

  const handleAddToOrder = (item) => {
    setOrder((prev) => {
      const found = prev.find((i) => i.id === item.id);
      return found
        ? prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromOrder = (item) => {
    setOrder((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (!found) return prev;
      if (found.quantity > 1) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        return prev.filter((i) => i.id !== item.id);
      }
    });
  };

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleConfirmOrder = () => {
    if (!selectedTable || order.length === 0)
      return alert("Mesa y pedido requeridos");

    const orderData = {
      table_number: selectedTable,
      items: order,
    };

    axios
      .post(`${apiUrl}/api/orders`, orderData)
      .then((res) => {
        setTables((prev) => ({
          ...prev,
          [selectedTable]: [...(prev[selectedTable] || []), res.data],
        }));
        setOrder([]);
      })
      .catch((err) => console.error("Error al crear pedido:", err));
  };

  const handleMarkAsPaid = (tableNumber) => {
    const orders = tables[tableNumber] || [];

    Promise.all(
      orders.map((order) =>
        axios.post(`${apiUrl}/api/orders/charge/${order.id}`)
      )
    )
      .then(() => {
        const updated = { ...tables };
        delete updated[tableNumber];
        setTables(updated);
      })
      .catch((err) => console.error("Error marcando como pagado:", err));
  };

  const handleDeleteOrder = (orderId, tableNumber) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este pedido?");
    if (!confirmed) return;

    axios
      .delete(`${apiUrl}/api/orders/${orderId}`)
      .then(() => {
        const updated = { ...tables };
        updated[tableNumber] = updated[tableNumber].filter(
          (o) => o.id !== orderId
        );
        if (updated[tableNumber].length === 0) {
          delete updated[tableNumber];
        }
        setTables(updated);
      })
      .catch((err) => console.error("Error eliminando pedido:", err));
  };

  const handleEditOrder = (order, table) => {
    setEditingOrder(order);
    setEditingTable(table);
  };

  const handleUpdateOrder = () => {
    const updatedItems = editingOrder.items;

    axios
      .put(`${apiUrl}/api/orders/${editingOrder.id}`, {
        ...editingOrder,
        items: updatedItems,
      })
      .then((res) => {
        const updatedTables = { ...tables };
        updatedTables[editingTable] = updatedTables[editingTable].map((o) =>
          o.id === res.data.id ? res.data : o
        );
        setTables(updatedTables);
        setEditingOrder(null);
        setEditingTable(null);
      })
      .catch((err) => console.error("Error actualizando pedido:", err));
  };

  return (
    <div>
      <h1>Hacer Pedido</h1>
      <button onClick={navigateToDashboard}>Volver</button>

      {/* Mesa */}
      <div>
        <label>Mesa:</label>
        <input
          type="number"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        />
      </div>
      <div>
        {/* Sección de Bebidas */}
        <h3>Bebidas</h3>
        <ul>
          {inventory
            .filter((item) => item.type === "bebida") // Filtra solo los ítems de tipo 'bebida'
            .sort((a, b) => a.price - b.price) // Ordena por precio
            .map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price}
                <button onClick={() => handleAddToOrder(item)}>Agregar</button>
              </li>
            ))}
        </ul>

        {/* Sección de Tapas */}
        <h3>Tapas</h3>
        <ul>
          {inventory
            .filter((item) => item.type === "tapa") // Filtra solo los ítems de tipo 'tapa'
            .sort((a, b) => a.price - b.price) // Ordena por precio
            .map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price}
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
              {item.name} - {item.quantity} x ${item.price} = $
              {(item.quantity * item.price).toFixed(2)}
              <button onClick={() => handleRemoveFromOrder(item)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
        <p>
          <strong>Total:</strong> ${calculateTotal(order)}
        </p>
        <button onClick={handleConfirmOrder}>Confirmar Pedido</button>
      </div>

      {/* Pedidos por mesa */}
      <div>
        <h2>Pedidos por Mesa</h2>
        {Object.keys(tables).map((table) => (
          <div key={table}>
            <h3>Mesa {table}</h3>
            <ul>
              {tables[table].map((order) => (
                <li key={order.id}>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name} - {item.quantity}
                    </div>
                  ))}
                  <p>Total: ${order.total}</p>
                  <button onClick={() => handleDeleteOrder(order.id, table)}>
                    Eliminar Pedido
                  </button>
                  <button onClick={() => handleEditOrder(order, table)}>
                    Editar Pedido
                  </button>
                </li>
              ))}
            </ul>

            <button onClick={() => handleMarkAsPaid(table)}>Cobrar Mesa</button>
          </div>
        ))}
      </div>
      {editingOrder && (
        <div
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          <h3>Editando Pedido (Mesa {editingTable})</h3>
          <ul>
            {editingOrder.items.map((item, idx) => (
              <li key={idx}>
                {item.name} -
                <button
                  onClick={() => {
                    const updated = editingOrder.items.filter(
                      (_, i) => i !== idx
                    );
                    setEditingOrder({ ...editingOrder, items: updated });
                  }}
                >
                  X
                </button>
                <button
                  onClick={() => {
                    const updated = [...editingOrder.items];
                    updated[idx].quantity += 1;
                    setEditingOrder({ ...editingOrder, items: updated });
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => {
                    const updated = [...editingOrder.items];
                    if (updated[idx].quantity > 1) updated[idx].quantity -= 1;
                    setEditingOrder({ ...editingOrder, items: updated });
                  }}
                >
                  -
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleUpdateOrder}>Guardar Cambios</button>
          <button onClick={() => setEditingOrder(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
/**
 * necesito lo mismo pero para editar un pedido por si solo quiero eliminar una aprte del pedido o añadir una sola cosa sin hacer otro pedido
 */
