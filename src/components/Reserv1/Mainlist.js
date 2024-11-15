import React, { useEffect } from 'react'
import Header from '../Header/Main'
import Footer from '../Footer/Main'
import ListReserva from '../MainReserv/ListReservation'
import Aos from 'aos'


function MainList() {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div className='page_wrapper'>
            <Header />
            <ListReserva />
            <Footer />
        </div>
    )
}

export default MainList