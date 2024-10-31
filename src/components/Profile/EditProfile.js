// src/components/EditProfile.js
import React, { useState, useEffect } from 'react';
import api from '../Auth/AxiosConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UpdateProfileImage from './UpdateProfileImage';

function EditProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        const formattedDateOfBirth = new Date(response.data.dateOfBirth).toISOString().split('T')[0];
        setFormData({ ...response.data, dateOfBirth: formattedDateOfBirth });
        setLoading(false);
      } catch (err) {
        Swal.fire('Error', 'Error al cargar los datos del usuario.', 'error');
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
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
    return true;
  };

  const validatePasswordData = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(passwordData.newPassword)) {
      Swal.fire('Error', 'La nueva contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres no alfanuméricos.', 'error');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData()) return;
    const result = await Swal.fire({
      title: '¿Desea guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await api.put('/auth/user', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        Swal.fire('Éxito', 'Datos actualizados correctamente.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Error al actualizar los datos del usuario.', 'error');
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordData()) return;
    const result = await Swal.fire({
      title: '¿Desea actualizar su contraseña?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await api.put('/auth/update-password', passwordData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        Swal.fire('Éxito', 'Contraseña actualizada correctamente.', 'success');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) {
        Swal.fire('Error', 'Error al actualizar la contraseña.', 'error');
      }
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
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="firstName">Nombre</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-control text-light bg-dark"
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
              className="form-control text-light bg-dark"
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
              max={new Date().toISOString().split('T')[0]}
              className="form-control text-light bg-dark"
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
              className="form-control text-light bg-dark"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Guardar Cambios</button>
        </form>

        <hr className="my-4" />

        <div className="edit-profile-header">
          <h2>Cambiar Contraseña</h2>
        </div>
        <form onSubmit={handlePasswordSubmit} className="edit-password-form mt-3">
          <div className="form-group">
            <label htmlFor="oldPassword">Contraseña Actual</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="form-control text-light bg-dark"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="form-control text-light bg-dark"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="form-control text-light bg-dark"
              required
            />
          </div>
          <button type="submit" className="btn btn-warning mt-3">Actualizar Contraseña</button>
        </form>
        <UpdateProfileImage />
      </div>
    </section>
  );
}

export default EditProfile;
