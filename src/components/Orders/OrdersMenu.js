import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../Auth/AxiosConfig';
import OrderModal from './OrderModal'; 
import { useNavigate } from 'react-router-dom';


function OrdersMenu() {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [selectedTable, setSelectedTable] = useState(null);  
    const [selectedTableName, setSelectedTableName] = useState(""); 

    const loadTables = async () => {
        try {
            const response = await api.get('/tables');
            setTables(response.data);
        } catch (error) {
            console.error("Error al cargar las mesas:", error);
        }
    };

    useEffect(() => {
        loadTables();
    }, []);

    const handleNewSalonClick = () => {
        Swal.fire({
            title: 'Nuevo Salón',
            html:
                `<label for="sector" style="display:block; text-align:left;">Nombre del Sector:</label>` +
                `<input type="text" id="sector" class="swal2-input" placeholder="Ingrese el nombre del sector">` +
                `<label for="numMesas" style="display:block; text-align:left;">Número de Mesas:</label>` +
                `<input type="number" id="numMesas" class="swal2-input" placeholder="Ingrese el número de mesas">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Añadir',
            preConfirm: () => {
                const sector = document.getElementById('sector').value;
                const numMesas = document.getElementById('numMesas').value;

                if (!sector || !numMesas) {
                    Swal.showValidationMessage('Por favor, ingrese todos los datos');
                    return false;
                }

                return { sector, numMesas };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { sector, numMesas } = result.value;

                try {
                    await api.post('/tables', { sector, numMesas });
                    Swal.fire('¡Éxito!', `Se añadieron ${numMesas} mesas al sector ${sector}`, 'success');
                    loadTables();
                } catch (error) {
                    Swal.fire('Error', 'Hubo un problema al añadir las mesas', 'error');
                    console.error("Error al añadir mesas:", error);
                }
            }
        });
    };

    const handleViewOrders = () => {
        navigate('/see_orders');
      };

    const handleTableClick = (table, index) => {
        const tableName = `Mesa ${table.number}`;  // Usar el número de mesa
        setSelectedTable(table);  
        setSelectedTableName(tableName);  
        setShowModal(true);  
    };

    const handleTableStatusChange = async (tableId) => {
        try {
            // Realizar la actualización del estado de la mesa en la base de datos
            await api.put(`/tables/${tableId}`, { available: false }); // Cambiar el estado a "ocupada"
            
            // Actualizar el estado local para reflejar el cambio
            setTables((prevTables) => prevTables.map(table => 
                table.tableId === tableId ? { ...table, available: false } : table
            ));
        } catch (error) {
            console.error("Error al actualizar el estado de la mesa:", error);
        }
    };
    

    const handleEditSector = (sectorName) => {
        // Verificar si alguna mesa en el sector está ocupada
        const sectorTables = tables.filter(table => table.sector === sectorName);
        const hasOccupiedTable = sectorTables.some(table => !table.available); // Verifica si alguna mesa está ocupada
        
        if (hasOccupiedTable) {
            // Si hay alguna mesa ocupada, mostrar un error
            Swal.fire({
                title: 'Error',
                text: 'No se puede editar el sector porque hay mesas ocupadas.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
            return; // No permitir continuar con la edición
        }
    
        const currentNumMesas = sectorTables.length;
    
        Swal.fire({
            title: `Editar Salón: ${sectorName}`,
            html:
                `<label for="newSector" style="display:block; text-align:left;">Nuevo Nombre del Sector:</label>` +
                `<input type="text" id="newSector" class="swal2-input" placeholder="Ingrese el nuevo nombre del sector" value="${sectorName}">` +
                `<label for="newNumMesas" style="display:block; text-align:left;">Nuevo Número de Mesas:</label>` +
                `<input type="number" id="newNumMesas" class="swal2-input" value="${currentNumMesas}" placeholder="Ingrese el nuevo número de mesas">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            preConfirm: () => {
                const newSector = document.getElementById('newSector').value;
                const newNumMesas = parseInt(document.getElementById('newNumMesas').value, 10);
    
                if (!newSector || isNaN(newNumMesas)) {
                    Swal.showValidationMessage('Por favor, ingrese todos los datos');
                    return false;
                }
    
                return { newSector, newNumMesas };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { newSector, newNumMesas } = result.value;
    
                try {
                    await api.put(`/tables/${sectorName}`, { newSector, newNumMesas });
                    Swal.fire('¡Éxito!', `El sector ${sectorName} fue actualizado a ${newSector} con ${newNumMesas} mesas`, 'success');
                    loadTables(); // Recargar las mesas después de la actualización
                } catch (error) {
                    Swal.fire('Error', 'Hubo un problema al actualizar el sector', 'error');
                    console.error("Error al actualizar sector:", error);
                }
            }
        });
    };
    
    

    // Agrupar mesas por sector y solo mostrar las activas
    const tablesBySector = tables.filter(table => table.isActived).reduce((acc, table) => {
        const sector = acc[table.sector] || [];
        sector.push(table);
        acc[table.sector] = sector;
        return acc;
    }, {});

    return (
        <div className="container flex-grow-1 text-white p-3" style={{ width: '100%', marginTop: '100px', marginBottom: '5%', backgroundColor:'#1F1F1F' }}>
           <div className="d-flex justify-content-between mb-4">
    <button
        className="btn btn_primary"
        style={{
            backgroundColor: '#34C759',
            color: 'white',
            fontWeight: 'bold',
        }}
        onClick={handleViewOrders}
     // Cambia el handler si es necesario
    >
        Ver ordenes
    </button>

    <button
        className="btn btn_primary"
        style={{
            backgroundColor: '#34C759',
            color: 'white',
            fontWeight: 'bold',
        }}
        onClick={handleNewSalonClick}
    >
        + Nuevo salón
    </button>
</div>


         

            <div>
                {Object.keys(tablesBySector).map(sector => (
                    <div key={sector} className="mb-3">
                        <h5
                            style={{
                                fontWeight: 'bold',
                                color: '#ffffff',
                                cursor: 'pointer',
                                backgroundColor: '#343A40',
                                padding: '10px',
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                            onClick={() => handleEditSector(sector)}
                        >
                            {sector}
                            <i className="icofont-options" style={{ marginLeft: 'auto' }}></i>
                        </h5>

                        <div className="d-flex flex-wrap">
                            {tablesBySector[sector].map((table) => (
                               <button
                               key={table.tableId}
                               id={table.tableId}
                               className="btn m-2"
                               style={{
                                   backgroundColor: table.available ? '#34C759' : '#FF3B30', // Verde si está disponible, rojo si está ocupada
                                   color: 'white',
                                   width: '120px',
                                   height: '80px',
                                   fontWeight: 'bold',
                                   fontSize: '15px',
                                   whiteSpace: 'normal',
                                   textAlign: 'center',
                               }}
                               onClick={() => handleTableClick(table)}  // Abre el modal al seleccionar la mesa
                           >
                               MESA {table.number} <br /> {table.available ? "Disponible" : "Ocupada"}
                           </button>
                           
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para la orden */}
            {selectedTable && (
                <OrderModal
                    show={showModal}
                    onHide={() => setShowModal(false)}  
                    tableName={selectedTableName}  
                    tableId={selectedTable.tableId}  
                    sectorName={selectedTable.sector}  
                    onTableStatusChange={handleTableStatusChange}
                />
            )}
        </div>
    );
}

export default OrdersMenu;
