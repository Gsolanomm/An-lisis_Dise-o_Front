import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../Auth/AxiosConfig';

function Notification() {
  const [tables, setTables] = useState([]);
  const [userId, setUserId] = useState(null); // ID del usuario actual
  const [role, setRole] = useState('cliente'); // Rol del usuario (cliente o administrador)
  const [notifiedTables, setNotifiedTables] = useState([]); // Mesas notificadas para el usuario

  // Cargar las mesas desde el API
  const loadTables = async () => {
    try {
      const response = await api.get('/tables/');
      setTables(response.data);
    } catch (error) {
      console.error("Error al cargar las mesas:", error);
    }
  };

  // Obtener las mesas notificadas asociadas al usuario
  const loadNotifiedTables = async () => {
    try {
      const response = await api.get(`/notifications/byClient/${userId}`);
      
      // Verificar si el backend devuelve un solo objeto o un arreglo de objetos
      const notifiedTablesData = response.data;
      
      // Si el backend devuelve un objeto con una propiedad 'tableId', asegúrate de manejarlo correctamente
      if (Array.isArray(notifiedTablesData)) {
        setNotifiedTables(notifiedTablesData.map(item => item.tableId)); // Si es un arreglo, extraemos los tableId
      } else if (notifiedTablesData && notifiedTablesData.tableId) {
        setNotifiedTables([notifiedTablesData.tableId]); // Si solo hay un 'tableId', lo envolvemos en un arreglo
      } else {
        setNotifiedTables([]); // Si no se encuentra ninguna mesa notificada
      }
  
      console.log('Mesas notificadas:', notifiedTablesData);
  
    } catch (error) {
      console.error("Error al obtener las mesas notificadas:", error);
    }
  };

  useEffect(() => {
    loadTables();
    getUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      loadNotifiedTables(); // Cargar las mesas notificadas después de obtener el ID del usuario
    }
  }, [userId]);

  // Obtener los datos del usuario
  const getUserData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await api.get('/auth/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = response.data;
      setUserId(user.idUser); // Guardamos el ID del usuario
      setRole(user.role); // Guardamos el rol del usuario (cliente o administrador)
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  // Agrupar mesas por sector y solo mostrar las activas
  const tablesBySector = tables
    .filter((table) => table.isActived)
    .reduce((acc, table) => {
      const sector = acc[table.sector] || [];
      sector.push(table);
      acc[table.sector] = sector;
      return acc;
    }, {});

  // Notificar a la mesa
  const handleNotify = async (tableId) => {
    // Verificar si la mesa ya está notificada
    const isNotified = notifiedTables.includes(tableId);
  
    if (isNotified) {
      // Mostrar el SweetAlert para eliminar la notificación
      const result = await Swal.fire({
        title: '¿Deseas eliminar la notificación de esta mesa?',
        text: 'Al eliminar la notificación, ya no estará asociada a esta mesa.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#FF3B30',
        cancelButtonColor: '#34C759',
      });
  
      if (result.isConfirmed) {
        try {
          // Eliminar la notificación en el backend
          await api.delete(`/notifications/${tableId}`, {
            data: { idClient: userId }, // Enviamos el ID del usuario para validación
          });
  
          // Actualizar las mesas localmente para reflejar el cambio
          setTables((prevState) =>
            prevState.map((table) =>
              table.tableId === tableId
                ? { ...table, available: true, color: '#FFD700' } // Cambiar a disponible y color amarillo
                : table
            )
          );
  
          // Actualizar notifiedTables localmente
          setNotifiedTables((prevState) => prevState.filter((id) => id !== tableId));
  
          Swal.fire('Notificación eliminada', 'La notificación ha sido eliminada de la mesa.', 'success');
        } catch (error) {
          console.error("Error al eliminar la notificación:", error);
  
          // Manejar el error y mostrar el mensaje adecuado
          if (error.response && error.response.status === 403) {
            Swal.fire('Acceso denegado', 'No puedes eliminar una notificación que no es tuya.', 'error');
          } else if (error.response && error.response.data && error.response.data.message) {
            Swal.fire('Error', error.response.data.message, 'error');
          } else {
            Swal.fire('Error', 'No se pudo eliminar la notificación de la mesa.', 'error');
          }
        }
      }
    } else {
      // Mostrar el SweetAlert para agregar la notificación
      const result = await Swal.fire({
        title: '¿Deseas realizar una notificación a esta mesa?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#34C759',
        cancelButtonColor: '#FF3B30',
      });
  
      if (result.isConfirmed) {
        try {
          // Enviar la notificación al backend
          await api.post('/notifications', {
            idClient: userId,  // ID del usuario
            idTable: tableId,  // ID de la mesa
          });
  
          Swal.fire('Notificado', 'La mesa ha sido notificada.', 'success');
          loadTables(); // Recargar las mesas
          loadNotifiedTables(); // Recargar las mesas notificadas
        } catch (error) {
          console.error("Error al notificar la mesa:", error);
  
          // Manejar el error y mostrar el mensaje adecuado
          if (error.response && error.response.data && error.response.data.message) {
            Swal.fire('Error', error.response.data.message, 'error');
          } else {
            Swal.fire('Error', 'No se pudo notificar la mesa.', 'error');
          }
        }
      }
    }
  };
  
  return (
    <div className="container flex-grow-1 text-white p-3" style={{ width: '100%', marginTop: '100px', marginBottom: '5%', backgroundColor: '#1F1F1F' }}>
      <h4 style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: '20px' }}>Notificaciones por Sector</h4>

      <div>
        {Object.keys(tablesBySector).map((sector) => (
          <div key={sector} className="mb-3">
            <h5 style={{ fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#343A40', padding: '10px', borderRadius: '5px' }}>
              {sector}
            </h5>

            <div className="d-flex flex-wrap">
              {tablesBySector[sector].map((table) => {
                // Verificar si la mesa está notificadas (si el ID de la mesa está en notifiedTables)
                const isNotified = notifiedTables.includes(table.tableId);

                return (
                  <div
                    key={table.tableId}
                    className="btn m-2"
                    onClick={() => handleNotify(table.tableId)}
                    style={{
                      backgroundColor: isNotified ? '#FFD700' :'#34C759' ,
                      color: 'white',
                      width: '120px',
                      height: '80px',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      borderRadius: '5px',
                    }}
                  >
                    MESA {table.number} <br />
                    {isNotified ? 'Notificada' : 'Disponible' }
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notification;
