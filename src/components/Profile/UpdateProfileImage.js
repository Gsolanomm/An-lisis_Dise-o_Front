// src/components/UpdateProfileImage.js
import React, { useState, useEffect } from 'react';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';

function UpdateProfileImage() {
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Obtener el ID del usuario autenticado
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await api.get('/auth/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setUserId(response.data.idUser);
      } catch (error) {
        Swal.fire('Error', 'Error al obtener el ID del usuario.', 'error');
      }
    };

    fetchUserId();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      Swal.fire('Error', 'Por favor selecciona solo archivos de imagen.', 'error');
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !userId) {
      Swal.fire('Error', 'Por favor selecciona una imagen para subir.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: '¿Desea actualizar su imagen de perfil?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append('imagen', image);
      formData.append('id', userId); // Usa el ID del estado

      try {
        await api.post('/auth/actualizarImagen', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire('Éxito', 'Imagen de perfil actualizada correctamente.', 'success');
        setImage(null);
        setPreview(null); // Resetea la vista previa después de la subida exitosa
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al actualizar la imagen de perfil.', 'error');
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg border-0 bg-dark text-white">
        <h4 className="mb-3 text-center">Actualizar Imagen</h4>
        <form onSubmit={handleSubmit} className="text-center">
          <div className="form-group mb-3">
            <label htmlFor="profileImage" className="form-label">
              Selecciona una imagen de perfil:
            </label>
            <input
              type="file"
              id="profileImage"
              onChange={handleImageChange}
              className="form-control-file"
              accept="image/*"
              required
            />
          </div>

          {preview && (
            <div className="mt-3">
              <p>Vista previa:</p>
              <img
                src={preview}
                alt="Vista previa de la imagen"
                className="rounded-circle shadow"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary mt-4">
            Actualizar Imagen
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfileImage;
