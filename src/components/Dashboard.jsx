import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const history = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
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
      <button onClick={navigateToEmployeeManagement}>Manage Employees</button>
      <button onClick={navigateToInventoryManagement}>Manage Inventory</button>
      <button onClick={navigateToPlaceOrder}>Place Order</button>
    </div>
  );
};

export default Dashboard;