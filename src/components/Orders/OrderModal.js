import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';
function OrderModal({ show, onHide, tableName, tableId, sectorName, onTableStatusChange }) {


    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [orderDetailsByTable, setOrderDetailsByTable] = useState({});
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await api.get('/categories');
            setCategories(response.data);
        };
  
   

        fetchCategories();
    }, []);


    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        setLoadingSubcategories(true);

        try {
            const response = await api.get(`/dish/categoryById/${category.idCategory}`);
            setDishes(response.data);
            const subcategoriesResponse = await api.get(`/subcategories/${category.idCategory}`);
            setSubcategories(subcategoriesResponse.data);
        } finally {
            setLoadingSubcategories(false);
        }
    };

    const getUserData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await api.get('/auth/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const user = response.data;
            return user.idUser;
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
            return null;
        }
    };

    const handleOrderCompletion = () => {

        Swal.fire({
            title: 'Orden emitida',
            text: 'La orden ha sido emitida con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#28a745'
        });

        // Aquí puedes llamar a la función pasada desde OrdersMenu para cambiar el estado de la mesa
        onTableStatusChange(tableId);
        orderDetailsByTable[tableId] = [];
        onHide();  // Cerrar el modal después de cambiar el estado
    };

    const handleEmitOrder = () => {
        // Verificar si no hay items en la lista
        if (!orderDetailsByTable[tableId] || orderDetailsByTable[tableId].length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'Debe haber al menos un platillo seleccionado.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
            return; // Detiene la ejecución si no hay items seleccionados
        }
    
        Swal.fire({
            title: 'Ingrese el nombre del cliente',
            input: 'text',
            inputPlaceholder: 'Nombre del cliente',
            showCancelButton: true,
            confirmButtonText: 'Emitir orden',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return '¡Por favor, ingrese el nombre del cliente!';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const orderDetails = {
                    tableId,
                    sectorName,
                    customerName: result.value,
                    items: orderDetailsByTable[tableId] || [],
                    total: getTotal(),
                };
    
                const idEmployee = await getUserData();
    
                if (!idEmployee) {
                    console.error('ID del empleado no encontrado');
                    return;
                }
    
                try {
                    // Emitir la venta
                    const response = await api.post(`/sales/${idEmployee}`, orderDetails);
                    console.log('Venta registrada:', response.data);
                    
                    // Mostrar el Swal de éxito solo si la venta se registró correctamente
                  
                    // Llamar a la función para finalizar la orden después de la respuesta
                    handleOrderCompletion();
                } catch (error) {
                    console.error('Error al emitir la orden:', error);
                    // Mostrar error si falla la emisión de la venta
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al emitir la orden.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#d33'
                    });
                }
            }
        });
    };
    
    

    const handleSubCategoryClick = async (subcategory) => {
        if (selectedCategory) {
            const response = await api.get(`/dish/SubcategoryById/${selectedCategory.idCategory}/subcategory/${subcategory.idSubCategory}`);
            setDishes(response.data);
        }
    };

    const handleAddDish = (dish) => {
        const existingDish = orderDetailsByTable[tableId]?.find((item) => item.idDish === dish.idDish);
    

        const updatedOrderDetails = existingDish
            ? orderDetailsByTable[tableId].map((item) =>
                item.idDish === dish.idDish ? { ...item, quantity: item.quantity + 1 } : item
            )
            : [...(orderDetailsByTable[tableId] || []), { ...dish, quantity: 1 }];
    
        setOrderDetailsByTable({
            ...orderDetailsByTable,
            [tableId]: updatedOrderDetails
        });
    };

    const handleQuantityChange = (dish, delta) => {
        const updatedOrderDetails = orderDetailsByTable[tableId]
            .map((item) =>
                item.idDish === dish.idDish ? { ...item, quantity: item.quantity + delta } : item
            )
            .filter(item => item.quantity > 0);
        setOrderDetailsByTable({
            ...orderDetailsByTable,
            [tableId]: updatedOrderDetails
        });
    };

    const getTotal = () => {
        return (orderDetailsByTable[tableId] || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        try {
            const response = await api.get(`/dish/search/${searchTerm}`);
            setDishes(response.data.dishes);
        } catch (error) {
            console.error("Error fetching dishes:", error);
        }
    };

    const handleNoteClick = (dish) => {
        const existingNote = dish.note || "";

        Swal.fire({
            title: 'Escribe una nota para el plato',
            input: 'text',
            inputValue: existingNote,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            inputPlaceholder: 'Escribe tu nota...',
            focusConfirm: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedOrderDetails = orderDetailsByTable[tableId].map((item) =>
                    item.idDish === dish.idDish ? { ...item, note: result.value } : item
                );
                setOrderDetailsByTable({
                    ...orderDetailsByTable,
                    [tableId]: updatedOrderDetails
                });
            }
        });
    };

    return (
        show && (
            <div className="custom-modal-overlay" style={styles.overlay}>
                <div className="custom-modal-content" style={styles.modalContent}>
                    <div className="modal-header" style={styles.modalHeader}>
                        <h5 className="modal-title" style={{ color: '#fff' }}>{sectorName} {tableName}</h5>
                        <button onClick={onHide} style={styles.closeButton}>×</button>
                    </div>
                    <div className="modal-body" style={styles.modalBody}>
                        <div className="d-flex flex-column">
                        <div className="d-flex flex-wrap mb-3">
    {categories.map((category) => (
        <button
            key={category.idCategory}
            onClick={() => handleCategoryClick(category)}
            className="btn btn_primary"
            style={{
                backgroundColor: '#FF8640',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 13px',
                fontSize: '17px',
                minWidth: '80px',
                whiteSpace: 'nowrap',
                marginRight: '5px',
                marginBottom: '5px' // Agrega margen inferior para espacio entre filas
            }}
        >
            {category.name}
        </button>
    ))}
</div>


                            {loadingSubcategories ? (
    <div className="d-flex justify-content-center mb-3">
        <Spinner animation="border" variant="light" />
    </div>
) : (
    <div className="d-flex flex-wrap mb-3">
        {subcategories.map((subcategory) => (
            <button
                key={subcategory.idSubCategory}
                onClick={() => handleSubCategoryClick(subcategory)}
                className="btn btn_primary"
                style={{
                    backgroundColor: '#007BFF',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '10px 13px',
                    fontSize: '17px',
                    minWidth: '80px',
                    whiteSpace: 'nowrap',
                    marginRight: '5px',
                    marginBottom: '5px' // Añade espacio entre líneas de categorías
                }}
            >
                {subcategory.name}
            </button>
        ))}
    </div>
)}


                            <div className="d-flex mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar platos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="me-2"
                                    style={{
                                        backgroundColor: '#1F1F1F',
                                        color: '#fff',
                                        borderColor: '#343A40'
                                    }}
                                />
                                <button
                                    className="btn btn_primary"
                                    style={{
                                        backgroundColor: '#FF8640',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        padding: '10px 13px',
                                        fontSize: '17px',
                                        minWidth: '80px',
                                        whiteSpace: 'nowrap',
                                        marginRight: '5px'
                                    }}
                                    onClick={handleSearch}
                                >
                                    Buscar
                                </button>
                            </div>

                            <div className="dish-list d-flex flex-wrap" style={{ overflowY: 'auto', maxHeight: '400px' }}>
                                {dishes.map((dish) => (
                                    <div
                                        key={dish.idDish}
                                        className="col-lg-6 col-md-12"
                                        onClick={() => handleAddDish(dish)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                      <div
                            className="dish_box"
                            style={{
                                backgroundColor:
                                    orderDetailsByTable[tableId]?.some(item => item.idDish === dish.idDish)
                                        ? '#34C759' // Verde para platos en la orden
                                        : '#333', // Gris oscuro para los demás
                                borderRadius: '10px',
                                margin: '10px',
                                padding: '15px',
                            }}
                        >
                                            <div className="dish_info d-flex">
                                                <div className="dish_img" style={{ marginRight: '15px' }}>
                                                    <img
                                                        src={`http://localhost:5000${dish.uriImage}`}
                                                        alt={dish.name}
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                </div>
                                                <div className="dish_text">
                                                    <h3 style={{ color: '#fff' }}>{dish.name}</h3>
                                                    <p style={{ color: '#ccc' }}>{dish.description}</p>
                                                    <span className="price" style={{ color: '#fff' }}>
                                                        ₡{dish.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <ul className="list-group" style={{ backgroundColor: '#333', overflowY: 'auto', maxHeight: '200px' }}>
                                {(orderDetailsByTable[tableId] || []).map((item) => (
                                    <li
                                        key={item.idDish}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                        style={{ backgroundColor: '#343A40', color: '#fff' }}
                                    >
                                        <span style={{ minWidth: '30%' }}>{item.name}</span>
                                        <div>
                                            <Button
                                                variant="light"
                                                onClick={() => handleQuantityChange(item, -1)}
                                                className="btn btn_primary"
                                                style={{
                                                    backgroundColor: '#34C759',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    padding: '5px 8px',
                                                    fontSize: '17px',
                                                }}
                                            >
                                                -
                                            </Button>
                                            <span className="badge bg-light text-dark">{item.quantity}</span>
                                            <Button
                                                variant="light"
                                                onClick={() => handleQuantityChange(item, 1)}
                                                className="btn btn_primary"
                                                style={{
                                                    backgroundColor: '#34C759',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    padding: '5px 8px',
                                                    fontSize: '17px',
                                                }}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <span>₡{item.price * item.quantity}</span>
                                        <button
    onClick={() => handleNoteClick(item)}
    style={{
        backgroundColor: 'transparent',
        border: 'none',
        color: item.note ? '#28a745' : '#FF8640', // Si tiene nota, el color será verde
        cursor: 'pointer',
    }}
>
    <i className="fa fa-sticky-note"></i>
</button>

                                    </li>
                                ))}
                            </ul>

                            <div className="d-flex justify-content-between mt-3" style={{ marginTop: '20px', fontSize: '18px', color: '#fff' }}>
                                <strong>Total:</strong> ₡{getTotal()}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer" style={styles.modalFooter}>
                        <button className='btn btn_primary'
                            onClick={onHide}
                            style={styles.buttonExit}
                        >
                            Salir
                        </button>
                        <button className='btn btn_primary'
                            style={styles.buttonSubmit}
                            onClick={handleEmitOrder}
                        >
                            Emitir orden
                        </button>
                    </div>
                </div>
            </div>
        )
    );


}

export default OrderModal;


const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050,
    },
    modalContent: {
        width: '100%',
        maxWidth: '1000px',
        backgroundColor: '#2C2C2C',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#1F1F1F',
        color: '#fff',
    },
    closeButton: {
        fontSize: '1.5rem',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
    },
    modalBody: {
        padding: '1rem',
        color: '#fff',
        maxHeight: '60vh',  // Cambié el maxHeight para permitir scroll
        overflowY: 'auto',
    },
    modalFooter: {
        padding: '1rem',
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: '#2C2C2C',
    },
    buttonExit: {
        backgroundColor: '#343A40',
        color: 'white',
        padding: '10px 13px',
        fontSize: '17px',
        marginRight: '10px',
        cursor: 'pointer',
    },
    buttonSubmit: {
        backgroundColor: '#34C759',
        color: 'white',
        padding: '10px 13px',
        fontSize: '17px',
        cursor: 'pointer',
    },
};
