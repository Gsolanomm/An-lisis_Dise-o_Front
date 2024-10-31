import React, { useState, useEffect } from 'react';
import Header from '../Header/Main';
import InformationModal from './InformationModal';
import axios from 'axios';
import { createCategory } from '../models/Category';
import { createSubCategory } from '../models/SubCategory';
import CategoryModal from './CategoryModal';

function SeeCategorys() {
    const [CategoryVisibility, setCategoryVisibility] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [PickedCategory, setPickedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/categories', { withCredentials: true });
                const formattedCategories = response.data.map(cat => 
                    createCategory(cat.idCategory, cat.name, cat.createdAt, cat.updatedAt)
                );
                setCategories(formattedCategories);
            } catch (error) {
                console.error('Error al obtener categorías:', error);
            }
        };
        fetchCategories();
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };
    
    const fetchSubCategories = async (category) => {
        try {
            const response = await axios.get(`http://localhost:5000/subcategories/${category.idCategory}`, { withCredentials: true });
            const formattedSubCategories = response.data.map(subCat =>
                createSubCategory(subCat.idSubCategory, subCat.idCategory, subCat.name, subCat.createdAt, subCat.updatedAt)
            );
            setSubCategories(formattedSubCategories);
        } catch (error) {
            console.error('Error al obtener subcategorías:', error);
        }
    };

    const openAddModal = () => {
        setPickedCategory(null);
        setShowCategoryModal(!showCategoryModal);
    };

    const openEditModal = async (category) => {
        setPickedCategory(category);
        await fetchSubCategories(category);
        setShowCategoryModal(!showCategoryModal);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setPickedCategory(null);
    };

    const handleSubmitCategory = async (categoryData) => {
        if (PickedCategory) {
            try {
                await axios.put(`http://localhost:5000/categories/${PickedCategory.idCategory}`, categoryData, { withCredentials: true });
                setCategories(categories.map(cat => cat.idCategory === PickedCategory.idCategory ? { ...cat, name: categoryData.name } : cat));

                const subcategoryChangePromise = subCategories.map(subCategory => {
                    if (!categoryData.subCategories.find(sc => sc.idSubCategory === subCategory.idSubCategory)) {
                        return axios.delete(`http://localhost:5000/subcategories/${subCategory.idSubCategory}`, { withCredentials: true });
                    }
                });


                const changePromiseSubcategory = subCategories.map(async (subCategory) => {
                    const existingSubCategory = categoryData.subCategories.find(
                        sc => sc.idSubCategory === subCategory.idSubCategory
                    );
                

                    if (existingSubCategory && existingSubCategory.name !== subCategory.name) {
                        try {
                            await axios.put(
                                `http://localhost:5000/subcategories/${subCategory.idSubCategory}`,
                                { 
                                    name: existingSubCategory.name, 
                                    updatedAt: new Date()  // Asegúrate de que esto se esté enviando
                                },
                                { withCredentials: true }
                            );
                        } catch (error) {
                            console.error(`Error al actualizar la subcategoría con ID ${subCategory.idSubCategory}:`, error);
                        }
                    }
                    
                });
                

                const newSubCategoryPromises = categoryData.subCategories.map(subCategory => {
                    if (!subCategory.idSubCategory || subCategory.idSubCategory.toString().startsWith('temp-')) {
                        return axios.post(`http://localhost:5000/subcategories/`, {
                            idCategory: PickedCategory.idCategory,
                            name: subCategory.name,
                        }, { withCredentials: true });
                    }
                });
                

                await Promise.all([...subcategoryChangePromise, ...newSubCategoryPromises,...changePromiseSubcategory]);
            } catch (error) {
                console.error('Error al editar la categoría:', error);
            }
        } else {
            // Agregar nueva categoría
            try {
                const response = await axios.post('http://localhost:5000/categories', categoryData, { withCredentials: true });
                const newCategory = response.data.category; // Obtener la categoría recién creada
                setCategories([...categories, newCategory]);

                const idCategory = newCategory.idCategory; // Recuperar el ID de la nueva categoría

                // Crear promesas para las subcategorías
                const subCategoryPromises = categoryData.subCategories.map(subCategory => {
                    return axios.post(`http://localhost:5000/subcategories/`, {
                        idCategory: idCategory,
                        name: subCategory.name,
                    }, { withCredentials: true });
                });

                // Esperar a que todas las promesas se resuelvan
                await Promise.all(subCategoryPromises);
            } catch (error) {
                console.error('Error al crear la categoría o las subcategorías:', error);
            }
        }
    
        closeCategoryModal();
    };

    const openDetailModal = async (category) => {
        setPickedCategory(category);
        await fetchSubCategories(category);
        setShowDetailModal(true);
    };

    const openDeleteModal = (category) => {
        setPickedCategory(category);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setPickedCategory(null);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setPickedCategory(null);
    };

    const deleteCategory = async (category) => {
        try {
            await axios.delete(`http://localhost:5000/categories/${category.idCategory}`, { withCredentials: true });
            setCategories(categories.filter(c => c.idCategory !== category.idCategory));
            closeDeleteModal();
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };

    return (
        <>
            <Header />

            <div className="content-Pane" style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '50px', padding: '0', marginBottom: '100px', overflowX:'hidden', height:'100%', }}>
                <div className="Settings d-flex flex-column flex-md-row mt-5">
                    <div className="settings p-3 border-end bg-dark text-white" style={{ width: '100%', position: 'relative', marginTop: '20px' }}>
                        <table className="table table-borderless text-white">
                            <thead>
                                <tr>
                                    <th className="text-center">Configuraciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="mt-2">
                                    <td
                                        className="btn btn_primary text-center w-100"
                                        onClick={() => setCategoryVisibility(!CategoryVisibility)}
                                        style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold' }}
                                    >
                                        Categorías
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {CategoryVisibility && (
                        <div className="container flex-grow-1 bg-dark text-white p-3" style={{ width: '100%', marginTop: '20px' }}>
                            <div className="categorys-header d-flex justify-content-between align-items-center mb-4">
                                <h1 className="text-white m-0">Categorías</h1>
                                <button className="btn btn_primary ms-3" style={{ backgroundColor: "#34C759", color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }} onClick={openAddModal}>
                                    AGREGAR
                                </button>
                            </div>

                            <table className="table table-borderless text-white mt-3">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(category => (
                                        <tr key={category.idCategory}>
                                            <td style={{ whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                                                {category.name}
                                            </td>
                                            <td className="d-flex justify-content-around">
                                                <button className="btn btn_primary" style={{ backgroundColor: '#40E2FF', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', minWidth: '80px', whiteSpace: 'nowrap', marginRight: '5px' }} onClick={() => openDetailModal(category)}>
                                                    DETALLES
                                                </button>
                                                <button className="btn btn_primary" style={{ backgroundColor: '#FF8640', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', minWidth: '80px', whiteSpace: 'nowrap', marginRight: '5px' }} onClick={() => openEditModal(category)}>
                                                    EDITAR
  
                                                </button>
                                                <button className="btn btn_primary" style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', minWidth: '80px', whiteSpace: 'nowrap' }} onClick={() => openDeleteModal(category)}>
                                                    ELIMINAR
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showDeleteModal && (
                <InformationModal
                    text={`¿Estás seguro que quieres eliminar la categoría "${PickedCategory?.name}"?`}
                    onConfirm={() => deleteCategory(PickedCategory)}
                    onCancel={closeDeleteModal}
                    mode={1}
                />
            )}

            {showDetailModal && (
                <InformationModal
                    text={
                        <>
                            <div>
                                <h6>Detalles de la Categoría</h6>
                                <p><strong>Nombre:</strong> {PickedCategory?.name}</p>
                                <p><strong>Fecha de Creación:</strong> {formatDate(PickedCategory?.createdAt)}</p>
                                <p><strong>Última Actualización:</strong> {formatDate(PickedCategory?.updatedAt)}</p>
                                <hr />
                                <h5>Lista de Subcategorías:</h5>
                                {subCategories.length > 0 ? subCategories.map(subCategory => (
                                    <div key={subCategory.idSubCategory}>
                                        <p > <strong>Nombre:</strong> {subCategory.name}</p>
                                        <p><strong>Fecha de Creación:</strong> {formatDate(subCategory.createdAt)}</p>
                                        <p><strong>Última Actualización:</strong> {formatDate(subCategory.updatedAt)}</p>
                                        <hr />
                                    </div>
                                )) : <p>No hay subcategorías disponibles.</p>}
                            </div>
                        </>
                    }
                    onCancel={closeDetailModal}
                    mode={2}
                />
            )}

            {showCategoryModal && (
                <CategoryModal
                    isOpen={showCategoryModal}
                    onClose={closeCategoryModal}
                    onSubmit={handleSubmitCategory}
                    category={PickedCategory}
                    subCategories={subCategories}
                />
            )}

            
        </>
    );
}

export default SeeCategorys;