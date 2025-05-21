import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../App";
import { useNavigate } from "react-router-dom";

import OrderForm from "./OrderForm";
import OrderSummary from "./OrderSummary";
import TablesOrders from "./TablesOrders";
import EditOrderModal from "./EditOrderModal";

const PlaceOrder = () => {
  const [tables, setTables] = useState({});
  const [selectedTable, setSelectedTable] = useState("");
  const [inventory, setInventory] = useState([]);
  const [order, setOrder] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [discountRates, setDiscountRates] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/discounts`)
      .then((res) => setDiscountRates(res.data))
      .catch((err) => console.error("Error al cargar descuentos:", err));

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

  const applyDiscount = (subtotal) => {
    for (const rate of discountRates) {
      if (subtotal >= rate.min_order_amount) {
        const discountAmount = subtotal * (rate.discount_rate / 100);
        return {
          discountRate: rate.discount_rate,
          discountAmount,
          total: subtotal - discountAmount,
        };
      }
    }
    return { discountRate: 0, discountAmount: 0, total: subtotal };
  };

  const handleAddToOrder = (item) => {
    setOrder((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      return existing
        ? prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromOrder = (item) => {
    setOrder((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        return prev.filter((i) => i.id !== item.id);
      }
    });
  };

  const handleConfirmOrder = () => {
    if (!selectedTable || order.length === 0) {
      return alert("Mesa y pedido requeridos");
    }

    const subtotal = order.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const { total } = applyDiscount(subtotal);

    const newOrder = {
      table_number: selectedTable,
      items: order.map((item) => ({
        inventory_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    axios
      .post(`${apiUrl}/api/orders`, newOrder)
      .then((res) => {
        setTables((prev) => ({
          ...prev,
          [selectedTable]: [...(prev[selectedTable] || []), res.data],
        }));
        setOrder([]);
      })
      .catch((err) => console.error("Error al crear pedido:", err));
  };

  const handleDeleteOrder = (orderId, tableNumber) => {
    if (!window.confirm("¿Estás seguro de eliminar este pedido?")) return;

    axios
      .delete(`${apiUrl}/api/orders/${orderId}`)
      .then(() => {
        const updated = { ...tables };
        updated[tableNumber] = updated[tableNumber].filter(
          (o) => o.order_id !== orderId
        );
        if (updated[tableNumber].length === 0) {
          delete updated[tableNumber];
        }
        setTables(updated);
      })
      .catch((err) => console.error("Error eliminando pedido:", err));
  };

  const handleMarkAsPaid = (tableNumber) => {
  const orders = tables[tableNumber] || [];
  Promise.all(
    orders.map(order =>
      axios.post(`${apiUrl}/api/orders/charge/${order.id}`)
    )
  )
  .then(() => {
    const updated = { ...tables };
    delete updated[tableNumber];
    setTables(updated);
  })
  .catch(err => console.error("Error cobrando mesa:", err));
};



  const handleEditOrder = (order, table) => {
    setEditingOrder({ ...order });
    setEditingTable(table);
  };

  const handleChangeEditingItem = (idx, action) => {
    const updatedItems = [...editingOrder.items];
    if (action === "remove") {
      updatedItems.splice(idx, 1);
    } else if (action === "increase") {
      updatedItems[idx].quantity += 1;
    } else if (action === "decrease" && updatedItems[idx].quantity > 1) {
      updatedItems[idx].quantity -= 1;
    }
    setEditingOrder({ ...editingOrder, items: updatedItems });
  };

  const handleSaveEdit = () => {
    const subtotal = editingOrder.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const { total } = applyDiscount(subtotal);

    const updatedOrder = {
      ...editingOrder,
      total,
    };

    axios
      .put(`${apiUrl}/api/orders/${editingOrder.id}`, updatedOrder)
      .then((res) => {
        const updated = { ...tables };
        updated[editingTable] = updated[editingTable].map((o) =>
          o.id === res.data.id ? res.data : o
        );
        setTables(updated);
        setEditingOrder(null);
        setEditingTable(null);
      })
      .catch((err) => console.error("Error actualizando pedido:", err));
  };

  return (
    <div>
      <h1>Hacer Pedido</h1>
      <button onClick={() => navigate("/dashboard")}>Volver</button>

      <OrderForm
        inventory={inventory}
        onAddToOrder={handleAddToOrder}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />

      <OrderSummary
        order={order}
        applyDiscount={applyDiscount}
        onRemove={handleRemoveFromOrder}
        onConfirm={handleConfirmOrder}
      />

      <TablesOrders
        tables={tables}
        onDelete={handleDeleteOrder}
        onEdit={handleEditOrder}
        onCharge={handleMarkAsPaid}
      />

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          table={editingTable}
          onChange={handleChangeEditingItem}
          onSave={handleSaveEdit}
          onCancel={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
};

export default PlaceOrder;
