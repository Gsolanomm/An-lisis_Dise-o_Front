import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';
import ReviewModal from './ReviewModal';
import Rating from './Rating';
import { jwtDecode } from 'jwt-decode';
import CustomerReview from '../MenReview/CustomerReview'; // Asegúrate de importar correctamente

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
        });
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
      });
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
        <h1 style={{ color: 'white' }}>Reseñas</h1>

        <button className="btn btn_primary mt-4" style={{ backgroundColor: '#6C757D', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleOpenReviewModal} >Agregar reseña</button>

        {/* Usar CustomerReview para mostrar las reseñas */}
        <CustomerReview reviewData={reviews.map(r => ({
          image: '', // Proporciona una imagen por defecto o ajusta según tus necesidades
          starCount: r.rating,
          text: r.comment,
          name: r.anonimus ? "Anónimo" : `${r.User.firstName} ${r.User.lastName}`,
          idDish: r.idDish,
          idReview: r.idReview,
          idUser: r.idUser,
          anonimus: r.anonimus
        }))} handleEditReview = {handleEditReview} handleDeleteReview={handleDeleteReview}  />

      </div>

      {showReviewModal && (
        <ReviewModal review={review} onClose={handleCloseReviewModal} onAddReview={handleAddReview} />
      )}
    </div>
  );
}

export default Reviews;
