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
  const [dailyRevenues, setDailyRevenues] = useState([]);
  const [filteredRevenues, setFilteredRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: 'selection' }
  ]);
  const [todayTotal, setTodayTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchDailyRevenues();
    fetchTodayTotal();
  }, []);

  useEffect(() => {
    setFilteredRevenues(dailyRevenues);
  }, [dailyRevenues]);

  useEffect(() => {
    if (showCalendar) filterRevenues();
    // eslint-disable-next-line
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
      const res = await axios.get(apiUrl + '/api/dailyRevenue/currentPaidOrdersTotal');
      setTodayTotal(Number(res.data.total) || 0);
    } catch (error) {
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
      setMessage(error.response?.data?.message || 'Error finalizando el día');
    }
    setLoading(false);
  };

  const filterRevenues = () => {
    const start = format(range[0].startDate, 'yyyy-MM-dd');
    const end = format(range[0].endDate, 'yyyy-MM-dd');
    const filtered = dailyRevenues.filter(r => r.date >= start && r.date <= end);
    setFilteredRevenues(filtered);
  };

  return (
    <div className="daily-revenue-bg">
      <div className="daily-revenue-card">
        <header className="dr-header">
          <h1>Ingresos Diarios</h1>
          <div className="dr-header-actions">
            <button className="home-btn" onClick={() => navigate('/dashboard')}>
              <FiHome />
            </button>
            <ThemeSwitch theme={theme} setTheme={setTheme} />
          </div>
        </header>
        <button className="end-day-btn" onClick={handleEndDay} disabled={loading}>
          {loading ? 'Procesando...' : 'Finalizar Día'}
        </button>
        <div className="today-total">
          Total ganado hasta ahora: <span>${Number(todayTotal).toFixed(2)}</span>
        </div>
        {message && <p className="dr-message">{message}</p>}

        <h2 className="dr-section-title">Filtrar por rango de fechas</h2>
        <div className="calendar-wrapper">
          <button
            className="calendar-toggle"
            onClick={() => {
              if (showCalendar) {
                const today = new Date();
                setRange([{ startDate: today, endDate: today, key: 'selection' }]);
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

        <h2 className="dr-section-title">Historial de ingresos</h2>
        <div className="revenue-list-container">
          {filteredRevenues.length === 0 ? (
            <p className="empty-revenue-msg">No hay ingresos en el rango seleccionado.</p>
          ) : (
            <ul>
              {filteredRevenues.map(({ id, date, total }) => (
                <li key={id} className="revenue-list-item">
                  <div className="revenue-list-date">
                    <span className="revenue-label">Fecha</span>
                    <span className="revenue-value">
                      {format(new Date(date), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="revenue-list-total">
                    <span className="revenue-label">Total</span>
                    <span className="revenue-value">
                      ${isNaN(total) ? 'N/A' : Number(total).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyRevenue;
