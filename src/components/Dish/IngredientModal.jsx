import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function IngredientModal({ ingredient, onClose, onAddIngredient }) {

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");

    useEffect(() => {
        if (ingredient) {
            setName(ingredient.name);
            setQuantity(ingredient.quantity);
            setUnit(ingredient.unit)
        } else {
            setName('');
            setQuantity('');
            setUnit('');
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        var message = '';

        if (name.trim() === '') {
            message = 'Es requerido el nombre del ingrediente'
        }

        if (!message && (quantity.trim() === '' || !parseInt(quantity))) {
            message = 'Es requerida la cantidad y valores mayores a cero';
        }

        if (!message && unit.trim() === '') {
            message = 'Es requerida seleccionar un tipo de unidad';
        }

        if (message) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
            });
        } else {
            onAddIngredient(ingredient, { name, quantity, unit });
            onClose();
        }

    };

    return (
        <div className='modal-backdrop' style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>

            <form className='modal-content text-white p-4' style={{
                width: '400px',
                borderRadius: '20px',
                backgroundColor: '#000000',
                border: '5px solid #696969'
            }} onSubmit={handleSubmit}>

                <div className="section_title text-center">
                    <h2>{ingredient ? 'Editar ingrediente' : 'Añadir ingrediente'}</h2>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Ingrediente"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Cantidad"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <select name='Unidad' className="form-control" value={unit}
                        onChange={(e) => setUnit(e.target.value)}>
                        <option value="">Sin seleccionar</option>
                        <option value="Taza">Taza</option>
                        <option value="Mililitros">Mililitros</option>
                        <option value="Gramos">Gramos</option>
                        <option value="Onzas">Onzas</option>
                    </select>
                </div>

                <button className="btn btn_primary w-100 mb-2" style={{ backgroundColor: '#34C759', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleSubmit}>Guardar</button>
                <button className="btn btn_primary w-100" style={{ backgroundColor: '#6C757D', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={onClose}>Cerrar</button>
            </form>

        </div >
    );

}

export default IngredientModal;