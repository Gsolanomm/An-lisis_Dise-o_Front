// src/components/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Auth/AxiosConfig';


function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Enviar datos al backend
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        password: formData.password,
      });

      // Si el registro es exitoso
      setSuccess('Usuario registrado con éxito');
      setError('');
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Redirigir al usuario a la página de login
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrar el usuario');
    }
  };

  return (
    <section className="custom-register-section">
      <div className="custom-register-container">
        <div className="custom-register-header">
          <h2>REGISTRARSE</h2>
        </div>
        <form onSubmit={handleSubmit} className="custom-register-form">
          <div className="custom-form-group">
            <label htmlFor="firstName">Nombre</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="lastName">Apellido</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="dateOfBirth">Fecha de Nacimiento</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="custom-register-button">REGISTRARSE</button>
        </form>
        <p className="custom-login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Loguéate</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
