import React, { useState, useEffect } from 'react';
import api from '../../components/Auth/AxiosConfig';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function NoticeSection() {
    const [news, setNews] = useState([]);
    const [newArticle, setNewArticle] = useState({
        title: '',
        description: '',
        image: '',
        startDate: '',
        endDate: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/notices');
            setNews(response.data);
        } catch (error) {
            console.error('Error al cargar noticias:', error);
        }
    };

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
            setNewArticle((prev) => ({ ...prev, image: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newArticle.title);
            formData.append('description', newArticle.description);
            if (newArticle.image) formData.append('image', newArticle.image);
            formData.append('startDate', newArticle.startDate);
            formData.append('endDate', newArticle.endDate);

            if (isEditing) {
                await api.put(`/notices/${editingId}`, formData);
                Swal.fire('Éxito', 'Noticia actualizada con éxito', 'success');
                setIsEditing(false);
                setEditingId(null);
            } else {
                await api.post('/notices', formData);
                Swal.fire('Éxito', 'Noticia agregada con éxito', 'success');
            }

            setNewArticle({
                title: '',
                description: '',
                image: '',
                startDate: '',
                endDate: ''
            });

            fetchNotices();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Error al procesar la noticia', 'error');
        }
    };

    const handleEdit = (id) => {
        const articleToEdit = news.find(article => article.id === id);
        setNewArticle({
            title: articleToEdit.title,
            description: articleToEdit.description,
            image: articleToEdit.image,
            startDate: articleToEdit.startDate,
            endDate: articleToEdit.endDate
        });
        setIsEditing(true);
        setEditingId(id);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/notices/${id}`);
            Swal.fire('Eliminado', 'Noticia eliminada con éxito', 'success');
            fetchNotices();
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar la noticia', 'error');
        }
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Sección de Noticias</h2>

            <div className="add_news_form mb-4 p-3 border rounded shadow-sm">
                <h3 className="text-center mb-3">{isEditing ? 'Editar Noticia' : 'Agregar una Nueva Noticia'}</h3>
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
                                required={!isEditing}
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
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? 'Actualizar Noticia' : 'Agregar Noticia'}
                    </button>
                </form>
            </div>

            <div id="newsCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {news.map((article, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={article.id}>
                            <div className="row">
                                <div className="col-md-6">
                                    <img 
                                        src={article.image} 
                                        alt={article.title} 
                                        className="d-block w-100" 
                                    />
                                </div>
                                <div className="col-md-6 text-white">
                                    <h5 className="text-white">{article.title}</h5>
                                    <p className="text-white">{article.description}</p>
                                    <p className="text-white">
                                        <strong>Inicio:</strong> {article.startDate} <br />
                                        <strong>Fin:</strong> {article.endDate}
                                    </p>
                                    <button 
                                        className="btn btn-warning mr-2"
                                        onClick={() => handleEdit(article.id)}
                                    >Editar</button>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(article.id)}
                                    >Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#newsCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#newsCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default NoticeSection;
