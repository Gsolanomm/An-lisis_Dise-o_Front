import React, { useEffect } from 'react'
import Header from '../Header/Main'
import Footer from '../Footer/Main'
import Aos from 'aos'
import CreateRaffle from './CreateRaffle'
function Main() {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div className='page_wrapper'>
            <Header />

            <div style={{ padding: '7%' }}>
                <CreateRaffle />
            </div>

            <Footer />
        </div>
    )
}

export default Main