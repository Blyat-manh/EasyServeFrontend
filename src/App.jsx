import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import InventoryManagement from './components/InventoryManagement';
import PlaceOrder from './components/order/PlaceOrder';
import Menu from './components/Menu';
import OrderHistoryViewer from "./components/order/OrderHistoryViewer";
import DailyRevenue from './components/DailyRevenue';
import TablesManager from './components/tablesManager';
import PasswordManagement from './components/RecoverPassword';
import ProfileUpdate from './components/ProfileUpdate';
import NotFound from './components/NotFound';

export const apiUrl = "https://easyservebackend-production.up.railway.app";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login theme={theme} setTheme={setTheme} />} />
        <Route path="/dashboard" element={<Dashboard theme={theme} setTheme={setTheme} />} />
        <Route path="/employee-management" element={<EmployeeManagement theme={theme} setTheme={setTheme} />} />
        <Route path="/inventory-management" element={<InventoryManagement theme={theme} setTheme={setTheme} />} />
        <Route path="/place-order" element={<PlaceOrder theme={theme} setTheme={setTheme} />} />
        <Route path="/menu" element={<Menu theme={theme} setTheme={setTheme} />} />
        <Route path="/historial-pedidos" element={<OrderHistoryViewer theme={theme} setTheme={setTheme} />} />
        <Route path="/Hacer-caja" element={<DailyRevenue theme={theme} setTheme={setTheme} />} />
        <Route path="/table-management" element={<TablesManager theme={theme} setTheme={setTheme} />} />
        <Route path="/recover-password" element={<PasswordManagement theme={theme} setTheme={setTheme} />} />
        <Route path="/profileUpdate" element={<ProfileUpdate theme={theme} setTheme={setTheme} />} />
        <Route path="*" element={<NotFound theme={theme} setTheme={setTheme} />} />
      </Routes>
    </Router>
  );
}

export default App;
