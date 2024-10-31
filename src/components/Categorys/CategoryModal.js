import React, { useState, useEffect } from 'react';
import InformationModal from './InformationModal';

function CategoryModal({ isOpen, onClose, onSubmit, category, subCategories }) {
    const [name, setName] = useState('');
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [subCategoryName, setSubCategoryName] = useState('');
    const [showEditSubCategoryModal, setShowEditSubCategoryModal] = useState(false);
    const [PickedSubCategory, setPickedSubCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [subCategoryToDeleteIndex, setSubCategoryToDeleteIndex] = useState(null);
 
    useEffect(() => {
        if (category) {
            setName(category.name);
            setSelectedSubCategories(subCategories);

            console.log(subCategories);
            
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
        setSubCategoryToDeleteIndex(index); // Guardar el índice de la subcategoría
        setShowDeleteModal(true); // Mostrar el modal
    };

    const confirmDeleteSubCategory = () => {
        if (subCategoryToDeleteIndex !== null) {
            setSelectedSubCategories(selectedSubCategories.filter((_, i) => i !== subCategoryToDeleteIndex));
        }
        closeDeleteModal(); // Cerrar el modal después de eliminar
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSubCategoryToDeleteIndex(null); // Reiniciar el índice
    };

    const handleEditSubCategory = (subCategory) => {
        setPickedSubCategory(subCategory);
        setShowEditSubCategoryModal(true);
        console.log(subCategory.idSubCategory);
        console.log(subCategory.name);
       
    };

    const handleConfirmEditSubCategory = (newName) => {
        setSelectedSubCategories(selectedSubCategories.map(subCat => subCat.idSubCategory === PickedSubCategory.idSubCategory ? { ...subCat, name: newName } : subCat));
        setShowEditSubCategoryModal(false);
        setPickedSubCategory(null);
    };

    const handleSubmit = () => {
        const categoryData = { name, subCategories: selectedSubCategories };


if(categoryData.name.trim() === ''){
    setShowDetailModal(true);

}else{

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
                }} onClick={() => handleEditSubCategory(subCategory, index)}>
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
                            <button className="btn btn-secondary w-100" onClick={onClose}>Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>

            {showEditSubCategoryModal && (
                <InformationModal
                    text={`Cambiar nombre de la subcategoría "${PickedSubCategory?.name}"`}
                    onConfirm={handleConfirmEditSubCategory}
                    onCancel={() => setShowEditSubCategoryModal(false)}
                    mode={3}
                    initialValue={PickedSubCategory?.name}
                />
            )}

{showDetailModal && (
    <InformationModal
        text="Nombre de categoría inválido"
        onCancel={() => setShowDetailModal(false)}
        mode={2}
    />
)}


{showDeleteModal && (
    <InformationModal
        text={`¿Estás seguro que quieres eliminar la subcategoría "${selectedSubCategories[subCategoryToDeleteIndex]?.name}"?`}
        onConfirm={confirmDeleteSubCategory}
        onCancel={closeDeleteModal}
        mode={1}
    />
)}


        </div>
    );
}

export default CategoryModal;