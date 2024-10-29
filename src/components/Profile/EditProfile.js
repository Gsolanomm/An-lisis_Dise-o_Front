// src/components/EditProfile.js
import React, { useState, useEffect } from 'react';
import api from '../Auth/AxiosConfig';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
         // Formatea la fecha de nacimiento a 'YYYY-MM-DD' antes de establecer el estado
         const formattedDateOfBirth = new Date(response.data.dateOfBirth).toISOString().split('T')[0];
        
         setFormData({ ...response.data, dateOfBirth: formattedDateOfBirth });
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del usuario.');
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/user', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setSuccessMessage('Datos actualizados correctamente.');
      //limpia el mensaje de éxito después de 3 segundos
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
    } catch (err) {
      setError('Error al actualizar los datos del usuario.');
    }
  };

  if (loading) return <p>Cargando datos...</p>;

  return (
    <section className="edit-profile-section">
      <div className="container">
        <div className="edit-profile-header">
          <h2>Editar Perfil</h2>
          <p>Actualiza tu información personal</p>
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </form>
      </div>
    </section>
  );
}

export default EditProfile;
