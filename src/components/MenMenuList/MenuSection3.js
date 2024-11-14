import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../components/Auth/AxiosConfig';
import Swal from 'sweetalert2';
import { createCategory } from '../models/Category';

function MenuSection3() {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
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
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error al cargar los platillos:', error);
      Swal.fire('Error', 'No se pudo cargar los platillos.', 'error');
      setDishes([]);
      setTotalPages(1);
    }
  };

  const handleDeleteClick = async (dishId) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Este platillo será eliminado!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const response = await api.delete(`/dish/delete/${dishId}`);
        if (response.status === 200) {
          Swal.fire('Eliminado', 'El platillo ha sido eliminado.', 'success');
          fetchDishes(activeCategoryId, currentPage);
        }
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el platillo.', 'error');
      console.error('Error al eliminar el platillo:', error);
    }
  };

  const handleEditClick = (dish) => {
    navigate('/configurationmenu', { state: { dish } });
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategoryId(categoryId);
    setCurrentPage(1);
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

                              <div className="dish_buttons">
                                <button className="btn btn-edit" style={{ color: '#87ceeb' }}>Receta</button>
                                <button className="btn btn-edit" style={{ color: '#87ceeb' }}>Review</button>
                              </div>

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
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente</button>
        </div>
      </div>
    </section>
  );
}

export default MenuSection3;
