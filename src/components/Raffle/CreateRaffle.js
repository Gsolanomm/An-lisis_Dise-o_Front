import React, { useState } from 'react';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';

function CreateRaffle() {
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    startDate: '',
    endDate: '',
    award: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que el archivo es una imagen y su tamaño
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'El archivo debe ser una imagen', 'error');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB máximo
        Swal.fire('Error', 'El tamaño de la imagen debe ser menor a 2 MB', 'error');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.title || !formData.details || !formData.startDate || !formData.endDate || !formData.award) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      Swal.fire('Error', 'La fecha de inicio no puede ser mayor que la fecha de finalización', 'error');
      return;
    }
    if (!image) {
      Swal.fire('Error', 'Debe agregar una imagen', 'error');
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('details', formData.details);
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    form.append('award', formData.award);
    form.append('urlImage', image);

    try {
      const response = await api.post('/raffle/create', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      Swal.fire('Éxito', 'Rifa creada exitosamente', 'success');
      setFormData({
        title: '',
        details: '',
        startDate: '',
        endDate: '',
        award: ''
      });
      setImage(null);
      setPreview(null);
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la rifa', 'error');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="card p-4 w-100" style={{ maxWidth: '900px', backgroundColor: '#2f2f2f', color: '#fff', borderRadius: '10px' }}>
        <h2 className="text-center mb-4">Crear Rifa</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="form-control"
              rows="3"
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha de Inicio</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha de Finalización</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Premios</label>
            <input
              type="text"
              name="award"
              value={formData.award}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Imagen</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" />
            {preview && (
              <div className="mt-3 text-center" style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                <img src={preview} alt="Preview" className="img-fluid rounded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-danger w-100 mt-3">
            Crear Rifa
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRaffle;
