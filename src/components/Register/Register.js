// src/components/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateFormData = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const today = new Date();
    const dateOfBirth = new Date(formData.dateOfBirth);

    if (!formData.firstName.trim() || !nameRegex.test(formData.firstName)) {
      Swal.fire('Error', 'El nombre no debe estar vacío y solo debe contener letras.', 'error');
      return false;
    }
    if (!formData.lastName.trim() || !nameRegex.test(formData.lastName)) {
      Swal.fire('Error', 'El apellido no debe estar vacío y solo debe contener letras.', 'error');
      return false;
    }
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      Swal.fire('Error', 'Por favor ingrese un correo electrónico válido.', 'error');
      return false;
    }
    if (!formData.dateOfBirth || dateOfBirth >= today) {
      Swal.fire('Error', 'La fecha de nacimiento debe ser anterior a la fecha actual.', 'error');
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(formData.password)) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres no alfanuméricos.', 'error');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData()) return;

    try {
      await api.post('/auth/register', formData);
      Swal.fire('Éxito', 'Usuario registrado con éxito', 'success');
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      navigate('/login');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Error al registrar el usuario', 'error');
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
              max={new Date().toISOString().split("T")[0]} // Set max date to today
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
