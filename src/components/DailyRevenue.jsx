import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';

const DailyRevenue = () => {
  const [dailyRevenues, setDailyRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDailyRevenues();
  }, []);

  const fetchDailyRevenues = async () => {
    try {
      const res = await axios.get(apiUrl + '/api/dailyRevenue');
      setDailyRevenues(res.data);
    } catch (error) {
      console.error('Error fetching daily revenues:', error);
    }
  };

  const handleEndDay = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(apiUrl + '/api/dailyRevenue/endDay');
      setMessage(`Día finalizado. Total ingresado: $${res.data.total}`);
      fetchDailyRevenues();
    } catch (error) {
      console.error('Error finalizando el día:', error);
      setMessage(error.response?.data?.message || 'Error finalizando el día');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Ingresos Diarios</h1>
      <button onClick={handleEndDay} disabled={loading}>
        {loading ? 'Procesando...' : 'Finalizar Día'}
      </button>
      {message && <p>{message}</p>}

      <h2>Historial de ingresos</h2>
      <ul>
        {dailyRevenues.map(({ id, date, total }) => (
          <li key={id}>
            Fecha: {date} — Total: ${total.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyRevenue;
