import React, { useEffect, useState } from 'react';
import { Modal, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import api from '../Auth/AxiosConfig';

function OrderModal({ show, onHide, tableName, tableId }) {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await api.get('/categories');
            setCategories(response.data);
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        setSelectedSubCategory(null);

        const subcategoriesResponse = await api.get(`/subcategories/${category.idCategory}`);
        setSubcategories(subcategoriesResponse.data);
    };

    const handleSubCategoryClick = async (subcategory) => {
        setSelectedSubCategory(subcategory);
        const response = await api.get(`/products?subcategory=${subcategory.id}`);
        setProducts(response.data);
    };

    const handleAddProduct = (product) => {
        const existingProduct = orderDetails.find((item) => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
            setOrderDetails([...orderDetails]);
        } else {
            setOrderDetails([...orderDetails, { ...product, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (product, delta) => {
        const updatedOrderDetails = orderDetails.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + delta } : item
        );
        setOrderDetails(updatedOrderDetails.filter((item) => item.quantity > 0));
    };

    const getTotal = () => orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton style={{ backgroundColor: '#1F1F1F', color: '#fff' }}>
                <Modal.Title>{tableName} </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#2C2C2C' }}>
                <div className="d-flex">
                    {/* Sección izquierda: Categorías y productos */}
                    <div className="w-50 pr-3">
                        <div className="d-flex mb-3">
                            {categories.map((category) => (
                                <DropdownButton
                                    key={category.id}
                                    title={category.name}
                                    onMouseEnter={() => handleCategoryClick(category)}
                                    className="mr-2"
                                    variant="secondary"
                                >
                                    {subcategories.map((subcategory) => (
                                        <Dropdown.Item
                                            key={subcategory.id}
                                            onClick={() => handleSubCategoryClick(subcategory)}
                                            style={{ backgroundColor: '#343A40', color: '#fff' }}
                                        >
                                            {subcategory.name}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            ))}
                        </div>
                        <Form.Control
                            type="text"
                            placeholder="Buscar productos, presione Enter"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                            className="mb-3"
                            style={{ backgroundColor: '#1F1F1F', color: '#fff', borderColor: '#343A40' }}
                        />
                        <div className="product-list d-flex flex-wrap">
                            {products.map((product) => (
                                <Button
                                    key={product.id}
                                    className="product-item m-2"
                                    style={{
                                        width: '120px',
                                        height: '100px',
                                        backgroundColor: '#34C759',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        fontSize: '14px'
                                    }}
                                    onClick={() => handleAddProduct(product)}
                                >
                                    {product.name} <br /> S/{product.price.toFixed(2)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Sección derecha: Detalles de consumo */}
                    <div className="w-50">
                        <h5 style={{ color: '#fff' }}>Detalle de consumo:</h5>
                        <ul className="list-group" style={{ backgroundColor: '#2C2C2C', color: '#fff' }}>
                            {orderDetails.map((item) => (
                                <li
                                    key={item.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ backgroundColor: '#343A40', color: '#fff' }}
                                >
                                    <span>{item.name}</span>
                                    <div>
                                        <Button
                                            variant="light"
                                            onClick={() => handleQuantityChange(item, -1)}
                                            style={{ backgroundColor: '#34C759' }}
                                        >
                                            -
                                        </Button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <Button
                                            variant="light"
                                            onClick={() => handleQuantityChange(item, 1)}
                                            style={{ backgroundColor: '#34C759' }}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <span>S/{(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="d-flex justify-content-between mt-3" style={{ color: '#fff' }}>
                            <strong>Total:</strong>
                            <strong>S/{getTotal().toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#2C2C2C' }}>
                <Button variant="secondary" onClick={onHide} style={{ backgroundColor: '#343A40' }}>
                    Salir
                </Button>
                <Button variant="primary" style={{ backgroundColor: '#34C759' }}>
                    Imprimir Comanda
                </Button>
                <Button variant="success" style={{ backgroundColor: '#34C759' }}>
                    Emitir Venta
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default OrderModal;
