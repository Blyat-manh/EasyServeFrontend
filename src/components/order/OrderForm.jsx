import '../../styles/orderForm.scss';


const OrderForm = ({ inventory, onAddToOrder, selectedTable, setSelectedTable }) => {
  return (
    <div>
      <label>Mesa:</label>
      <input
        type="number"
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
      />

      <h3>Bebidas</h3>
      <ul>
        {inventory.filter(i => i.type === "bebida").sort((a, b) => a.price - b.price).map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => onAddToOrder(item)}>Agregar</button>
          </li>
        ))}
      </ul>

      <h3>Tapas</h3>
      <ul>
        {inventory.filter(i => i.type === "tapa").sort((a, b) => a.price - b.price).map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => onAddToOrder(item)}>Agregar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderForm;
