import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';
import ReviewModal from './ReviewModal';

function Reviews() {

    const { idUser } = useParams();
    const { idDish } = useParams();

    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState(null);

    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        loadReviews();
    }, []);

    function loadReviews() {
        api.get(`/reviews/${idDish}`, { withCredentials: true })
            .then(function (response) {
                var data = response.data;
                console.log(data);
                if (data === null || data === undefined) {
                    setReview(null);
                } else {
                    setReviews(data);
                }
            })
    }

    const handleOpenReviewModal = () => {
        setShowReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setReview(null);
    };

    const handleAddReview = (oldReview, selectedReview) => {
        if (oldReview == null) {
            selectedReview.idDish = idDish;
            api.post(`/reviews`, selectedReview, { withCredentials: true })
                .then(function () {
                    loadReviews();
                })
        } else {
            api.put(`/reviews/${oldReview.idReview}`, selectedReview, { withCredentials: true })
                .then(function () {
                    loadReviews();
                })
        }
    }

    const handleEditReview = (selectedReview) => {
        setReview(selectedReview);
        setShowReviewModal(true);
    }

    const handleDeleteReview = (selectedReview) => {
        api.delete(`/reviews/${selectedReview.idReview}`, { withCredentials: true })
            .then(function () {
                loadReviews();
            })
    }

    return (
        <div className='container mt-5'>
            <div className="content-Pane mt-5">
                <h1 style={{ color: 'white' }}>Resenas</h1>

                <button className="btn btn_primary mt-4" style={{ backgroundColor: '#6C757D', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleOpenReviewModal} >Agregar resena</button>

                <table className="table table-borderless text-white mt-3">
                    <thead>
                        <tr>
                            <th>Rating</th>
                            <th>Comentario</th>
                            <th>Anónimo</th>
                            <th>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((item, index) => (
                            <tr key={index}>
                                <td>{item.rating}</td>
                                <td>{item.comment}</td>
                                <td>{item.anonimus ? "Si" : "No"}</td>
                                <td>
                                    <button className="btn btn_primary mt-4" style={{ backgroundColor: '#34C759', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={() => handleEditReview(item)}>Editar</button>
                                    <button className="btn btn_primary mt-4" style={{ backgroundColor: '#C83F46', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={() => handleDeleteReview(item)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {showReviewModal && (
                <ReviewModal review={review} onClose={handleCloseReviewModal} onAddReview={handleAddReview} />
            )}
        </div>
    );
}

export default Reviews;