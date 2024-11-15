import React from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick';
import BG1 from '../../assets/images/banner_slide01.png'
import BG2 from '../../assets/images/banner_slide02.png'
import BG3 from '../../assets/images/banner_slide03.png'

const Bannerslider = {
    responsive: [
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
            },
        },
        {
            breakpoint: 1000,
            settings: {
                slidesToShow: 1,
            },
        },
    ],
}

function Banner() {
    return (
        <>
            <section className="banner_section second_banner">
                <div className="social_media_side side_fixer">
                    <ul>
                        <li>
                            <a href="https://www.facebook.com/p/Brothers-Restaurant-100063719043483/" target='_blank'>Facebook</a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/" target='_blank'>Instagram</a>
                        </li>
                        <li>
                            <a href="https://wa.me/50689889409" target='_blank'>WhatsApp</a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com/" target='_blank'>Youtube</a>
                        </li>
                    </ul>
                </div>
                <div className="timing_side side_fixer">
                    <ul>
                        <li>
                            <span>Lunes - Domingos : 11AM - 11PM </span>
                        </li>
                    </ul>
                </div>
                <div className="banner_slider" data-aos="fade-up" data-aos-duration={3000} data-aos-offset={0} >
                    <Slider className="" id="banner_slider" {...Bannerslider} arrows={false} slidesToShow={1} autoplay={true} autoplaySpeed={5000}>
                        <div className="item">
                            {/* <div className="slider_block" style={{ backgroundImage: `url(${BG1})` }}> */}
                                <div className="overlay"></div> {/* Fondo negro semitransparente */}
                                <div className="ban_text">
                                    <div className="inner_text">
                                        <span className="sub_text" style={{ fontSize: '36px', marginBottom: '10px' }}>Bienvenidos</span>
                                            <h1 style={{ marginTop: '10px' }}>Restaurante Brother's</h1>
                                            <p className="lead">
                                                Hasta la puerta de su casa le llevamos su plato preferido!!.......sin costo adicional, será un gusto servirle!.{" "}
                                            </p>
                                    </div>
                                </div>
                            {/* </div> */}
                        </div>
                        {/* <div className="item">
                            <div className="slider_block" style={{ backgroundImage: `url(${BG2})` }} >
                                <div className="ban_text ">
                                    <div className="inner_text">
                                        <span className="sub_text">Welcome to the restaurant</span>
                                        <h1>Best taste of Steak &amp; BBQ</h1>
                                        <p className="lead">
                                            A restaurant with Timeless &amp; Traditional taste.{" "}
                                        </p>
                                        <Link href="/menulist2" className="btn btn_primary">
                                            view our full menu
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <div className="item">
                            <div className="slider_block" style={{ backgroundImage: `url(${BG3})` }} >
                                <div className="ban_text">
                                    <div className="inner_text">
                                        <span className="sub_text">Welcome to the restaurant</span>
                                        <h1>Timeless &amp; Traditional taste</h1>
                                        <p className="lead">
                                            Authentic Tastes &amp; Authentic Atmosphere, Change your life
                                            with our steaks.{" "}
                                        </p>
                                        <Link href="/MenuList1" className="btn btn_primary">
                                            view our full menu
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </Slider>
                </div>
            </section>
        </>
    )
}

export default Banner