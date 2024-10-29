import React from 'react'
import Slider from 'react-slick';

const Slidersetting = {
    responsive: [
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 10,
                speed: 1000, 
                easing: 'linear'
            },
        },
        {
            breakpoint: 1000,
            settings: {
                slidesToShow: 10,
                speed: 8000, 
                easing: 'linear'
            },
        },
    ],
};

function TextFlow() {
    return (
        <>
            <div className="textFlow_list white_cover">
                <Slider className="Slick-Menu" id="text_list_flow" {...Slidersetting} arrows={false} rtl={true} slidesToShow={10} autoplay={true} speed={5000} autoplaySpeed={0} easing={"linear"} style={{ "width": 5697 }} >
                    <div className="item">
                        <div className="text_block">
                            <span>Door Delivery</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Fine Dining</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Outdoor Catering</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span> Banquets Hall </span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Fine Dining</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Door Delivery</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Fine Dining</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Outdoor Catering</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span> Banquets Hall </span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Fine Dining</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Outdoor Catering</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span> Banquets Hall </span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                </Slider>
            </div>
            <div className="menu_list_section rotet_down">
                <Slider className="Slick-Menu" id="menu_list_flow"  {...Slidersetting} arrows={false} slidesToShow={10} autoplay={true} infinite={true} speed={5000} autoplaySpeed={0} easing={"linear"} style={{ "width": 5697 }}>
                    <div className="item">
                        <div className="text_block">
                            <span>Door Delivery</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Fine Dining</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Outdoor Catering</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span> Banquets Hall </span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Fine Dining</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Door Delivery</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Fine Dining</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Outdoor Catering</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span> Banquets Hall </span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Fine Dining</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span> Banquets Hall </span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="text_block">
                            <span>Fine Dining</span>
                            <span className="mark_star">*</span>
                        </div>
                    </div>
                </Slider>
            </div>
        </>
    )
}

export default TextFlow