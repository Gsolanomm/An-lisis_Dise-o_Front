import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Auth/AxiosConfig';
import IngredientModal from './IngredientModal';
import Swal from 'sweetalert2';

function Recipe() {

    const { idDish } = useParams();

    const [idRecipe, setIdRecipe] = useState(0);
    const [instructions, setInstructions] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingredient, setIngredient] = useState(null);
    const [showIngredientModal, setShowIngredientModal] = useState(false);

    useEffect(() => {
        loadRecipe();
    }, []);

    function loadRecipe() {
        api.get(`/recipes/${idDish}`, { withCredentials: true })
            .then(function (response) {
                var data = response.data;
                if (data === null || data === undefined) {
                    setIdRecipe(-1);
                } else {
                    setIdRecipe(data.idRecipe);
                    setInstructions(data.instructions);

                    try {
                        var list = JSON.parse(data.ingredients);
                        setIngredients(list);
                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se cargaron los ingredientes',
                        });
                    }
                }
            })
    }

    const handleOpenModal = () => {
        setShowIngredientModal(true);
    };

    const handleCloseModal = () => {
        setShowIngredientModal(false);
        setIngredient(null);
    };

    const handleAddIngredient = (oldIngredient, selectedIngredient) => {
        var array = handleDeleteIngredient(oldIngredient);
        array.push(selectedIngredient);
        setIngredients(array);
    }

    const handleEditIngredient = (selectedIngredient) => {
        setIngredient(selectedIngredient);
        setShowIngredientModal(true);
    }

    const handleDeleteIngredient = (oldIngredient) => {
        var array = [...ingredients];
        var index = array.findIndex(item => item === oldIngredient);

        if (index > -1 && index < array.length) {
            array.splice(index, 1);
            setIngredients(array);
        }
        return array;
    }

    const handleSubmit = () => {
        var data = { instructions, ingredients: JSON.stringify(ingredients) };
        if (idRecipe == -1) {
            data.idDish = idDish;
            api.post(`/recipes`, data, { withCredentials: true })
            .then((response) => {

                loadRecipe();
                Swal.fire({
                    icon: 'success',
                    title: 'Exitoso',
                    text: response.data.message,
                });
            })
        } else {
            api.put(`/recipes/${idRecipe}`, data, { withCredentials: true })
            .then((response) => {
                loadRecipe();
                Swal.fire({
                    icon: 'success',
                    title: 'Exitoso',
                    text: response.data.message,
                });
            })
        }
    }

    const handleSubmitDelete = () => {
        api.delete(`/recipes/${idRecipe}`, { withCredentials: true })
        .then((response) => {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            Swal.fire({
                icon: 'success',
                title: 'Exitoso',
                text: response.data.message,
            });
        })
    }

    return (
        <div className='container mt-5'>
            <div className="content-Pane mt-5">
                <h1 style={{ color: 'white' }}>Receta</h1>

                <div class="mb-3">
                    <label for="" class="form-label">Preparación</label>
                    <textarea class="form-control" id="" rows="3" value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}></textarea>
                </div>

                <button className="btn btn_primary mt-4" style={{ backgroundColor: '#6C757D', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleOpenModal} >Agregar ingrediente</button>

                <table className="table table-borderless text-white mt-3">
                    <thead>
                        <tr>
                            <th>Ingrediente</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit}</td>
                                <td>
                                    <button className="btn btn_primary mt-4" style={{ backgroundColor: '#34C759', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={() => handleEditIngredient(item)}>Editar</button>
                                    <button className="btn btn_primary mt-4" style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={() => handleDeleteIngredient(item)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className="btn btn_primary mt-4" style={{ backgroundColor: '#34C759', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleSubmit}>Guardar</button>
                
                {idRecipe > 0 && (
                    <button className="btn btn_primary mt-4 ml-2" style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleSubmitDelete}>Eliminar</button>
                )}
            </div>

            {showIngredientModal && (
                <IngredientModal ingredient={ingredient} onClose={handleCloseModal} onAddIngredient={handleAddIngredient} />
            )}

        </div>
    );
}

export default Recipe;