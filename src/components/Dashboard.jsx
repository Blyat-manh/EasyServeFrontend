import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

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
          <button onClick={() => navigate("/historial-pedidos")}>
            End day
          </button>
      )}
    </div>
  );
};

export default Dashboard;
