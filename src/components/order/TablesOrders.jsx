const TablesOrders = ({ tables, onDelete, onEdit, onCharge }) => (
  <div>
    <h2>Pedidos por Mesa</h2>
    {Object.keys(tables).map(table => (
      <div key={table}>
        <h3>Mesa {table}</h3>
        <ul>
          {tables[table].map(order => (
            <li key={order.id}>
              {order.items.map((item, i) => (
                <div key={i}>{item.name} - {item.quantity}</div>
              ))}
              <p>Total: ${order.total}</p>
              <button onClick={() => onDelete(order.id, table)}>Eliminar</button>
              <button onClick={() => onEdit(order, table)}>Editar</button>
            </li>
          ))}
        </ul>
        <button onClick={() => onCharge(table)}>Cobrar</button>
      </div>
    ))}
  </div>
);

export default TablesOrders;
