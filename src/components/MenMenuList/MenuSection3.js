import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../components/Auth/AxiosConfig';
import Swal from 'sweetalert2';
import { createCategory } from '../models/Category';

function MenuSection3() {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [editingDish, setEditingDish] = useState(null); 
  const userRole = "1"; // CAMBIAR USUARIO

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await api.get('/auth/verify-role', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setIsAdmin(response.data.role === 'administrador');
      } catch (error) {
        console.error('Error al verificar el rol del usuario:', error);
        Swal.fire('Error', 'No se pudo verificar el rol del usuario.', 'error');
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories', { withCredentials: true });
        const formattedCategories = response.data.map(cat =>
          createCategory(cat.idCategory, cat.name, cat.createdAt, cat.updatedAt)
        );
        setCategories(formattedCategories);
        if (formattedCategories.length > 0) {
          setActiveCategoryId(formattedCategories[0].idCategory);
        }
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategoryId) {
      fetchDishes(activeCategoryId, currentPage);
    }
  }, [activeCategoryId, currentPage]);

  const fetchDishes = async (categoryId, page = 1) => {
    try {
      const response = await api.get(`/dish/list?idCategory=${categoryId}&page=${page}&limit=6`);
      setDishes(response.data.dishes || []);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages); 
    } catch (error) {
      console.error('Error al cargar los platillos:', error);
      Swal.fire('Error', 'No se pudo cargar los platillos.', 'error');
    }
  };

  useEffect(() => {
    fetchDishes(currentPage); 
  }, [currentPage]);


  useEffect(() => {
    fetchDishes();
  }, []);

  const handleAddClick = () => {
    setEditingDish(null); // Limpiar el platillo en edición
    setShowForm(true);
    setTabMenu({ starters: false, deserts: true });
  };

  const handleEditClick = (dish) => {
    setEditingDish(dish); // Guardar el platillo en edición
    setShowForm(true);
    setTabMenu({ starters: false, deserts: true });
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C54646',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/menu/delete/${id}`);
          setDishes(dishes.filter(dish => dish.idMenu !== id));
          Swal.fire('Eliminado', 'El platillo ha sido eliminado.', 'success');
        } catch (error) {
          console.error("Error al eliminar el platillo:", error);
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

    if (!image && !editingDish) {
      Swal.fire('Error', 'Por favor, selecciona una imagen.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('creationDate', creationDate);
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
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await api.put(`/menu/update/${editingDish.idMenu}`, formData);
            setDishes(dishes.map(dish => dish.idMenu === editingDish.idMenu ? { ...dish, name, description, price } : dish));
            Swal.fire('Actualizado', 'El platillo/bebida ha sido actualizado correctamente.', 'success');
            setShowForm(false);
            setEditingDish(null);
            setTabMenu({ starters: true, deserts: false });
            fetchDishes(); 
          }
        });
      } else {
        const response = await api.post('/menu/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setDishes([...dishes, response.data]);
        Swal.fire('Éxito', 'Platillo agregado correctamente.', 'success');
      }
      event.target.reset();
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el platillo.', 'error');
      console.error('Error al eliminar el platillo:', error);
    }
  };



  const handleTabClick = (tab) => {
    setTabMenu({
      starters: tab === 'starters',
      deserts: tab === 'deserts',
    });
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
                className={`nav-link ${activeCategoryId === category.idCategory ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.idCategory)}
                to={`#${category.idCategory}`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="tab-content" id="myTabContent" data-aos="fade-up" data-aos-duration={1500}>
          {categories.map((category) => (
            <div
              key={category.idCategory}
              className={`tab-pane fade ${activeCategoryId === category.idCategory ? 'show active' : ''}`}
              id={category.idCategory}
              role="tabpanel"
            >
              <div className="container">
                <div className="row">
                  {dishes.length === 0 ? (
                    <p className="text-center">No hay platillos disponibles, por favor agrega algo nuevo.</p>
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

                              {isAdmin && (
                                <div className="dish_actions">
                                  <button
                                    className="btn btn-edit"
                                    style={{ color: 'red' }}
                                    onClick={() => handleEditClick(dish)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="btn btn-delete"
                                    style={{ color: 'red' }}
                                    onClick={() => handleDeleteClick(dish.idDish)}
                                  >
                                    Eliminar
                                  </button>
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
            </div>
          </div>

          <div className={`tab-pane fade ${tabMenu.deserts ? "show active" : ""}`} id="deserts" role="tabpanel">
            <div className="container">
              <div className="row justify-content-center">
                {showForm && (
                  <form
                    className="add-dish-form"
                    style={{ marginTop: "20px", maxWidth: "500px", width: "100%" }}
                    onSubmit={handleSubmit}
                  >
                    <div className="form-group">
                      <label htmlFor="name">Nombre:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Nombre del plato"
                        defaultValue={editingDish?.name || ""}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Descripción:</label>
                      <textarea
                        className="form-control"
                        id="description"
                        placeholder="Descripción del plato"
                        defaultValue={editingDish?.description || ""}
                        required
                        style={{ height: "100px" }}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="price">Precio:</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        placeholder="Precio en ₡"
                        defaultValue={editingDish?.price || ""}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="image">Imagen:</label>
                      <input
                        type="file"
                        className="form-control-file"
                        id="image"
                        accept="image/*"
                      />
                    </div>
                    <button type="submit" className="btn btn_primary">
                      {editingDish ? "Actualizar Platillo" : "Agregar Platillo"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}

export default MenuSection3;
