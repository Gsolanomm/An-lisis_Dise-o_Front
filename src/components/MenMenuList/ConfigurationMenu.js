import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../components/Auth/AxiosConfig';
import Swal from 'sweetalert2';
import './ConfigurationMenu.css';

function ConfigurationMenu() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [editingDish, setEditingDish] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { dish } = location.state || {};

  useEffect(() => {
    fetchCategories();
    if (dish) {
      setEditingDish(dish);
      setSelectedCategory(dish.idCategory);
      setSelectedSubCategory(dish.idSubCategory);
    }
  }, [dish]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await api.get(`/subcategories/${categoryId}`, { withCredentials: true });
      setSubCategories(response.data);
    } catch (error) {
      console.error('Error al obtener subcategorías:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    const price = event.target.price.value;
    const image = event.target.image.files[0];

    if (!selectedCategory || !selectedSubCategory) {
      Swal.fire('Error', 'Por favor selecciona una categoría y subcategoría.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('idCategory', selectedCategory);
    formData.append('idSubCategory', selectedSubCategory);
    if (image) formData.append('image', image);

    try {
      if (editingDish) {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: "¿Deseas actualizar este platillo?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
          await api.put(`/dish/update/${editingDish.idDish}`, formData);
          Swal.fire('Éxito', 'Platillo actualizado correctamente.', 'success');
          setEditingDish(null);
          navigate('/menu');
        }
      } else {
        await api.post('/dish/add', formData);
        Swal.fire('Éxito', 'Platillo agregado correctamente.', 'success');
        setSelectedCategory('');
        setSelectedSubCategory('');
        event.target.reset();
      }
    } catch (error) {
      console.error('Error al guardar el platillo:', error);
      Swal.fire('Error', 'No se pudo guardar el platillo.', 'error');
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <section className="configuration_menu_section">
      <form onSubmit={handleSubmit} className="centered-form">
        <div className="left-column">
           <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Ingresa el nombre del platillo"
              defaultValue={editingDish ? editingDish.name : ''}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Ingresa la descripción del platillo"
              defaultValue={editingDish ? editingDish.description : ''}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              className="form-control"
              placeholder="Ingresa el precio del platillo"
              defaultValue={editingDish ? editingDish.price : ''}
              required
            />
          </div>

          <div className="categories-container">
            <div className="form-group">
              <label htmlFor="category">Categoría</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory('');
                }}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.idCategory} value={category.idCategory}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subcategory">Subcategoría</label>
              <select
                id="subcategory"
                name="subcategory"
                className="form-control"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
              >
                <option value="">Seleccionar subcategoría</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.idSubCategory} value={subCategory.idSubCategory}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="form-group">
            <label htmlFor="image">Imagen</label>
            <input type="file" id="image" name="image" className="form-control" onChange={handleImageChange} />
          </div>
          {imagePreview && <img src={imagePreview} alt="Vista previa" className="image-preview" />}
        </div>

        <button type="submit" className="btn btn-primary">
          {editingDish ? 'Guardar' : 'Guardar'}
        </button>
      </form>
    </section>
  );
}

export default ConfigurationMenu;