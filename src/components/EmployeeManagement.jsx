import React, { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { apiUrl } from '../App';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '' });

  useEffect(() => {
    // Fetch employees from API
    axios.get(apiUrl,'/api/employees')
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = () => {
    axios.post(apiUrl,'/api/employees', newEmployee)
      .then(response => setEmployees([...employees, response.data]))
      .catch(error => console.error('Error adding employee:', error));
  };

  return (
    <div>
      <h1>Gestión de Empleados</h1>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newEmployee.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="role"
          placeholder="Rol"
          value={newEmployee.role}
          onChange={handleInputChange}
        />
        <button onClick={handleAddEmployee}>Agregar Empleado</button>
      </div>
      <ul>
        {employees.map(employee => (
          <li key={employee.id}>{employee.name} - {employee.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeManagement;