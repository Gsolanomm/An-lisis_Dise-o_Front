import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../components/Auth/AxiosConfig';
import add from '../../assets/images/add.webp';
import Swal from 'sweetalert2';
import { createCategory } from '../models/Category';
import { createSubCategory } from '../models/SubCategory';

function MenuSection3() {
  const [tabMenu, setTabMenu] = useState({ starters: true, deserts: false });
  const [showForm, setShowForm] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [editingDish, setEditingDish] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const userRole = '1'; // CAMBIAR USUARIO

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubCategories = async (subCategoryId) => {
    try {
      const response = await api.get(`/subcategories/${subCategoryId}`, { withCredentials: true });
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

  const fetchDishes = async (categoryId, page = 1) => {
    try {
      const response = await api.get(`/dish/list?idCategory=${categoryId}&page=${page}&limit=6`);
      setDishes(response.data.dishes || []);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al cargar los platillos:', error);
      Swal.fire('Error', 'No se pudo cargar los platillos.', 'error');
      setDishes([]);
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {


        const response = await api.get('/categories', { withCredentials: true });
        const formattedCategories = response.data.map(cat =>
          createCategory(cat.idCategory, cat.name, cat.createdAt, cat.updatedAt)
        );
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    fetchCategories();
    fetchDishes(currentPage);
  }, [currentPage]);



  const handleAddClick = () => {

    setEditingDish(null); // Limpiar el platillo en edición
    setShowForm(true);

    setTabMenu({ starters: false, deserts: true });
  };

  const handleEditClick = (dish) => {
    setEditingDish(dish); // Guardar el platillo en edición
    setShowForm(true);
    setTabMenu({ starters: false, deserts: true });

    setSelectedCategory(dish.idCategory);
    setSelectedSubCategory(dish.idSubCategory);
    fetchSubCategories(dish.idCategory); // Cargar subcategorías asociadas a esta categoría



  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C54646',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Sí, eliminar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/dish/delete/${id}`);
          setDishes(dishes.filter((dish) => dish.idDish !== id));
          Swal.fire('Eliminado', 'El platillo ha sido eliminado.', 'success');

        } catch (error) {
          console.error('Error al eliminar el platillo:', error);
          Swal.fire('Error', 'No se pudo eliminar el platillo.', 'error');
        }
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    const price = event.target.price.value;
    const image = event.target.image.files[0];
    const creationDate = new Date().toISOString();
    const categoryId = selectedCategory;
    const subCategoryId = selectedSubCategory;

    if (!categoryId || !subCategoryId) {
      Swal.fire('Error', 'Por favor selecciona una categoría y subcategoría.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('creationDate', creationDate);
    formData.append('idCategory', categoryId);
    formData.append('idSubCategory', subCategoryId);
    if (image) formData.append('image', image);

    try {
      if (editingDish) {
        await Swal.fire({
          title: '¿Estás seguro de actualizar?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#C54646',
          cancelButtonColor: 'gray',
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'Cancelar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            await api.put(`/dish/update/${editingDish.idDish}`, formData);
            setDishes(
              dishes.map((dish) =>
                dish.idDish === editingDish.idDish ? { ...dish, name, description, price, categoryId, subCategoryId } : dish
              )
            );
            Swal.fire('Actualizado', 'El platillo/bebida ha sido actualizado correctamente.', 'success');
            setShowForm(false);
            setEditingDish(null);

            setTabMenu({ starters: true, deserts: false });
            fetchDishes(categoryId, currentPage);
          }
        });
      } else {
        const response = await api.post('/dish/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setDishes([...dishes, response.data]);
        Swal.fire('Éxito', 'Platillo agregado correctamente.', 'success');
      }
      event.target.reset();
    } catch (error) {
      console.error('Error al guardar el platillo:', error);
      Swal.fire('Error', 'No se pudo guardar el platillo.', 'error');
    }
  };

  const handleTabClick = (categoryId) => {
    fetchDishes(categoryId);
    setTabMenu({ [categoryId]: true });
    setSelectedCategory(categoryId); // Guarda la categoría seleccionada
    // Filtra y muestra platillos de la categoría seleccionada
    console.log("los platos son", dishes)
    setTabMenu({ starters: true, deserts: false });

  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section className="our_menu_section row_inner_am light_texchur">
      <div className="container">
        <ul className="nav nav-tabs" id="myTab" role="tablist" data-aos="fade-up" data-aos-duration={1500}>
          {categories.map((category) => (
            <li key={category.idCategory} className="nav-item">
              <Link
                className={`nav-link ${tabMenu[category.idCategory] ? 'active' : ''}`}
                onClick={() => handleTabClick(category.idCategory)} // Cambia la pestaña activa
                to={`#${category.idCategory}`}
              >
                {category.name}
              </Link>
            </li>
          ))}

          {userRole === '1' && (
            <li className="nav-item">
              <Link
                className={`nav-link ${tabMenu.deserts ? 'active' : ''}`}
                onClick={handleAddClick}
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                to="#"
              >
                <img src={add} alt="Agregar" style={{ width: '20px', marginRight: '5px' }} />
                Agregar al Menu
              </Link>
            </li>
          )}
        </ul>


        <div className="tab-content" id="myTabContent" data-aos="fade-up" data-aos-duration={1500}>
          <div className={`tab-pane fade ${tabMenu.starters ? 'show active' : ''}`} id="starters" role="tabpanel">
            <div className="container">
              <div className="row">
                {dishes.length === 0 ? (
                  <p className="text-center">No hay platillos/bebidas disponibles, por favor agrega algo nuevo.</p>
                ) : (
                  dishes.map((dish) => (
                    <div key={dish.idDish} className="col-lg-6 col-md-12">
                      <div className="dish_box">
                        <div className="dish_info">
                          <div className="dish_img">
                            <img src={`http://localhost:5000${dish.uriImage}`} alt={dish.name} />
                          </div>
                          <div className="dish_text">
                            <h3>{dish.name}</h3>
                            <p>{dish.description}</p>
                            <span className="price">₡{dish.price}</span>
                            {userRole === '1' && (
                              <div className="dish_actions" style={{ marginTop: '10px' }}>
                                <span
                                  style={{ fontSize: 'small', cursor: 'pointer' }}
                                  onClick={() => handleEditClick(dish)}
                                >
                                  Editar
                                </span>{' '}
                                |{' '}
                                <span
                                  style={{ fontSize: 'small', cursor: 'pointer' }}
                                  onClick={() => handleDeleteClick(dish.idDish)}
                                >
                                  Eliminar
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="pagination">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Anterior
              </button>
              <span>{`Página ${currentPage} de ${totalPages}`}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Siguiente
              </button>
            </div>
          </div>

          {showForm && (
            <div className={`tab-pane fade ${tabMenu.deserts ? 'show active' : ''}`} id="deserts" role="tabpanel">
              <div className="container">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="form-group">
                    <label htmlFor="name">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      defaultValue={editingDish ? editingDish.name : ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                      id="description"
                      className="form-control"
                      defaultValue={editingDish ? editingDish.description : ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Precio</label>
                    <input
                      type="number"
                      id="price"
                      className="form-control"
                      defaultValue={editingDish ? editingDish.price : ''}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Categoría:</label>
                    <select
                      className="form-control"
                      id="category"
                      value={selectedCategory}


                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubCategory('');
                        fetchSubCategories(e.target.value); // Cargar subcategorías
                      }}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((category) => (
                        <option key={category.idCategory} value={category.idCategory}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subcategory">Subcategoría:</label>
                    <select
                      className="form-control"
                      id="subcategory"
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)} // Aquí es donde lo corregimos
                      required
                    >
                      <option value="">Selecciona una subcategoría</option>
                      {subCategories.map((subCategory) => (
                        <option key={subCategory.idSubCategory} value={subCategory.idSubCategory}> {/* Aquí estamos pasando el id de la subcategoría */}
                          {subCategory.name}
                        </option>
                      ))}
                    </select>
                  </div>


                  <div className="form-group">
                    <label htmlFor="image">Imagen</label>

                    {/* Mostrar la imagen actual si existe */}
                    {editingDish && editingDish.uriImage && (
                      <div>
                        <img
                          src={`http://localhost:5000${editingDish.uriImage}`}
                          alt="Imagen del platillo"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <p>Imagen actual</p>
                      </div>
                    )}

                    {/* Campo de selección de archivo (nuevo archivo) */}
                    <input type="file" id="image" className="form-control" />
                  </div>


                  <button type="submit" className="btn btn-primary">
                    {editingDish ? 'Actualizar' : 'Agregar'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MenuSection3;
