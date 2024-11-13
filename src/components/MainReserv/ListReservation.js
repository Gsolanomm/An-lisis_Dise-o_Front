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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReservations, setTotalReservations] = useState(0);
  const navigate = useNavigate();

  const fetchReservations = async (page = 1) => {
    try {
      const response = await api.get('/reservation/list', {
        params: { page, limit: 10 }, // Paginación con parámetros
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
        await api.delete(`/reservation/delete/${idReservation}`);
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

    fetchReservations(currentPage); // Llamada inicial con la página actual
  }, [currentPage]); // La paginación depende del estado `currentPage`

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

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString(); // Formateo de fecha para que sea más legible
  };

  // Dentro de la función ReservOne:
  return isAuthenticated && (userRole === 'administrador') ? (
    <section className="bredcrumb_section resarvation_form reservationpage_1_bg">
      <div className="side_shape position-absolute" />
      <div className="container">
        <div className="section_title text-center" data-aos="fade-up" data-aos-duration={1500}>
          <span className="icon">
            <img src={Img02} alt="img" />
          </span>
          <span className="sub_text">Lista de reservaciones</span>
        </div>
        <div className="form_inner" data-aos="fade-in" data-aos-duration={1500} data-aos-delay={150}>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Número de personas</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <p>No hay reservaciones disponibles.</p>
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.idReservation}>
                    <td>{reservation.namePerson}</td>
                    <td>{reservation.phoneNumber}</td>
                    <td>{formatDate(reservation.reservationDate)}</td>
                    <td>{reservation.reservationTime}</td>
                    <td>{reservation.numPeople}</td>
                    <td>{reservation.comment}</td>
                    <td>
                      <button className="btn btn-primary">Editar</button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(reservation.idReservation)} >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <div className="pagination text-center">
              <button
                disabled={currentPage === 1 || totalReservations === 0}
                onClick={() => setCurrentPage(currentPage - 1)}>
                Anterior
              </button>
              <span>Página {currentPage} de {totalReservations === 0 ? 1 : totalPages}</span>
              <button
                disabled={currentPage === totalPages || totalReservations === 0}
                onClick={() => setCurrentPage(currentPage + 1)}>
                Siguiente
              </button>
            </div>
          </table>

        </div>
      </div>
    </section>
  ) : (
    <div>Acceso denegado. Debes ser cliente o administrador para ver las reservaciones.</div>
  );
}

export default ReservOne;
