import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import api from '../../components/Auth/AxiosConfig'; // Ruta corregida
import Bloglist from '../MenBlogList/BlogList'; // Ruta corregida
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function NoticeSection() {
    const [news, setNews] = useState([]);
    const nameInputRef = useRef(null);
    const [newNotice, setNewNotice] = useState({
        title: '',
        description: '',
        image: null,
        startDate: '',
        endDate: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const carouselRef = useRef(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchNotices();
        fetchUserRole();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/notices');
            setNews(response.data || []);
        } catch (error) {
            console.error('Error al cargar noticias:', error);
            Swal.fire('Error', 'No se pudieron cargar las noticias.', 'error');
        }
    };

    const fetchUserRole = async () => {
        try {
            const response = await api.get('/auth/verify-role', {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            setIsAdmin(response.data.role === 'administrador');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error al verificar el rol del usuario.', 'error');
        }
    };

    const handleEdit = (id) => {

        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }

        const noticeToEdit = news.find(notice => notice.idNotice === id);
        if (!noticeToEdit) {
            Swal.fire('Error', 'Noticia no encontrada.', 'error');
            return;
        }
        setNewNotice({
            title: noticeToEdit.title,
            description: noticeToEdit.description,
            image: null,
            startDate: noticeToEdit.startDate.split('T')[0],
            endDate: noticeToEdit.endDate.split('T')[0]
        });
        setIsEditing(true);
        setEditingId(id);
    };

    const handleDelete = async (id) => {
        const confirmResult = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmResult.isConfirmed) {
            try {
                await api.delete(`/notices/${id}`);
                Swal.fire('Eliminado', 'Noticia eliminada con éxito', 'success');
                setNews((prevNews) => prevNews.filter((notice) => notice.idNotice !== id));
            } catch (error) {
                console.error('Error al eliminar la noticia:', error);
                Swal.fire('Error', 'No se pudo eliminar la noticia', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newNotice.title);
            formData.append('description', newNotice.description);
            formData.append('startDate', newNotice.startDate);
            formData.append('endDate', newNotice.endDate);

            if (newNotice.image) {
                formData.append('image', newNotice.image);
            }

            if (isEditing) {
                await api.put(`/notices/${editingId}`, formData);
                Swal.fire('Éxito', 'Noticia actualizada con éxito', 'success');
                setIsEditing(false);
                setEditingId(null);
            } else {
                await api.post('/notices', formData);
                Swal.fire('Éxito', 'Noticia agregada con éxito', 'success');
            }

            setNewNotice({
                title: '',
                description: '',
                image: null,
                startDate: '',
                endDate: ''
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            fetchNotices();
        } catch (error) {
            console.error('Error al procesar la noticia:', error);
            Swal.fire('Error', 'Error al procesar la noticia', 'error');
        }
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4 text-white">Sección de Noticias</h2>

            {isAdmin && (
                <div className="add_news_form mb-4 p-3 border rounded shadow-sm">
                    <h3 className="text-center mb-3 text-white">{isEditing ? 'Editar Noticia' : 'Agregar una Nueva Noticia'}</h3>
                    <form onSubmit={handleSubmit} className='text-center'>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label text-white">Título de la noticia</label>
                            <input
                             ref={nameInputRef}
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                placeholder="Título"
                                value={newNotice.title}
                                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label text-white">Descripción de la noticia</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                placeholder="Descripción"
                                value={newNotice.description}
                                onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="image" className="form-label text-white">Imagen de la noticia</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(e) => setNewNotice({ ...newNotice, image: e.target.files[0] })}
                                    ref={fileInputRef}
                                    required={!isEditing}
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="startDate" className="form-label text-white">Fecha de inicio</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    className="form-control"
                                    value={newNotice.startDate}
                                    onChange={(e) => setNewNotice({ ...newNotice, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="endDate" className="form-label text-white">Fecha de fin</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    className="form-control"
                                    value={newNotice.endDate}
                                    onChange={(e) => setNewNotice({ ...newNotice, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Actualizar Noticia' : 'Agregar Noticia'}
                        </button>
                    </form>
                </div>
            )}

            {news.length > 0 ? (
                <div id="newsCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {news.map((notice, index) => (
                            <div key={notice.idNotice} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-8">
                                        <Bloglist
                                            tittle={notice.title}
                                            description={notice.description}
                                            creationDate={notice.startDate}
                                            image={notice.urlImage}
                                        />
                                        {isAdmin && (
                                            <div className="text-center mt-2">
                                                <button
                                                    className="btn btn-primary me-2"
                                                    onClick={() => handleEdit(notice.idNotice)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(notice.idNotice)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
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
            ) : (
                <p className="text-white text-center">No hay noticias disponibles.</p>
            )}
        </div>
    );
}

export default NoticeSection;