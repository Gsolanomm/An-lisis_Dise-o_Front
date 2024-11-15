import React, { useEffect } from 'react'
import Header from '../Header/Main'
import Footer from '../Footer/Main'
import Aos from 'aos'
import OrdersMenu from './OrdersMenu'


function Main() {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div className='page_wrapper'>
            <Header />
           <OrdersMenu />
            <Footer />
        </div>
    )
}

export default Main