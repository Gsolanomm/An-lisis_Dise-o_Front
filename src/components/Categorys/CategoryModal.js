import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function CategoryModal({ isOpen, onClose, onSubmit, category, subCategories }) {
    const [name, setName] = useState('');
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [subCategoryName, setSubCategoryName] = useState('');
    const [pickedSubCategory, setPickedSubCategory] = useState(null);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setSelectedSubCategories(subCategories);
        } else {
            setName('');
        }
    }, [category, subCategories]);

    const handleAddSubCategory = () => {
        if (subCategoryName.trim()) {
            const newSubCategory = {
                idSubCategory: `temp-${Date.now()}`, // ID temporal para las nuevas subcategorías
                name: subCategoryName,
            };
            setSelectedSubCategories([...selectedSubCategories, newSubCategory]);
            setSubCategoryName('');
        }
    };

    const handleDeleteSubCategory = (index) => {
        const subCategoryToDelete = selectedSubCategories[index];

        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres eliminar la subcategoría "${subCategoryToDelete.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C83F46',
            cancelButtonColor: '#6C757D',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedSubCategories(selectedSubCategories.filter((_, i) => i !== index));
                Swal.fire(
                    'Eliminado!',
                    'La subcategoría ha sido eliminada.',
                    'success'
                );
            }
        });
    };

    const handleEditSubCategory = (subCategory) => {
        Swal.fire({
            title: `Cambiar nombre de la subcategoría "${subCategory.name}"`,
            input: 'text',
            inputValue: subCategory.name,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return '¡Debes ingresar un nombre!';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const newName = result.value;
                setSelectedSubCategories(selectedSubCategories.map(subCat => 
                    subCat.idSubCategory === subCategory.idSubCategory ? { ...subCat, name: newName } : subCat
                ));
                Swal.fire('Guardado!', 'El nombre de la subcategoría ha sido actualizado.', 'success');
            }
        });
    };
    

    const handleSubmit = () => {
        const categoryData = { name, subCategories: selectedSubCategories };

        if (categoryData.name.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Nombre de categoría inválido',
            });
        } else {
            onSubmit(categoryData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="modal-backdrop" 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className="modal-content text-white p-4" style={{ width: '400px', borderRadius: '20px', backgroundColor:'#000000', border: '5px solid #696969' }}>
                <div className="section_title text-center">
                    <h2>{category ? 'Editar Categoría' : 'Añadir Categoría'}</h2>
                </div>
                <div className="form_inner">
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            required
                            onChange={(e) => setName(e.target.value)}
                            className="form-control bg-dark text-white border rounded-2 p-3"
                            style={{
                                height: '55px',
                                border: '2px solid var(--border-grey)',
                                borderRadius: '10px',
                                fontWeight: 500,
                                backgroundColor: '#222',
                                color: 'var(--text-white)',
                                padding: '.375rem .75rem',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <h3 className="text-white">Subcategorías</h3>
                    <div className="subCategory-section form-group d-flex mb-3">
                        <input
                            type="text"
                            placeholder="Nombre de subcategoría"
                            value={subCategoryName}
                            onChange={(e) => setSubCategoryName(e.target.value)}
                            className="form-control bg-dark text-white border rounded-2 p-3 me-2"
                            style={{
                                height: '55px',
                                border: '2px solid var(--border-grey)',
                                borderRadius: '10px',
                                fontWeight: 500,
                                backgroundColor: '#222',
                                color: 'var(--text-white)',
                                marginRight: '20px',
                            }}
                        />
                        <button className="btn btn_primary" style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', minWidth: '80px', whiteSpace: 'nowrap' }} onClick={handleAddSubCategory}>
                            Añadir
                        </button>
                    </div>

                    <ul className="subCategory-list list-unstyled" style={{  maxHeight: '200px', overflowY: 'auto',paddingRight: '10px'}}>
                        {selectedSubCategories && selectedSubCategories.length > 0 ? (
                            selectedSubCategories.map((subCategory, index) => (
                                <li key={subCategory.idSubCategory} className="subCategory-item d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-white" style={{
                                        maxWidth: '160px', 
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis' 
                                    }}>
                                        {subCategory.name}
                                    </span>
                                    <div>
                                        <button className="btn btn_primary" style={{
                                            minWidth:'70px',
                                            backgroundColor: '#FFC107', 
                                            color: 'white', 
                                            fontWeight: 'bold', 
                                            padding: '5px 10px', 
                                            fontSize: '14px', 
                                            marginRight: '5px' 
                                        }} onClick={() => handleEditSubCategory(subCategory)}>
                                            Editar
                                        </button>
                                        <button className="btn btn_primary" style={{
                                            minWidth:'70px', 
                                            backgroundColor: '#C83F46', 
                                            color: 'white', 
                                            fontWeight: 'bold', 
                                            padding: '5px 10px', 
                                            fontSize: '14px' 
                                        }} onClick={() => handleDeleteSubCategory(index)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="text-white">{category ? 'No hay subcategorías' : ''}</li>
                        )}
                    </ul>

                    <div className="row mt-3">
                        <div className="col">
                            <button className="btn btn_primary w-100" style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleSubmit}>
                                {category ? 'Guardar Cambios' : 'Añadir'}
                            </button>
                        </div>
                        <div className="col">
                            <button className="btn btn_primary w-100"  style={{ backgroundColor: '#6C757D', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={onClose}>Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryModal;
