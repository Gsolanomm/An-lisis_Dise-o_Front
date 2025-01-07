import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Ejemplo con react-icons
import Review01 from '../../assets/images/review_01.png';

function CustomerReview({ reviewData, handleEditReview, handleDeleteReview }) {
  return (
    <section className="row_am coustomer_review_section">
      <div className="container">
        <div className="coustomer_inner">
          {reviewData.map((review, index) => (
            <div key={index} className="review_box with_text" data-aos="fade-up" data-aos-duration={1500}>
              <span className="quotes left_quote">
                <i className="icofont-quote-left" />
              </span>
              <div className="user_img">
                <img src={Review01} alt="img" />
              </div>
              <div className="review">
                <div className="star">
                  {Array.from({ length: review.starCount }, (_, starIndex) => (
                    <span key={starIndex}>
                      <i className="icofont-star" />
                    </span>
                  ))}
                </div>
                <p>{review.text}</p>
                <h3 className="name">- {review.name}</h3>
                <div className="review_actions">
                  <FaEdit 
                    onClick={() => handleEditReview(review)} 
                    style={{ cursor: 'pointer', marginRight: '10px', color: '#007bff' }} 
                    title="Editar"
                  />
                  <FaTrash 
                    onClick={() => handleDeleteReview(review)} 
                    style={{ cursor: 'pointer', color: '#dc3545' }} 
                    title="Eliminar"
                  />
                </div>
              </div>
              <span className="quotes right_quote">
                <i className="icofont-quote-right" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomerReview;
