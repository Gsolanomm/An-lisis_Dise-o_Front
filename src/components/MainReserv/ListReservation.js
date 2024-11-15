import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Img02 from '../../assets/images/calendar.png';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';
import './ListReservation.css';

function ReservOne() {
  const [reservations, setReservations] = useState([]);
  const [minDate, setMinDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [namePerson, setNamePerson] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [comment, setComment] = useState('');
  const [time, setTime] = useState('');
  const [editingReservation, setEditingReservation] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReservations, setTotalReservations] = useState(0);
  const navigate = useNavigate();

  const fetchReservations = async (page = 1) => {
    try {
      const response = await api.get('/reservations/list', {
        params: { page, limit: 10 },
      });
      setReservations(response.data.reservations);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setTotalReservations(response.data.totalReservations);
    } catch (error) {
      console.error('Error al obtener las reservaciones:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar las reservaciones',
        text: 'Hubo un problema al cargar la lista de reservaciones. Por favor, intenta nuevamente.',
      });
    }
  };

  const handleEditClick = (reservation) => {
    setEditingReservation(reservation);
    setNamePerson(reservation.namePerson);
    setPhoneNumber(reservation.phoneNumber);
    
    const formattedDate = reservation.reservationDate ? new Date(reservation.reservationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    setReservationDate(formattedDate);
    setNumPeople(reservation.numPeople);
    setComment(reservation.comment);
    setTime(reservation.reservationTime);
    window.scrollTo(0, 1100);
  };
  
  
  

  const handleSave = async () => {
    try {
      await api.put(`/reservations/update/${editingReservation.idReservation}`, {
        namePerson,
        phoneNumber,
        reservationDate,
        numPeople,
        comment,
        time,
      });
      Swal.fire('¡Actualizado!', 'La reservación ha sido actualizada.', 'success');
      setEditingReservation(null);
      fetchReservations(currentPage); 
      window.scrollTo(0, document.querySelector('table').offsetTop); 
    } catch (error) {
      console.error('Error al actualizar la reservación:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la reservación. Intenta nuevamente.',
      });
    }
  };
  

  const handleDelete = async (idReservation) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la reservación de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/reservations/delete/${idReservation}`);
        setReservations(reservations.filter((reservation) => reservation.idReservation !== idReservation));
        Swal.fire('¡Eliminado!', 'La reservación ha sido eliminada.', 'success');
      } catch (error) {
        console.error('Error al eliminar la reservación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la reservación. Intenta nuevamente.',
        });
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);

    if (token) fetchUserRole();

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    setMinDate(`${year}-${month}-${day}`);
    generateAvailableTimes();

    fetchReservations(currentPage);
  }, [currentPage]);

  const generateAvailableTimes = () => {
    const times = [];
    for (let i = 8; i < 22; i++) {
      const amHour = i < 12 ? `${i}:00 AM` : `${i - 12}:00 PM`;
      times.push(amHour);
    }
    times.push('10:00 PM');
    setAvailableTimes(times);
  };

  const fetchUserRole = async () => {
    try {
      const response = await api.get('/auth/verify-user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const { role, idUser } = response.data;
      setUserRole(role);
      setUserId(idUser);
    } catch (error) {
      console.error(error);
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const newDate = new Date(year, month, day + 1);

    if (newDate.getDate() === 1) {
      return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    } else {
      return `${newDate.getDate()}/${month + 1}/${year}`;
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  // Definición de estilos en línea
  const tableStyles = {
    backgroundColor: 'black',
    color: 'white',
    borderCollapse: 'collapse',
    width: '100%',
  };

  const thTdStyles = {
    backgroundColor: 'black',
    color: 'white',
    border: '1px solid white',
    padding: '8px',
    textAlign: 'center',
  };

  const hoverRowStyles = {
    backgroundColor: 'black',
  };

  const reservationListStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return isAuthenticated && (userRole === 'administrador') ? (
    <section className="bredcrumb_section resarvation_form reservationpage_1_bg">
      <div className="container">
        <div className="section_title text-center">
          <span className="icon">
            <img src={Img02} alt="img" />
          </span>
          <span className="sub_text">Lista de reservaciones</span>
        </div>
        <div className="form_inner" style={reservationListStyles}>
          <table className="table" style={tableStyles}>
            <thead>
              <tr>
                <th style={thTdStyles}>Nombre</th>
                <th style={thTdStyles}>Teléfono</th>
                <th style={thTdStyles}>Fecha</th>
                <th style={thTdStyles}>Hora</th>
                <th style={thTdStyles}>Número de personas</th>
                <th style={thTdStyles}>Comentario</th>
                <th style={thTdStyles}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr style={hoverRowStyles}>
                  <td colSpan="7" className="text-center" style={thTdStyles}>
                    <p>No hay reservaciones disponibles.</p>
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.idReservation} style={hoverRowStyles}>
                    <td style={thTdStyles}>{reservation.namePerson}</td>
                    <td style={thTdStyles}>{reservation.phoneNumber}</td>
                    <td style={thTdStyles}>{formatDate(reservation.reservationDate)}</td>
                    <td style={thTdStyles}>{reservation.reservationTime}</td>
                    <td style={thTdStyles}>{reservation.numPeople}</td>
                    <td style={thTdStyles}>{reservation.comment}</td>
                    <td style={thTdStyles}>
                      <button className="btn btn-primary" onClick={() => handleEditClick(reservation)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(reservation.idReservation)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Paginación */}
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Siguiente
              </button>
            </div>
          </table>


        </div>
        {editingReservation && (
          <div className="edit-form">
            <h3>Editar Reservación</h3>
            <form>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={namePerson} onChange={(e) => setNamePerson(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" value={reservationDate} min={minDate} onChange={(e) => setReservationDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Hora</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  {availableTimes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Número de personas</label>
                <input type="number" value={numPeople} onChange={(e) => setNumPeople(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Comentario</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
              </div>
              <button type="button" className="btn btn-success" onClick={handleSave}>Guardar</button>
            </form>
          </div>
        )}
      </div>
    </section>
  ) : (
    <div>No tienes permisos para ver esta página.</div>
  );
}

export default ReservOne;