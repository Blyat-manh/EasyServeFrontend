import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/dashboard.scss";
import ThemeSwitch from "./ThemeSwitch";

const Dashboard = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);


  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1>Dashboard</h1>
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
        <button className="dashboard-btn" onClick={() => navigate('/profileUpdate')}>Mi Perfil</button>

        {userRole === "encargado" && (
          <>
            <button className="dashboard-btn" onClick={() => navigate("/employee-management")}>
              Manage Employees
            </button>
            <button className="dashboard-btn" onClick={() => navigate("/inventory-management")}>
              Manage Inventory
            </button>
          </>
        )}
        {(userRole === "encargado" || userRole === "camarero") && (
          <button className="dashboard-btn" onClick={() => navigate("/place-order")}>Place Order</button>
        )}
        {userRole === "cocina" && (
          <button className="dashboard-btn" onClick={() => navigate("/historial-pedidos")}>
            Ver Historial de Pedidos
          </button>
        )}
        {userRole === "encargado" && (
          <>
          <button className="dashboard-btn" onClick={() => navigate("/hacer-caja")}>End day</button>
          <button className="dashboard-btn" onClick={() => navigate("/table-management")}>Cambiar mesas</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
