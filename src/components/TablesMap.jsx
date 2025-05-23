import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/tablesManager.scss';
import { apiUrl } from "../App";

const TablesMap = () => {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [reservationName, setReservationName] = useState("");

  // Fetch tables
  const fetchTables = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/tables`);
      setTables(res.data);
    } catch (error) {
      console.error("Error cargando mesas", error);
    }
  };

  // Fetch active orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/orders/active`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching active orders:", err);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchOrders();
  }, []);

  // Get color según estado
  const getTableColor = (table) => {
    if (table.status === 'reserved') return 'yellow';
    if (orders.some(order => order.table_id === table.id)) return 'red';
    return 'green';
  };

  // Saber si está ocupada con pedido activo
  const isTableOccupied = (tableId) => {
    return orders.some(order => order.table_id === tableId);
  };

  // Abrir popup para poner nombre de reserva
  const openReservationPopup = (table) => {
    if (isTableOccupied(table.id)) return; // si está ocupada no hacer nada
    if (table.status === 'reserved') {
      // Si está reservada, la liberamos directamente
      toggleReservation(table);
      return;
    }
    setSelectedTable(table);
    setReservationName(""); // reset
    setShowPopup(true);
  };

  // Confirmar reserva con nombre
  const confirmReservation = async () => {
    if (!reservationName.trim()) {
      alert("Por favor ingrese un nombre para la reserva.");
      return;
    }
    try {
      // Cambiar estado y guardar nombre
      await axios.put(`${apiUrl}/api/tables/status/${selectedTable.id}`, {
        status: 'reserved',
        reservation_name: reservationName.trim(),
      });
      setShowPopup(false);
      setSelectedTable(null);
      setReservationName("");
      fetchTables();
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      alert("Error guardando la reserva");
    }
  };

  // Cambiar estado de reserva a libre y borrar nombre
  const toggleReservation = async (table) => {
    if (isTableOccupied(table.id)) return; // no hacer nada si está ocupada

    const newStatus = table.status === 'reserved' ? 'free' : 'reserved';

    try {
      await axios.put(`${apiUrl}/api/tables/status/${table.id}`, {
        status: newStatus,
        reservation_name: newStatus === 'free' ? null : table.reservation_name || null,
      });
      fetchTables();
    } catch (error) {
      console.error("Error al cambiar el estado de la mesa:", error);
    }
  };

  // Filtrar mesas reservadas para mostrar con nombre
  const reservedTables = tables.filter(t => t.status === 'reserved');

  return (
    <div>
      <h2>Mapa de Reservas</h2>
      <div className="tables-map">
        {tables.map((table) => (
          <div
            key={table.id}
            className="table-cube"
            style={{ backgroundColor: getTableColor(table) }}
            onClick={() => openReservationPopup(table)}
            title={`Mesa ${table.table_number}`}
          >
            {table.table_number}
          </div>
        ))}
      </div>

      {/* Popup para nombre de reserva */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Reservar Mesa {selectedTable.table_number}</h3>
            <input
              type="text"
              placeholder="Nombre de la reserva"
              value={reservationName}
              onChange={(e) => setReservationName(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={confirmReservation}>Confirmar</button>
              <button onClick={() => setShowPopup(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de mesas reservadas */}
      <div className="reserved-tables-list">
        <h3>Mesas Reservadas</h3>
        {reservedTables.length === 0 && <p>No hay mesas reservadas</p>}
        <ul>
          {reservedTables.map((table) => (
            <li key={table.id}>
              Mesa {table.table_number} - {table.reservation_name || "Sin nombre"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TablesMap;
