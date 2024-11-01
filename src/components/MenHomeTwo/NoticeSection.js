import React, { useState, useEffect } from 'react';
import api from '../../components/Auth/AxiosConfig'; // Importa la configuración de Axios
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function NoticeSection() {
    const [news, setNews] = useState([]);
    const [newArticle, setNewArticle] = useState({
        title: '',
        description: '',
        image: '',
        startDate: '',
        endDate: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await api.get('/notices');
                setNews(response.data);
            } catch (error) {
                console.error('Error al cargar noticias:', error);
            }
        };

        fetchNotices();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewArticle((prevArticle) => ({
            ...prevArticle,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewArticle((prev) => ({ ...prev, image: file })); // Guardar archivo
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newArticle.title);
            formData.append('description', newArticle.description);
            formData.append('image', newArticle.image);
            formData.append('startDate', newArticle.startDate);
            formData.append('endDate', newArticle.endDate);

            await api.post('/notices', formData);
            Swal.fire('Éxito', 'Noticia agregada con éxito', 'success');

            // Restablecer el formulario
            setNewArticle({
                title: '',
                description: '',
                image: '',
                startDate: '',
                endDate: ''
            });

            // Actualizar la lista de noticias
            const updatedNews = await api.get('/notices');
            setNews(updatedNews.data); // Asumiendo que la respuesta tiene un array de noticias

            navigate('/'); // Redirigir a la página principal si es necesario
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Error al agregar la noticia', 'error');
        }
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Sección de Noticias</h2>

            {/* Formulario para agregar noticias */}
            <div className="add_news_form mb-4 p-3 border rounded shadow-sm">
                <h3 className="text-center mb-3">Agregar una Nueva Noticia</h3>
                <form onSubmit={handleSubmit} className='text-center'>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="Título"
                            value={newArticle.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            name="description"
                            className="form-control"
                            placeholder="Descripción"
                            value={newArticle.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="form-control"
                                onChange={handleImageChange}
                                required
                            />
                        </div>
                        <div className="col-3">
                            <input
                                type="date"
                                name="startDate"
                                className="form-control"
                                value={newArticle.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-3">
                            <input
                                type="date"
                                name="endDate"
                                className="form-control"
                                value={newArticle.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn_primary">
                      Agregar Noticia
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NoticeSection;
