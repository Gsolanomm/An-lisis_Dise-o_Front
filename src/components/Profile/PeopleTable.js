import React, { useEffect, useState } from 'react';
import Header from '../Header/Main';
import Footer from '../Footer/Main';
import Aos from 'aos';
import Swal from 'sweetalert2';
import api from '../Auth/AxiosConfig';
import '../../assets/css/editProfile.css';

function PeopleTable() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5); // Cantidad de usuarios por página
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    Aos.init();
    fetchUsers(currentPage);
    fetchCurrentUser();
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      const response = await api.get(`/admin/users`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      Swal.fire('Error', 'Error al obtener los usuarios.', 'error');
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setCurrentUserId(response.data.idUser);
    } catch (error) {
      console.error('Error al obtener el usuario autenticado:', error);
    }
  };

  const handleDisableUser = (id) => {
    if (id === currentUserId) {
      Swal.fire('Advertencia', 'No puedes eliminar tu propio usuario.', 'warning');
      return;
    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción inhabilitará al usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, inhabilitar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/admin/disable-user/${id}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          });
          fetchUsers(currentPage);
          Swal.fire('Inhabilitado', 'Usuario inhabilitado correctamente.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Error al inhabilitar usuario.', 'error');
        }
      }
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="page_wrapper">
      <Header />
      <div className="container my-5" style={{ padding: '4%' }}>
        <h2 className="text-center mb-4">Lista de Usuarios</h2>
        {users.length === 0 ? (
          <p className="text-center">No hay usuarios disponibles</p>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '90%', overflowX: 'auto' }}>
            <table className="table table-hover table-striped text-white">
              <thead className="table-danger text-center">
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo Electrónico</th>
                  <th>Fecha de Nacimiento</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="table-dark">
                {users.map((user, index) => (
                  <tr key={user.idUser} className="text-center align-middle">
                    <td>{index + 1 + (currentPage - 1) * limit}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => Swal.fire('Acción', 'Aquí puedes actualizar el usuario', 'info')}
                      >
                        Actualizar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDisableUser(user.idUser)}
                        disabled={!user.isActive}
                      >
                        Inhabilitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PeopleTable;
