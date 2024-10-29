import React from 'react'
import { Link } from 'react-router-dom'
import Menulist1 from '../../assets/images/menulist_01.png'
import Menustb1 from '../../assets/images/menulistSub_01.png'
import Menustb2 from '../../assets/images/menulistSub_02.png'
import Menustb3 from '../../assets/images/menulistSub_03.png'
import Menustb4 from '../../assets/images/menulistSub_04.png'

function DishList() {
  return (
    <>
      <section className="row_am dishList_block">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-6" data-aos="fade-up" data-aos-duration={1500} >
              <div className="dish_img dish_left text-center">
                <img className="img-fluid" src={Menulist1} alt="img" />
              </div>
            </div>
            <div className="col-md-12 col-lg-6" data-aos="fade-up" data-aos-duration={1500} >
              <div className="dish_list">
                <ul>
                  <li>
                    <div className="img">
                      <img src={Menustb1} alt="img" />
                    </div>
                    <div className="info">
                      <div className="mainCource">
                        <div className="dishName">
                          <h4>Beef steak grill pan</h4>
                          <span className="new">NEW</span>
                        </div>
                        <div className="doted" />
                        <span className="price">$16.00</span>
                      </div>
                      <div className="description">
                        <p>
                          Beef, Eggs, poached, fried, with bacon, chorizo, roasted
                          roma tomatoes.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="img">
                      <img src={Menustb2} alt="img" />
                    </div>
                    <div className="info">
                      <div className="mainCource">
                        <div className="dishName">
                          <h4>raw marbled meat steak</h4>
                        </div>
                        <div className="doted" />
                        <span className="price">$25.00</span>
                      </div>
                      <div className="description">
                        <p>
                          Siced beef in a large bowl. Whisk together lemon juice, soy
                          sauce.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="img">
                      <img src={Menustb3} alt="img" />
                    </div>
                    <div className="info">
                      <div className="mainCource">
                        <div className="dishName">
                          <h4>Medium beef steak grill pan</h4>
                        </div>
                        <div className="doted" />
                        <span className="price">$22.00</span>
                      </div>
                      <div className="description">
                        <p>
                          Galjoen fish Australian lungfish sea, Shad angler arapaima
                          pencilsmelt.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="img">
                      <img src={Menustb4} alt="img" />
                    </div>
                    <div className="info">
                      <div className="mainCource">
                        <div className="dishName">
                          <h4>Beef steak grill pan</h4>
                        </div>
                        <div className="doted" />
                        <span className="price">$18.00</span>
                      </div>
                      <div className="description">
                        <p>
                          Beef, Eggs, poached, fried, with bacon, chorizo, roasted
                          roma tomatoes. , mushrooms &amp; spinach
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="img">
                      <img src={Menustb1} alt="img" />
                    </div>
                    <div className="info">
                      <div className="mainCource">
                        <div className="dishName">
                          <h4>Beef steak grill pan</h4>
                        </div>
                        <div className="doted" />
                        <span className="price">$10.00</span>
                      </div>
                      <div className="description">
                        <p>
                          Beef, Eggs, poached, fried, with bacon, chorizo, roasted
                          roma tomatoes.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <Link to="/reservation2" className="btn btn_primary">
                  book a table
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DishList