import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Rating from './Rating';

function ReviewModal({ review, onClose, onAddReview }) {

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [anonimus, setAnonimus] = useState(false);
    const [idUser, setIdUser] = useState(0);

    useEffect(() => {

        if (review != null) {
            setRating(review.rating);
            setComment(review.comment);
            setAnonimus(review.anonimus);
            setIdUser(review.idUser);
 
        } else {
            setRating(0);
            setComment('');
            setAnonimus(false);
            setIdUser(0);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        var message = '';

        if (rating <= 0 || rating > 5) {
            message = 'Es requerido calificar el platillo';
        }

        if (!message && comment.trim() === '') {
            message = 'Es requerido comentar el platillo';
        }

        if (message) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
            });
        } else {
            onAddReview(review, { idUser, rating, comment, anonimus });
            onClose();
        }
    };

    return (
        <div className='modal-backdrop' style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>

            <div className='modal-content text-white p-4' style={{
                width: '400px',
                borderRadius: '20px',
                backgroundColor: '#000000',
                border: '5px solid #696969'
            }}>

                <div className="section_title text-center">
                    <h2>{review != null ? 'Editar reseña' : 'Añadir reseña'}</h2>
                </div>

                <div className="content-Pane mt-5">

                    <Rating rating={rating} setRating={setRating} />

                    <div class="mb-3">
                        <label for="" class="form-label">Comentario</label>
                        <textarea class="form-control" id="" rows="3" value={comment}
                            onChange={(e) => setComment(e.target.value)}></textarea>
                    </div>

                    <input type="checkbox" id="anonimuscheckBox" name="anonimuscheckBox"
                        checked={anonimus}
                        onChange={(e) => setAnonimus(e.target.checked)} />
                    <label for="anonimuscheckBox" class="form-label">
                        Anónimo
                    </label>

                    <button className="btn btn_primary w-100 mb-2" style={{ backgroundColor: '#34C759', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={handleSubmit}>Guardar</button>
                    <button className="btn btn_primary w-100" style={{ backgroundColor: '#6C757D', color: 'white', fontWeight: 'bold', padding: '10px 13px', fontSize: '17px', whiteSpace: 'nowrap' }} onClick={onClose}>Cerrar</button>
                </div>
            </div>

        </div>


    );
}

export default ReviewModal;



/*
    esto va en el botón de eliminar
    onClick={() => handleDeleteReview(item)}
*/