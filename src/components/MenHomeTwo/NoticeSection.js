import React, { useState, useEffect, useRef } from 'react';
import api from '../../components/Auth/AxiosConfig';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function NoticeSection() {
    const [news, setNews] = useState([]);
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
    const baseURL = "http://localhost:5000";
    const fileInputRef = useRef(null);
    useEffect(() => {
        fetchNotices();
    
        fetchUserRole();
        
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/notices');
            setNews(response.data || []);
            console.log(response.data);
            
        } catch (error) {
            console.error('Error al cargar noticias:', error);
            Swal.fire('Error', 'No se pudieron cargar las noticias.', 'error');
        }
        console.log("Noticias son: ", news.title);
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "startDate") {
            const today = new Date().toISOString().split("T")[0];
            if (value < today) {
                Swal.fire("Error", "La fecha de inicio no puede ser en el pasado.", "error");
                return;
            }
            if (newNotice.endDate && value > newNotice.endDate) {
                Swal.fire("Error", "La fecha de inicio no puede ser posterior a la fecha de fin.", "error");
                return;
            }
        }

        if (name === "endDate") {
            if (newNotice.startDate && value < newNotice.startDate) {
                Swal.fire("Error", "La fecha de fin no puede ser anterior a la fecha de inicio.", "error");
                return;
            }
        }

        setNewNotice((prevNotice) => ({
            ...prevNotice,
            [name]: value,
        }));
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewNotice((prev) => ({ ...prev, image: file }));
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
                fileInputRef.current.value = ""; // Restablecer el input de archivo
            }

            fetchNotices(); // Actualizar la lista de noticias después de agregar o actualizar
        } catch (error) {
            console.error('Error al procesar la noticia:', error);
            Swal.fire('Error', 'Error al procesar la noticia', 'error');
        }
    };

    const handleEdit = (id) => {
        const noticeToEdit = news.find(notice => notice.idNotice === id);
        if (!noticeToEdit) {
            Swal.fire('Error', 'Noticia no encontrada.', 'error');
            return;
        }
        setNewNotice({
            title: noticeToEdit.title,
            description: noticeToEdit.description,
            image: null,
            startDate: noticeToEdit.startDate.split('T')[0], // Formato YYYY-MM-DD
            endDate: noticeToEdit.endDate.split('T')[0]      // Formato YYYY-MM-DD
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

    const today = new Date().toISOString().split("T")[0];

    // Función para formatear la fecha
    const formatDate = (date) => {
        const [year, month, day] = date.split('T')[0].split('-');
        return `${day}-${month}-${year}`;
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
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Título"
                    value={newNotice.title}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                                onChange={handleImageChange}
                                ref={fileInputRef} // Asociar la referencia al input
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
                        onChange={handleChange}
                        required
                        min={today}
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
                        onChange={handleChange}
                        required
                        min={newNotice.startDate || today}
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
        <div ref={carouselRef} id="newsCarousel" className="carousel slide">
            <div className="carousel-inner">
                {news.map((notice, index) => (
                    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={notice.idNotice}>
                        <div className="row justify-content-center">
                            <div className="dish_img ">
                                <img 
                                    src={`${baseURL}${notice.urlImage}`}
                                   
                                    className="d-block" 
                                />
                            </div>

                           

                            <div className="col-md-4 text-center text-white">
                                <h4>{notice.title}</h4>
                                <p>{notice.description}</p>
                            </div>

                            {
                                isAdmin && (  


                                <div className="col-md-4 text-center">
                                    <p><strong>Fecha inicio:</strong> {formatDate(notice.startDate)}</p>
                                    <p><strong>Fecha fin:</strong> {formatDate(notice.endDate)}</p>
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
