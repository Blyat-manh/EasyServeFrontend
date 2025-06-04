import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import '../styles/dailyRevenue.scss';
import { FiHome } from 'react-icons/fi';
import ThemeSwitch from './ThemeSwitch';

const DailyRevenue = () => {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [dailyRevenues, setDailyRevenues] = useState([]);
  const [filteredRevenues, setFilteredRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDailyRevenues();
  }, []);

  useEffect(() => {
    setFilteredRevenues(dailyRevenues);
  }, [dailyRevenues]);

  useEffect(() => {
    if (showCalendar) {
      filterRevenues();
    }
  }, [range]);

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
      const res = await axios.post(apiUrl + '/api/dailyRevenue/end-day');
      setMessage(`Día finalizado. Total ingresado: $${res.data.total}`);
      fetchDailyRevenues();
    } catch (error) {
      console.error('Error finalizando el día:', error);
      setMessage(error.response?.data?.message || 'Error finalizando el día');
    }
    setLoading(false);
  };

  const filterRevenues = () => {
    const start = format(range[0].startDate, 'yyyy-MM-dd');
    const end = format(range[0].endDate, 'yyyy-MM-dd');
    const filtered = dailyRevenues.filter((r) => r.date >= start && r.date <= end);
    setFilteredRevenues(filtered);
  };

  // Nuevo: total cobrado hoy
  const totalHoy =
    Number(
      dailyRevenues.find(r => r.date === format(new Date(), 'yyyy-MM-dd'))?.total || 0
    ).toFixed(2);

  return (
    <div className="daily-revenue-container">
      <header className="header">
        <h1>Ingresos Diarios</h1>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <ThemeSwitch theme={theme} setTheme={setTheme} />
          <button className="home-btn" onClick={() => navigate('/dashboard')}>
            <FiHome />
          </button>
        </div>
      </header>

      <div style={{ margin: "1rem 0" }}>
        <strong>Total cobrado hoy: ${totalHoy}</strong>
        {/* Botón temporal para probar */}
        <button style={{marginLeft:8}} onClick={fetchDailyRevenues}>Actualizar ingresos</button>
      </div>

      <button onClick={handleEndDay} disabled={loading}>
        {loading ? 'Procesando...' : 'Finalizar Día'}
      </button>
      {message && <p>{message}</p>}

      <h2>Filtrar por rango de fechas</h2>
      <div className="calendar-wrapper" style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => {
            if (showCalendar) {
              const today = new Date();
              const resetRange = [{
                startDate: today,
                endDate: today,
                key: 'selection'
              }];
              setRange(resetRange);
              setFilteredRevenues(dailyRevenues);
              setShowCalendar(false);
            } else {
              setShowCalendar(true);
            }
          }}
        >
          {showCalendar ? 'Cerrar Calendario' : 'Seleccionar Rango de Fechas'}
        </button>
        {showCalendar && (
          <div className="calendar-container">
            <DateRange
              editableDateInputs={true}
              onChange={item => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={range}
            />
          </div>
        )}
      </div>

      <h2>Historial de ingresos</h2>
      <div className="revenue-list-container">
        {filteredRevenues.length === 0 ? (
          <p>No hay ingresos en el rango seleccionado.</p>
        ) : (
          <ul>
            {filteredRevenues.map(({ id, date, total }) => (
              <li key={id}>
                Fecha: {date} — Total: ${isNaN(total) ? 'N/A' : Number(total).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DailyRevenue;
