import React, { useState, useEffect } from 'react';
import Header from '../Header/Main';
import Footer from '../Footer/Main';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function SeeOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [filter, setFilter] = useState({
    sector: 'Todos los sectores',
    state: 'Todos los estados',
  });

  useEffect(() => {
    fetchOrders();
    fetchSectors();
  }, []);

  async function fetchSectors() {
    try {
      const response = await api.get('/tables/sectors');
      const data = await response.data;
      setSectors(data);
    } catch (error) {
      console.error('Error al obtener los sectores', error);
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await api.get('/sales');
      setOrders(response.data);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  const changeOrderState = async (order) => {
    const { value: newState } = await Swal.fire({
      title: 'Cambiar Estado',
      input: 'select',
      inputOptions: {
        Pendiente: 'Pendiente',
        Preparado: 'Preparado',
        Servido: 'Servido',
        Pagado: 'Pagado',
      },
      inputPlaceholder: 'Selecciona un nuevo estado',
      showCancelButton: true,
      confirmButtonColor: '#34C759',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
    });
  
    if (newState) {
      try {
        // Actualizar el estado en el backend
        await api.put(`/sales/${order.idSales}`, { state: newState });
  
        // Actualizar el estado de la orden en la lista de órdenes
        const updatedOrders = orders.map((o) =>
          o.idSales === order.idSales ? { ...o, state: newState } : o
        );
        setOrders(updatedOrders);
  
        // Si la orden se marca como "Pagado", eliminarla de la vista
        if (newState === 'Pagado') {
          setOrders(updatedOrders.filter(o => o.idSales !== order.idSales));
        }
  
        // Verificar si todas las órdenes de la mesa están en estado "Pagado"
        checkAndUpdateTableAvailability(order.table.tableId, updatedOrders);
  
        Swal.fire('Actualizado', 'El estado de la orden ha sido actualizado.', 'success');
      } catch (error) {
        console.error('Error al cambiar el estado de la orden:', error);
        Swal.fire('Error', 'No se pudo cambiar el estado de la orden.', 'error');
      }
    }
  };
  

  const deleteOrder = async (idSales, tableId) => {
    const confirmDelete = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C83F46',
      cancelButtonColor: '#6C757D',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/sales/${idSales}`);
  
        // Actualizar la lista de órdenes en el estado después de la eliminación
        const updatedOrders = orders.filter((order) => order.idSales !== idSales);
        setOrders(updatedOrders);
  
        // Verificar si no quedan órdenes asociadas a la misma mesa
        const remainingOrdersForTable = updatedOrders.filter(order => order.table.tableId === tableId);
  
        if (remainingOrdersForTable.length === 0) {
          // Si no quedan órdenes para esta mesa, actualizar su estado a "disponible"
          await api.put(`/tables/changeAvaliable/${tableId}`, { available: true });
        }
  
        Swal.fire('Eliminado', 'La orden ha sido eliminada.', 'success');
      } catch (error) {
        console.error('Error al eliminar la orden:', error);
        Swal.fire('Error', 'No se pudo eliminar la orden.', 'error');
      }
    }
  };
  

  const goBack = () => {
    navigate('/OrderMenu');
  };

  const filteredOrders = orders.filter((order) => {
    return (
      (filter.sector === 'Todos los sectores' || order.table.sector === filter.sector) &&
      (filter.state === 'Todos los estados' || order.state === filter.state)
    );
  });

  const handleDetails = (order) => {
    Swal.fire({
      title: `Detalles de la Orden ${order.idSales}`,
      html: `
            <p><strong>Mesa:</strong> ${order.table.sector} Mesa ${order.table.number}</p>
            <p><strong>Propietario:</strong> ${order.owner}</p>
            <p><strong>Estado:</strong> ${order.state}</p>
            <p><strong>Mesero:</strong> ${order.user.firstName} ${order.user.lastName}</p>
            <hr />
            <h5>Platos solicitados:</h5>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Notas</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.dishes.map(dish => `
                        <tr>
                            <td>${dish.name}</td>
                            <td>${dish.price}</td>
                            <td>${dish.quantity}</td>
                            <td>${dish.price * dish.quantity}</td>
                            <td>
                                ${dish.note ? 
                                    `<button class="btn btn-info"   
 onclick="showNote('${dish.note}')">Ver Nota</button>` :
                                    '<span>Sin nota</span>'
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p><strong>Total:</strong> ${order.dishes.reduce((total, dish) => total + (dish.price * dish.quantity), 0)}</p>
        `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#6C757D',
    });
  };

  window.showNote = (note) => {
    Swal.fire({
      title: 'Nota del Plato',
      text: note || 'No hay notas adicionales',
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#6C757D',
    });
  };

  // Función para verificar si todas las órdenes de una mesa están pagadas
  const checkAndUpdateTableAvailability = async (tableId, updatedOrders) => {
    const ordersForTable = updatedOrders.filter(order => order.table.tableId === tableId);
    const allPaid = ordersForTable.every(order => order.state === 'Pagado');

    if (allPaid) {
      try {
        // Actualizar la disponibilidad de la mesa a 'true' (disponible)
        await api.put(`/tables/changeAvaliable/${tableId}`, { available: true });
        console.log(`La mesa ${tableId} ahora está disponible.`);
      } catch (error) {
        console.error('Error al actualizar la disponibilidad de la mesa:', error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="bg-dark text-white p-3" style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden', marginTop: '110px', marginBottom: '40px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-white m-0">Orders</h1>
        </div>

        <div className="d-flex gap-2 mb-3">
          <select
            value={filter.sector}
            onChange={(e) => setFilter({ ...filter, sector: e.target.value })}
            className="form-select bg-secondary text-white"
          >
            <option value="Todos los sectores">Todos los sectores</option>
            {sectors.map((sector, index) => (
              <option key={index} value={sector}>
                {sector}
              </option>
            ))}
          </select>
          <select
            value={filter.state}
            onChange={(e) => setFilter({ ...filter, state: e.target.value })}
            className="form-select bg-secondary text-white"
          >
            <option>Todos los estados</option>
            <option>Pendiente</option>
            <option>Preparado</option>
            <option>Servido</option>
           
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless text-white mt-3" style={{ width: '100%', tableLayout: 'auto' }}>
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap' }}>Mesa</th>
                <th style={{ whiteSpace: 'nowrap' }}>Sector</th>
                <th style={{ whiteSpace: 'nowrap' }}>Estado</th>
                <th style={{ whiteSpace: 'nowrap' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr id={order.idSales} key={order.idSales}>
                  <td style={{ whiteSpace: 'nowrap' }}>{order.table.number}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{order.table.sector}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className={`badge ${getStatusBadgeClass(order.state)}`} onClick={() => changeOrderState(order)}>
                      {order.state}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="btn btn_primary"  style={{ backgroundColor: '#40E2FF', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', minWidth: '80px', whiteSpace: 'nowrap', marginRight: '5px' }} onClick={() => handleDetails(order)}>
                      Detalles
                    </button>
                    <button className="btn btn_primary"  style={{  color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', minWidth: '80px', whiteSpace: 'nowrap', marginRight: '5px' }} onClick={() => deleteOrder(order.idSales,order.table.tableId)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn btn_primary"
            style={{
              backgroundColor: '#34C759',
              color: 'white',
              fontWeight: 'bold',
            }}
            onClick={goBack}
          >
            Regresar
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SeeOrders;


function getStatusBadgeClass(state) {
  switch (state) {
    case 'Servido':
      return 'bg-success text-dark';
    case 'Preparado':
      return 'bg-warning text-dark';
    case 'Pendiente':
      return 'bg-danger text-white';
    default:
      return 'bg-secondary text-white';
  }
}

