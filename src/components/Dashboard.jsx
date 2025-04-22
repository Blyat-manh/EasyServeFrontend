import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const history = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    history('/');
  };

  const navigateToEmployeeManagement = () => {
    history('/employee-management');
  };

  const navigateToInventoryManagement = () => {
    history('/inventory-management');
  };

  const navigateToPlaceOrder = () => {
    history('/place-order');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* Mostrar botones solo si el usuario es Encargado */}
      {userRole === 'encargado' && (
        <>
          <button onClick={navigateToEmployeeManagement}>Manage Employees</button>
          <button onClick={navigateToInventoryManagement}>Manage Inventory</button>
        </>
      )}

      <button onClick={navigateToPlaceOrder}>Place Order</button>
    </div>
  );
};

export default Dashboard;
