import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';

const ViewCash = () => {
  const [cash, setCash] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    // Fetch cash records from API
    axios.get(apiUrl+'/api/cash')
      .then(response => setCash(response.data))
      .catch(error => console.error('Error fetching cash records:', error));
  }, []);

  return (
    <div>
      <h1>Ver Caja</h1>
      <ul>
        {cash.map(record => (
          <li key={record.id}>
            {record.date} - {record.total}
            <button onClick={() => setSelectedDay(record)}>Más detalles</button>
          </li>
        ))}
      </ul>
      {selectedDay && (
        <div>
          <h2>Detalles del {selectedDay.date}</h2>
          <pre>{JSON.stringify(selectedDay.orders, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ViewCash;