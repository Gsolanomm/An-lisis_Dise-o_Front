import React, { useEffect } from 'react'
import Header from '../Header/Main'
import Footer from '../Footer/Main'
import ListReserva from '../MainReserv/ListReservation'
import Reservaciones from '../MainReserv/ReservOne'
import Aos from 'aos'


function MainList() {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div className='page_wrapper'>
            <Header />
            <Reservaciones />
            <Footer />
        </div>
    )
}

export default MainList