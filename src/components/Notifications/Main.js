import React, { useEffect } from 'react'
import Header from '../Header/Main'
import Footer from '../Footer/Main'
import Aos from 'aos'
import Notification from './Notification'


function Main() {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div className='page_wrapper'>
            <Header />
            <Notification />
            <Footer />
        </div>
    )
}

export default Main