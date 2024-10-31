import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../components/Auth/AxiosConfig';
import add from '../../assets/images/add.webp';
import Swal from 'sweetalert2';

function MenuSection3() {
  const [tabMenu, setTabMenu] = useState({ starters: true, deserts: false });
  const [showForm, setShowForm] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [editingDish, setEditingDish] = useState(null); // Estado para el platillo en edición
  const userRole = "1"; // CAMBIAR USUARIO

  const fetchDishes = async () => {
    try {
      const response = await api.get('/menu/list');
      setDishes(response.data);
    } catch (error) {
      console.error("Error al cargar los platillos:", error);
      Swal.fire('Error', 'No se pudo cargar los platillos.', 'error');
    }
  };

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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
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
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await api.put(`/menu/update/${editingDish.idMenu}`, formData);
            setDishes(dishes.map(dish => dish.idMenu === editingDish.idMenu ? { ...dish, name, description, price } : dish));
            Swal.fire('Actualizado', 'El platillo ha sido actualizado correctamente.', 'success');
            setShowForm(false); // Ocultar el formulario
            setEditingDish(null); // Limpiar el platillo en edición
            setTabMenu({ starters: true, deserts: false }); // Regresar a la pestaña del menú
            fetchDishes(); // Volver a cargar los platillos para asegurar que el menú se muestre actualizado
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
      console.error("Error al guardar el platillo:", error);
      Swal.fire('Error', 'No se pudo guardar el platillo.', 'error');
    }
  };
  
  

  const handleTabClick = (tab) => {
    setTabMenu({
      starters: tab === 'starters',
      deserts: tab === 'deserts',
    });
  };

  return (
    <section className="our_menu_section row_inner_am light_texchur">
      <div className="container">
        <ul className="nav nav-tabs" id="myTab" role="tablist" data-aos="fade-up" data-aos-duration={1500}>
          <li className="nav-item">
            <Link
              className={`nav-link ${tabMenu.starters ? "active" : ""}`}
              onClick={() => handleTabClick('starters')}
              to="#starters"
            >
              Arroz
            </Link>
          </li>
          {userRole === "1" && (
            <li className="nav-item">
              <Link
                className={`nav-link ${tabMenu.deserts ? "active" : ""}`}
                onClick={handleAddClick}
                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                to="#"
              >
                <img src={add} alt="Agregar" style={{ width: "20px", marginRight: "5px" }} />
                Agregar al Menu
              </Link>
            </li>
          )}
        </ul>

        <div className="tab-content" id="myTabContent" data-aos="fade-up" data-aos-duration={1500}>
          <div className={`tab-pane fade ${tabMenu.starters ? "show active" : ""}`} id="starters" role="tabpanel">
            <div className="container">
              <div className="row">
                {dishes.map(dish => (
                  <div key={dish.idMenu} className="col-lg-6 col-md-12">
                    <div className="dish_box">
                      <div className="dish_info">
                        <div className="dish_img">
                          <img src={`http://localhost:5000${dish.imageUrl}`} alt={dish.name} />
                        </div>
                        <div className="dish_text">
                          <h3>{dish.name}</h3>
                          <p>{dish.description}</p>
                          <span className="price">₡{dish.price}</span>
                          {userRole === "1" && (
                            <div className="dish_actions" style={{ marginTop: '10px' }}>
                              <span
                                style={{ fontSize: 'small', cursor: 'pointer', marginRight: '10px', color: 'coral' }}
                                onClick={() => handleEditClick(dish)}
                              >
                                Actualizar
                              </span>
                              <span
                                style={{ fontSize: 'small', cursor: 'pointer', color: 'tomato' }}
                                onClick={() => handleDeleteClick(dish.idMenu)}
                              >
                                Eliminar
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link to="#" className="btn btn_primary">Más</Link>
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
    </section>
  );
}

export default MenuSection3;