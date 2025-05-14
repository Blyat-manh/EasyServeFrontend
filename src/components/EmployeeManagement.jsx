import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../App';
import { useNavigate } from 'react-router-dom';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', password: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updateEmployee, setUpdateEmployee] = useState({ name: '', role: '', password: '' });

  //funcion para volver al menu
  const history = useNavigate();
  const navigateToDashboard = () => {
    history('/dashboard');
  };

  useEffect(() => {
    // Obtener empleados desde la API
    axios.get(`${apiUrl}/api/employees`)
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = () => {
    axios.post(`${apiUrl}/api/employees`, newEmployee)
      .then(response => {
        setEmployees(prevEmployees => [...prevEmployees, response.data]);
        setNewEmployee({ name: '', role: '', password: '' }); // Limpiar campos
      })
      .catch(error => console.error('Error adding employee:', error));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateEmployee = () => {
    axios.put(`${apiUrl}/api/employees/${updateEmployee.name}`, updateEmployee)
      .then(response => {
        setEmployees(prevEmployees => prevEmployees.map(employee =>
          employee.name === updateEmployee.name ? response.data : employee
        ));
        setUpdateEmployee({ name: '', role: '', password: '' });
        setSelectedEmployee(null); // Limpiar el empleado seleccionado
      })
      .catch(error => console.error('Error updating employee:', error));
  };

  const handleDeleteEmployee = (name) => {
    axios.delete(`${apiUrl}/api/employees/${name}`)
      .then(() => {
        setEmployees(prevEmployees => prevEmployees.filter(employee => employee.name !== name));
      })
      .catch(error => console.error('Error deleting employee:', error));
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setUpdateEmployee({ name: employee.name, role: employee.role, password: '' });
  };

  return (
    <div>
      <h1>Gestión de Empleados</h1>
      <button onClick={navigateToDashboard}>Volver</button>
      {/* Formulario para agregar*/}
      <div>
        <h2>Agregar Empleado</h2>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newEmployee.name}
          onChange={handleInputChange}
        />
        <select name="role" onChange={handleInputChange}>
          <option value="" >Escoge un rol</option>
          <option value="encargado">Encargado</option>
          <option value="camarero">Camarero</option>
          <option value="cocina">Cocina</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={newEmployee.password}
          onChange={handleInputChange}
        />
        <button onClick={handleAddEmployee}>Agregar Empleado</button>
      </div>

      {/* Formulario para actualizar*/}
      {selectedEmployee && (
        <div>
          <h2>Actualizar Empleado: {selectedEmployee.name}</h2>
          <select name="role" onChange={handleInputChange}>
          <option value="" >Escoge un rol</option>
          <option value="encargado">Encargado</option>
          <option value="camarero">Camarero</option>
          <option value="cocina">Cocina</option>
        </select>
          <input
            type="password"
            name="password"
            placeholder="Nueva Contraseña"
            value={updateEmployee.password}
            onChange={handleUpdateInputChange}
          />
          <button onClick={handleUpdateEmployee}>Actualizar Empleado</button>
        </div>
      )}

      {/* Lista empleados/usuarios */}
      <ul>
        {employees.map(employee => (
          <li key={employee.name}>
            {employee.name} - {employee.role}
            <button onClick={() => handleSelectEmployee(employee)}>Editar</button>
            <button onClick={() => handleDeleteEmployee(employee.name)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeManagement;
