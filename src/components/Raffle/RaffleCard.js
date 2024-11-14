import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEdit, FaTrashAlt, FaCrown } from 'react-icons/fa';
import api from '../Auth/AxiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';

function RaffleCard({ id, title, imageUrl, description, startDate, endDate, award, userRole }) {
  const handleEdit = () => {
    let newImageFile = null;

    Swal.fire({
      title: '<h3 style="color: #fff; font-weight: bold;">Editar Rifa</h3>',
      html: `
        <div style="display: flex; flex-direction: column; gap: 15px; color: #fff;">
          <label for="title" style="font-weight: bold;">Título</label>
          <input id="title" class="swal2-input" style="background: #333; color: #fff; border: none;" value="${title}">

          <label for="details" style="font-weight: bold;">Descripción</label>
          <textarea id="details" class="swal2-input" style="background: #333; color: #fff; border: none; resize: none; height: 100px;">${description}</textarea>

          <label for="startDate" style="font-weight: bold;">Fecha de Inicio</label>
          <input id="startDate" type="date" class="swal2-input" style="background: #333; color: #fff; border: none;" value="${new Date(startDate).toISOString().split('T')[0]}">

          <label for="endDate" style="font-weight: bold;">Fecha de Finalización</label>
          <input id="endDate" type="date" class="swal2-input" style="background: #333; color: #fff; border: none;" value="${new Date(endDate).toISOString().split('T')[0]}">

          <label for="award" style="font-weight: bold;">Premio</label>
          <input id="award" class="swal2-input" style="background: #333; color: #fff; border: none;" value="${award}">

          <label for="urlImage" style="font-weight: bold;">Imagen Actual</label>
          <div class="swal2-image-preview" style="text-align: center; margin: 10px 0;">
            <img id="currentImagePreview" src="${imageUrl}" alt="Imagen Actual" style="width: 100%; max-width: 200px; border-radius: 10px;">
          </div>
          <label for="urlImage" style="font-weight: bold;">Nueva Imagen (opcional)</label>
          <input id="urlImage" type="file" class="swal2-file" accept="image/*" style="background: #333; color: #fff; border: none;">
        </div>
      `,
      background: '#2f2f2f',
      confirmButtonText: 'Guardar cambios',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      customClass: {
        popup: 'animated tada',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      didOpen: () => {
        const inputFile = document.getElementById('urlImage');
        inputFile.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
              Swal.showValidationMessage('El archivo debe ser una imagen de menos de 2 MB');
              return;
            }
            newImageFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
              document.getElementById('currentImagePreview').src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      },
      preConfirm: () => {
        const newTitle = document.getElementById('title').value;
        const newDetails = document.getElementById('details').value;
        const newStartDate = document.getElementById('startDate').value;
        const newEndDate = document.getElementById('endDate').value;
        const newAward = document.getElementById('award').value;

        if (new Date(newStartDate) > new Date(newEndDate)) {
          Swal.showValidationMessage('La fecha de inicio no puede ser mayor que la fecha de finalización');
          return false;
        }
        return { newTitle, newDetails, newStartDate, newEndDate, newAward, newImageFile };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { newTitle, newDetails, newStartDate, newEndDate, newAward, newImageFile } = result.value;

        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('details', newDetails);
        formData.append('startDate', newStartDate);
        formData.append('endDate', newEndDate);
        formData.append('award', newAward);
        if (newImageFile) {
          formData.append('urlImage', newImageFile);
        }

        api.put(`/raffle/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(() => {
            Swal.fire('Rifa actualizada', 'Los cambios se guardaron correctamente', 'success').then(() => window.location.reload());
          })
          .catch((error) => {
            Swal.fire('Error', 'Hubo un problema al actualizar la rifa', 'error');
            console.error(error);
          });
      }
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/raffle/${id}`)
          .then(() => {
            Swal.fire('Eliminado', 'La rifa ha sido eliminada', 'success').then(() => window.location.reload());
          })
          .catch((error) => {
            Swal.fire('Error', 'No se pudo eliminar la rifa', 'error');
            console.error(error);
          });
      }
    });
  };

  const handleParticipate = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas participar en la rifa "${title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, participar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        api.post(`/raffle/${id}/participate`)
          .then((response) => {
            Swal.fire({
              title: 'Inscripción exitosa',
              text: 'Te has inscrito en la rifa con éxito.',
              icon: 'success',
              confirmButtonColor: '#28a745'
            });
          })
          .catch((error) => {
            if (error.response && error.response.status === 400 && error.response.data.error === 'Ya estas inscrito en esta rifa') {
              Swal.fire({
                title: 'Ya estás inscrito',
                text: 'Ya participas en esta rifa.',
                icon: 'info',
                confirmButtonColor: '#007bff'
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al inscribirte en la rifa.',
                icon: 'error',
                confirmButtonColor: '#dc3545'
              });
            }
            console.error(error);
          });
      }
    });
  };

  const handleSelectWinner = () => {
    Swal.fire({
      title: 'Seleccionar ganador',
      text: `¿Estás seguro de que deseas seleccionar un ganador para la rifa "${title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, seleccionar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        api.post(`/raffle/${id}/select-winner`)
          .then((response) => {
            const winner = response.data.winner;
            Swal.fire({
              title: 'Ganador seleccionado',
              html: `<p>El ganador es <strong>${winner.name}</strong></p><p>Email: ${winner.email}</p>`,
              icon: 'success',
              confirmButtonColor: '#28a745'
            });
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo seleccionar un ganador.',
              icon: 'error',
              confirmButtonColor: '#dc3545'
            });
            console.error(error);
          });
      }
    });
  };

  return (
    <div className="card shadow-sm bg-dark" data-aos="fade-up" data-aos-duration={1500} style={{ height: '100%', minHeight: '350px' }}>
      <div className="card-img-top overflow-hidden" style={{ height: '250px' }}>
        <Link to="#">
          <img src={imageUrl} alt={title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
        </Link>
      </div>
      <div className="card-body d-flex flex-column text-white">
        <span className="text-muted small text-white">
          {`${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`}
        </span>
        <h5 className="card-title mt-2 text-white">
          <Link to="#" className="text-white text-decoration-none">{title}</Link>
        </h5>
        <p className="card-text text-white">{description}</p>
        <p className="card-text text-white"><strong>Premio:</strong> {award}</p>

        <div className="text-center mt-auto">
          {userRole === 'cliente' && (
            <button className="btn btn-danger w-100" onClick={handleParticipate}>Participar en la Rifa</button>
          )}
          {userRole === 'administrador' && (
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary" onClick={handleEdit}><FaEdit /></button>
              <button className="btn btn-warning" onClick={handleSelectWinner}><FaCrown /></button>
              <button className="btn btn-danger" onClick={handleDelete}><FaTrashAlt /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RaffleCard;
