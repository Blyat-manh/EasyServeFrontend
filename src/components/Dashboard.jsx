import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/dashboard.scss";

const Dashboard = () => {
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

        <button onClick={() => navigate('/profileUpdate')}>Mi Perfil</button>

        {userRole === "encargado" && (
          <>
            <button onClick={() => navigate("/employee-management")}>
              Manage Employees
            </button>
            <button onClick={() => navigate("/inventory-management")}>
              Manage Inventory
            </button>
          </>
        )}
        {(userRole === "encargado" || userRole === "camarero") && (
          <button onClick={() => navigate("/place-order")}>Place Order</button>
        )}
        {userRole === "cocina" && (
          <button onClick={() => navigate("/historial-pedidos")}>
            Ver Historial de Pedidos
          </button>
        )}
        {userRole === "encargado" && (
          <><button onClick={() => navigate("/hacer-caja")}>End day</button><button onClick={() => navigate("/table-management")}>Cambiar mesas</button></>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
