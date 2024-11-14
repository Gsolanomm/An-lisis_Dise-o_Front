import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Img02 from '../../assets/images/calendar.png';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './Modal.css';

function ReservOne() {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reservations, setReservations] = useState([]);

  const navigate = useNavigate();

  const generateAvailableTimes = () => {
    const times = [];
    for (let i = 8; i < 22; i++) {
      let formattedTime;
      if (i === 12) {
        formattedTime = `12:00 PM`;
      } else if (i < 12) {
        formattedTime = `${i}:00 AM`;
      } else {
        formattedTime = `${i - 12}:00 PM`;
      }
      times.push(formattedTime);
    }
    times.push('10:00 PM');
    setAvailableTimes(times);
  };



  const fetchReservations = async () => {
    try {
      const response = await api.get(`/reservation/list/${userId}`);
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
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





  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);

    if (token) {
      fetchUserRole().then(() => {
        if (userId) {
          fetchReservations();
        }
      });
    }

    const today = new Date();
    setMinDate(today.toISOString().split('T')[0]);
    generateAvailableTimes();
  }, [userId]);


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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalComment = comment.trim() || 'Sin comentarios';
    const reservationData = {
      namePerson: selectedClient ? selectedClient.firstName : namePerson,
      phoneNumber,
      reservationDate,
      numPeople,
      comment: finalComment,
      idClient: selectedClient ? selectedClient.idUser : userId,
      time: time || availableTimes[0],
    };

    const conflictingReservation = reservations.find((reservation) => {

      const formattedReservationDate = new Date(reservation.reservationDate).toISOString().split('T')[0];
      console.log('Fecha de la reserva existente:', formattedReservationDate);
      const formattedReservationTime = reservation.reservationTime;
      console.log('Hora de la reserva existente:', formattedReservationTime);
      const formattedSelectedDate = reservationDate.split('T')[0];
      console.log('Fecha seleccionada:', formattedSelectedDate);
      const formattedSelectedTime = time || availableTimes[0];
      console.log('Hora seleccionada:', formattedSelectedTime);
  
      return formattedReservationDate === formattedSelectedDate && formattedReservationTime === formattedSelectedTime;
    });
  
    if (conflictingReservation) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Ya existe una reserva para esa fecha y hora. Por favor, selecciona otra hora.`,
      });
      return;
    }
  
    try {
      await api.post('/reservation/add', reservationData);
      Swal.fire({
        icon: 'success',
        title: '¡Reservación creada!',
        text: 'La reservación ha sido creada exitosamente.',
      });
  
      fetchReservations(); 
      resetForm(); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear la reservación',
        text: 'Hubo un problema al crear la reserva. Por favor, intenta nuevamente.',
      });
    }
  };
  




  const resetForm = () => {
    setNamePerson('');
    setPhoneNumber('');
    setReservationDate('');
    setNumPeople('');
    setComment('');
    setTime('');
    setSelectedClient(null);
  };

  const handleAdminReservation = () => {
    setIsModalOpen(true);
    fetchClients();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    //setSelectedClient(null);
    setNewClientName('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchClients(currentPage);
  }, [searchTerm, currentPage]);

  const fetchClients = async (page = 1) => {
    try {
      const response = await api.get(`/auth/userpag?page=${page}&limit=10&search=${searchTerm}`);
      const nonAdminClients = response.data.users.filter(client => client.role !== 'administrador');
      setClients(nonAdminClients);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient({
      ...client,
      name: `${client.firstName} ${client.lastName}`
    });
    closeModal();
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section className="bredcrumb_section resarvation_form reservationpage_1_bg">
      <div className="container">
        <div className="section_title text-center">
          <span className="icon">
            <img src={Img02} alt="img" />
          </span>
          <h2>Brothers restaurant</h2>
        </div>
        <div className="form_inner" data-aos="fade-in" data-aos-duration={1500} data-aos-delay={150}>
          <div className="formBlock">
            <div className="text-center">
              <h2 className="mb-2">Reserva tu mesa/espacio ahora</h2>
              <p>
                Solicitud de reserva <a href="tel:+50663908881">+506 6390-8881</a> o
                completa el formulario de pedido
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tu Nombre"
                      value={namePerson}
                      onChange={(e) => setNamePerson(e.target.value)}
                      required={!selectedClient}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Número de Teléfono"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Número de Personas"
                      value={numPeople}
                      onChange={(e) => setNumPeople(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <input
                      type="date"
                      className="form-control"
                      min={minDate}
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <select
                      className="form-control"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    >
                      {availableTimes.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      placeholder="Comentario"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </div>

                {userRole === 'administrador' && (
                  <>
                    <button type="button" onClick={handleAdminReservation} className="btnn btn_admin">
                      Cliente adjudicador de la reservacion
                    </button>
                    <Modal
                      isOpen={isModalOpen}
                      onRequestClose={closeModal}
                      className="modal-content"
                      overlayClassName="modal-overlay"
                    >
                      <h2>Seleccionar Cliente</h2>
                      <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <div className="client-list-container">
                        {clients.length === 0 ? (
                          <p>Sin resultados encontrados</p>
                        ) : (
                          <ul>
                            {clients.map((client) => (
                              <li key={client.id}>
                                <button onClick={() => handleClientSelect(client)}>
                                  {client.firstName} {client.lastName}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="modal-pagination">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>
                          Anterior
                        </button>
                        <span>
                          Página {currentPage} de {totalPages > 0 ? totalPages : 1}
                        </span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                          Siguiente
                        </button>
                      </div>

                      <button className="modal-close-button" onClick={closeModal}>
                        Cerrar
                      </button>
                    </Modal>

                  </>
                )}
              </div>
              <div className="col-md-12">
                <button type="submit" className="btn btn_primary w-100">
                  Reservar
                </button>
              </div>
            </form>
          </div>
          <div className="contact_block">
            <h2>Contáctanos</h2>
            <div className="booking">
              <h3>Solicitud de reserva</h3>
              <Link to="tel:+50663908881">+506 6390-8881</Link>
            </div>
            <ul>
              <li>
                <h3>Ubicación</h3>
                <p>
                  Guacimo <br />
                  Del hosiptal de Guacimo 500 metros en direccion al cementerio.
                </p>
              </li>
              <li>
                <h3>Horario de Almuerzo</h3>
                <p>
                  Lunes a Domingo <br />
                  11:00 am - 2:30 pm
                </p>
              </li>
              <li>
                <h3>Horario de Cena</h3>
                <p>
                  Lunes a Domingo <br />
                  5:30 pm - 11:30 pm
                </p>
              </li>
            </ul>
          </div>
        </div>
        {userRole === 'cliente' && (

          <div className="reservation-table">
            <h3>MIS RESERVACIONES</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Fecha de Reserva</th>
                  <th>Hora de Reserva</th>
                  <th>Número de Personas</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {reservations && reservations.length > 0 ? (
                  reservations.map((reservation) => (
                    <tr key={reservations.idReservation}>
                      <td>{reservation.namePerson}</td>
                      <td>{reservation.phoneNumber}</td>
                      <td>{formatDate(reservation.reservationDate)}</td>
                      <td>{reservation.reservationTime}</td>
                      <td>{reservation.numPeople}</td>
                      <td>{reservation.comment}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay reservas disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}


      </div>
    </section>
  );
}

export default ReservOne;
