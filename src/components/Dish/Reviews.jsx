import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';
import ReviewModal from './ReviewModal';
import Rating from './Rating';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function Reviews() {
    const { idDish } = useParams();

    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [activeUserId, setActiveUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        
        const user = jwtDecode(token);
        setActiveUserId(user.idUser);
        loadReviews();
    }, []);

    const loadReviews = () => {
        api.get(`/reviews/${idDish}`, { withCredentials: true })
            .then(response => {
                setReviews(response.data || []);
            })
            .catch(error => {
                console.error("Error al cargar reviews:", error);
            });
    };

    const handleOpenReviewModal = () => {
        setShowReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setReview(null);
    };

    const handleAddReview = (oldReview, selectedReview) => {
        if (oldReview == null) {
            selectedReview.idUser = activeUserId;
            selectedReview.idDish = idDish;
            api.post(`/reviews`, selectedReview, { withCredentials: true })
                .then(() => {
                    loadReviews();
                })
                .catch((obj) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: obj.response.data.error,
                    });
                })
        } else {
            api.put(`/reviews/${oldReview.idReview}`, selectedReview, { withCredentials: true })
                .then(() => {
                    loadReviews();
                }
            );
        }
    };

    const handleEditReview = (selectedReview) => {
        setReview(selectedReview);
        setShowReviewModal(true);
    };

    const handleDeleteReview = (selectedReview) => {
        api.delete(`/reviews/${selectedReview.idReview}`, { withCredentials: true })
            .then(() => {
                loadReviews();
            }
        );
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className='container mt-5'>
            <div className="content-Pane mt-5">
                <h1 style={{ color: 'white' }}>Resenas</h1>

                <button className="btn btn_primary mt-4" style={{ backgroundColor: '#6C757D', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleOpenReviewModal} >Agregar reseña</button>

                <div className="reviews-list mt-3">
                    {reviews.map((item, index) => (
                        <div key={index} className="review-item mb-3 p-3" style={{ backgroundColor: '#333', borderRadius: '8px' }}>
                            
                            <Rating rating={item.rating} readOnly={true} />

                            <p style={{ color: 'white' }}>{item.comment}</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4>- {item.anonimus ? "Anónimo" : `${item.User.firstName} ${item.User.lastName}`}</h4>
                                <span style={{ fontSize: '0.9em', color: '#AAAAAA' }}>{formatDate(item.updatedAt)}</span>
                            </div>

                            {item.idUser == activeUserId && (
                                <button className="btn btn_primary mt-4" style={{ backgroundColor: '#6C757D', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={() => handleEditReview(item)} >Editar</button>
                            )}

                            {item.idUser == activeUserId && (
                                <button className="btn btn_primary mt-4" style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={() => handleDeleteReview(item)} >Eliminar</button>
                            )}
                            
                        </div>
                    ))}
                </div>

            </div>

            {showReviewModal && (
                <ReviewModal review={review} onClose={handleCloseReviewModal} onAddReview={handleAddReview} />
            )}
        </div>
    );
}

export default Reviews;

/* 

{console.log('usuario activo: '+activeUserId)}
{item.idUser === activeUserId && (
    <div>
        <button className="btn btn_primary" style={{ backgroundColor: '#34C759', color: 'white', fontWeight: 'bold', marginRight: '10px' }} onClick={() => handleEditReview(item)}>Editar</button>
        <button className="btn btn_primary" style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold' }} onClick={() => handleDeleteReview(item)}>Eliminar</button>
    </div>
)}


<div className="content-Pane mt-5">
    <h1 style={{ color: 'white' }}>Reseñas</h1>

    <button className="btn btn_primary mt-4" style={{ backgroundColor: '#6C757D', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleOpenReviewModal} >Agregar reseña</button>

    <div className="reviews-list mt-3">
        {reviews.map((item, index) => (
            <div key={index} className="review-item mb-3 p-3" style={{ backgroundColor: '#333', borderRadius: '8px' }}>
                <h5 style={{ color: 'lightgray' }}>{usersMap[item.idUser] || 'Usuario desconocido'}</h5>
                <p style={{ color: 'white' }}>{item.comment}</p>
                <p style={{ color: 'yellow' }}>Rating: {item.rating}</p>

                {item.idUser === activeUserId && (
                    <div>
                        <button className="btn btn_primary" style={{ backgroundColor: '#34C759', color: 'white', fontWeight: 'bold', marginRight: '10px' }} onClick={() => handleEditReview(item)}>Editar</button>
                        <button className="btn btn_primary" style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold' }} onClick={() => handleDeleteReview(item)}>Eliminar</button>
                    </div>
                )}
            </div>
        ))}
    </div>
</div>

*/