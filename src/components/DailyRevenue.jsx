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
  // Estado tema: "light" o "dark"
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
  const [todayTotal, setTodayTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDailyRevenues();
  }, []);

  useEffect(() => {
    setFilteredRevenues(dailyRevenues);
    fetchTodayTotal();
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

  const fetchTodayTotal = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      // 1. Total ya cobrado (en daily_revenue)
      const resRevenue = await axios.get(apiUrl + '/api/dailyRevenue');
      const todayRevenue = resRevenue.data.find(r => r.date === today);
      const revenueTotal = todayRevenue ? Number(todayRevenue.total) : 0;

      // 2. Total pendiente (en orders)
      const resOrders = await axios.get(apiUrl + '/api/orders');
      const pendingOrders = resOrders.data.filter(
        o => o.created_at && o.created_at.slice(0, 10) === today
      );
      const pendingTotal = pendingOrders.reduce((acc, o) => acc + Number(o.total), 0);

      setTodayTotal(revenueTotal + pendingTotal);
    } catch (err) {
      setTodayTotal(0);
    }
  };

  const handleEndDay = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(apiUrl + '/api/dailyRevenue/end-day');
      setMessage(`Día finalizado. Total ingresado: $${res.data.total}`);
      fetchDailyRevenues();
      fetchTodayTotal();
    } catch (error) {
      console.error('Error finalizando el día:', error);
      if (error.response?.status === 400) {
        setMessage("No hay pedidos pendientes para finalizar hoy. Probablemente ya cobraste todo.");
      } else {
        setMessage(error.response?.data?.message || 'Error finalizando el día');
      }
    }
    setLoading(false);
  };

  const filterRevenues = () => {
    const start = format(range[0].startDate, 'yyyy-MM-dd');
    const end = format(range[0].endDate, 'yyyy-MM-dd');

    const filtered = dailyRevenues.filter((r) => {
      return r.date >= start && r.date <= end;
    });

    setFilteredRevenues(filtered);
  };

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
        <strong>Total ganado hoy: ${Number(todayTotal).toFixed(2)}</strong>
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
              // Cerrar calendario y resetear filtro
              const today = new Date();
              const resetRange = [{
                startDate: today,
                endDate: today,
                key: 'selection'
              }];
              setRange(resetRange);
              setFilteredRevenues(dailyRevenues); // Mostrar todos
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
