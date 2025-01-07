import React from 'react';

function BlogList({ tittle, description, creationDate, image }) {
  const baseURL = "http://localhost:5000";

  return (
    <section className="blog_list_section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="blog_left_side">
              <div className="blog_panel" data-aos="fade-up" data-aos-duration={1500}>
                <div className="main_img">
                  <img src={`${baseURL}${image}`} alt="image" className="img-fluid" />
                </div>
                <div className="blog_info">
                  <span className="date">{creationDate.split('T')[0]}</span>
                  <h2>{tittle}</h2>
                  <p>{description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogList;