// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Auth/AxiosConfig';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', formData, {
        withCredentials: true, // Habilita el envío de cookies
      });

      const { accessToken } = response.data;

      // Almacenar el accessToken en localStorage
      localStorage.setItem('accessToken', accessToken);

      // Redirigir al usuario a la página principal o al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Credenciales incorrectas');
    }
  };

  // URLs de autenticación de terceros (asegúrate de configurar estas rutas en el backend)
  //const googleAuthUrl = 'http://localhost:5000/auth/google';
  //const facebookAuthUrl = 'http://localhost:5000/auth/facebook';

  return (
    <section className="custom-login-section">
      <div className="custom-login-container">
        <div className="custom-login-header">
          <h2>LOGIN</h2>
        </div>
        <form onSubmit={handleSubmit} className="custom-login-form">
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
          {error && <p className="error-message">{error}</p>}
          <p className="custom-forgot-password">
            <Link to="/forgot-password">¿Olvidaste la contraseña?</Link>
          </p>
          <button type="submit" className="custom-login-button">INGRESAR</button>
        </form>
        
        <div className="custom-social-login-buttons">
          <a className="custom-social-button custom-google-button">
            <i className="fa fa-envelope"></i> Iniciar con Gmail
          </a>
          <a  className="custom-social-button custom-facebook-button">
            <i className="fa fa-facebook"></i> Iniciar con Facebook
          </a>
        </div>

        <p className="custom-register-link">
          No tengo una cuenta? <Link to="/register">Crear una</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
