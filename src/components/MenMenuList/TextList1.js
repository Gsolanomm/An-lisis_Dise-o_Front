import React from 'react'
import Slider from 'react-slick'

const Saladlist = {
    responsive: [
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 10,
                speed: 5000,
                easing: "linear"
            },
        },
        {
            breakpoint: 1000,
            settings: {
                slidesToShow: 10,
                speed: 8000,
                easing: "linear",
            },
        },
    ],
}

function TextList1() {
    return (
        <>
            <div className="menu_list_section menuList_page">
                <Slider className="" id="salad_list_flow" {...Saladlist} arrows={false} slidesToShow={10} autoplay={true}speed={5000} autoplaySpeed={0} easing={"linear"} style={{ transition: "all 4s linear 0s", width: "8955px", transform: "translate3d(-4169px, 0px, 0px)" }}>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>SALAD</span>
                            <span className="mark_star">
                                <i className="icofont-restaurant-menu" />
                            </span>
                        </div>
                    </div>
                </Slider>
            </div>

        </>
    )
}

export default TextList1