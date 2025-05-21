import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';
import { useNavigate } from 'react-router-dom';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', type: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateItem, setUpdateItem] = useState({ name: '', price: '', type: '' });

  // Función para volver al menú
  const history = useNavigate();
  const navigateToDashboard = () => {
    history('/dashboard');
  };

  useEffect(() => {
    // Obtener inventario desde la API
    axios.get(`${apiUrl}/api/inventory`)
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    // Validación del precio
    if (isNaN(newItem.price) || newItem.price <= 0) {
      console.error('El precio debe ser un número válido y mayor que 0');
      return;
    }
    // Validación del tipo
    if (!newItem.type) {
      console.error('El tipo es obligatorio');
      return;
    }

    // Crear artículo en el inventario
    axios.post(`${apiUrl}/api/inventory`, newItem)
      .then(response => {
        setInventory(prevInventory => [...prevInventory, response.data]);
        setNewItem({ name: '', price: '', type: '' }); // Limpiar campos
      })
      .catch(error => console.error('Error adding item:', error));
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setUpdateItem({ name: item.name, price: item.price, type: item.type });
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateItem(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateItem = () => {
    // Validación del precio
    if (isNaN(updateItem.price) || updateItem.price <= 0) {
      console.error('El precio debe ser un número válido y mayor que 0');
      return;
    }
    // Validación del tipo
    if (!updateItem.type) {
      console.error('El tipo es obligatorio');
      return;
    }

    // Actualizar artículo en el inventario
    axios.put(`${apiUrl}/api/inventory/${selectedItem.id}`, updateItem)
      .then(response => {
        setInventory(prevInventory => prevInventory.map(item =>
          item.id === selectedItem.id ? response.data : item
        ));
        setUpdateItem({ name: '', price: '', type: '' });
        setSelectedItem(null); // Limpiar el artículo seleccionado
      })
      .catch(error => console.error('Error updating item:', error));
  };

  const handleDeleteItem = (id) => {
    axios.delete(`${apiUrl}/api/inventory/${id}`)
      .then(() => {
        setInventory(prevInventory => prevInventory.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

 const handleCancelUpdate = () => {
    // Reseteamos el estado de la selección y el formulario de actualización
    setSelectedItem(null);
    setUpdateItem({ name: '', price: '', type: '' });
  };

  return (
    <div>
      <h1>Gestión de Inventario</h1>
      <button onClick={navigateToDashboard}>Volver</button>

      {/* Formulario para agregar un artículo */}
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
        <select name="type" value={newItem.type} onChange={handleInputChange}>
          <option value="">Escoge el tipo</option>
          <option value="tapa">Tapa</option>
          <option value="bebida">Bebida</option>
        </select>
        <button onClick={handleAddItem}>Agregar Artículo</button>
      </div>

      {/* Formulario para actualizar un artículo */}
      {selectedItem && (
        <div>
          <h2>Actualizar Artículo: {selectedItem.name}</h2>
          <input
            type="text"
            name="name"
            placeholder="Nombre del Artículo"
            value={updateItem.name}
            onChange={handleUpdateInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={updateItem.price}
            onChange={handleUpdateInputChange}
          />
          <select name="type" value={updateItem.type} onChange={handleUpdateInputChange}>
            <option value="">Escoge el tipo</option>
            <option value="tapa">Tapa</option>
            <option value="bebida">Bebida</option>
          </select>
          <button onClick={handleUpdateItem}>Actualizar Artículo</button>
          <button onClick={handleCancelUpdate}>Cancelar</button>
        </div>
      )}

  {/* Sección de Bebidas */}
  <h3>Bebidas</h3>
  <ul>
    {inventory
      .filter(item => item.type === 'bebida') // Filtra solo los ítems de tipo 'bebida'
      .sort((a, b) => a.price - b.price) // Ordena por precio
      .map(item => (
        <li key={item.id}>
          {item.name} - ${item.price}
            <button onClick={() => handleSelectItem(item)}>Editar</button>
            <button onClick={() => handleDeleteItem(item.id)}>Eliminar</button>
        </li>
      ))}
  </ul>

  {/* Sección de Tapas */}
  <h3>Tapas</h3>
  <ul>
    {inventory
      .filter(item => item.type === 'tapa') // Filtra solo los ítems de tipo 'tapa'
      .sort((a, b) => a.price - b.price) // Ordena por precio
      .map(item => (
        <li key={item.id}>
          {item.name} - ${item.price}
            <button onClick={() => handleSelectItem(item)}>Editar</button>
            <button onClick={() => handleDeleteItem(item.id)}>Eliminar</button>
        </li>
      ))}
  </ul>
</div>
  );
};

export default InventoryManagement;
