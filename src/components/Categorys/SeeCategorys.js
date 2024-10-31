import React, { useState, useEffect } from 'react';
import InformationModal from './InformationModal';
import { createCategory } from '../models/Category';
import { createSubCategory } from '../models/SubCategory';
import CategoryModal from './CategoryModal';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';

function SeeCategorys() {
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [PickedCategory, setPickedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {

                
                const response =  await api.get('/categories', { withCredentials: true });
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
            const response = await api.get(`/subcategories/${category.idCategory}`, { withCredentials: true });
            const formattedSubCategories = response.data.map(subCat =>
                createSubCategory(subCat.idSubCategory, subCat.idCategory, subCat.name, subCat.createdAt, subCat.updatedAt)
            );
            setSubCategories(formattedSubCategories);
            return formattedSubCategories;
        } catch (error) {
            console.error('Error al obtener subcategorías:', error);
            return [];
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

    const openDetailModal = async (category) => {
      const subCategories =  await fetchSubCategories(category);
        setPickedCategory(category);
        levantarModal(category,subCategories)

    };

    const levantarModal = (category,subCategories) =>{
        
        Swal.fire({
            title: 'Detalles de la Categoría',
            html: `
                <p><strong>Nombre:</strong> ${category.name}</p>
                <p><strong>Fecha de Creación:</strong> ${formatDate(category.createdAt)}</p>
                <p><strong>Última Actualización:</strong> ${formatDate(category.updatedAt)}</p>
                <hr />
                <h5>Lista de Subcategorías:</h5>
                <div style="max-height: 150px; overflow-y: auto;">
                    ${subCategories.length > 0 ? subCategories.map(subCategory => `
                        <div>
                            <p><strong>Nombre:</strong> ${subCategory.name}</p>
                            <p><strong>Fecha de Creación:</strong> ${formatDate(subCategory.createdAt)}</p>
                            <p><strong>Última Actualización:</strong> ${formatDate(subCategory.updatedAt)}</p>
                            <hr />
                        </div>
                    `).join('') : '<p>No hay subcategorías disponibles.</p>'}
                </div>
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#6C757D',

           
            

        });
    }
    

    const handleSubmitCategory = async (categoryData) => {
        if (PickedCategory) {
            try {
                await api.put(`/categories/${PickedCategory.idCategory}`, categoryData, { withCredentials: true });
                setCategories(categories.map(cat => cat.idCategory === PickedCategory.idCategory ? { ...cat, name: categoryData.name } : cat));

                const subcategoryChangePromise = subCategories.map(subCategory => {
                    if (!categoryData.subCategories.find(sc => sc.idSubCategory === subCategory.idSubCategory)) {
                        return api.delete(`/subcategories/${subCategory.idSubCategory}`, { withCredentials: true });
                    }
                });


                const changePromiseSubcategory = subCategories.map(async (subCategory) => {
                    const existingSubCategory = categoryData.subCategories.find(
                        sc => sc.idSubCategory === subCategory.idSubCategory
                    );
                

                    if (existingSubCategory && existingSubCategory.name !== subCategory.name) {
                        try {
                            await api.put(
                                `/subcategories/${subCategory.idSubCategory}`,
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
                        return api.post(`/subcategories/`, {
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
                const response = await api.post('/categories', categoryData, { withCredentials: true });
                const newCategory = response.data.category; // Obtener la categoría recién creada
                setCategories([...categories, newCategory]);

                const idCategory = newCategory.idCategory; // Recuperar el ID de la nueva categoría

                // Crear promesas para las subcategorías
                const subCategoryPromises = categoryData.subCategories.map(subCategory => {
                    return api.post(`/subcategories/`, {
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

   



    const openDeleteModal = (category) => {
        setPickedCategory(category);
        Swal.fire({
            title: `¿Estás seguro que quieres eliminar la categoría "${category.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#C83F46',
            cancelButtonColor: '#6C757D',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCategory(category); // Asegúrate de que deleteCategory sea una función async
                    Swal.fire(
                        'Eliminado',
                        `La categoría "${category.name}" ha sido eliminada correctamente.`,
                        'success'
                    );
                } catch (error) {
                    Swal.fire('Error', 'Hubo un problema al eliminar la categoría.', 'error');
                }
            }
        });
    };
    

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setPickedCategory(null);
    };

    

    const deleteCategory = async (category) => {
        try {
            await api.delete(`/categories/${category.idCategory}`, { withCredentials: true });
            setCategories(categories.filter(c => c.idCategory !== category.idCategory));
            closeDeleteModal();
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };

    return (
        <>
   
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
                  
              

            {showDeleteModal && (
                <InformationModal
                    text={`¿Estás seguro que quieres eliminar la categoría "${PickedCategory?.name}"?`}
                    onConfirm={() => deleteCategory(PickedCategory)}
                    onCancel={closeDeleteModal}
                    mode={1}
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