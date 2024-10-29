import React, { useEffect } from 'react'
import Header from '../Header/Main'
import Footer from '../Footer/Main'
import Aos from 'aos'
import EditProfile from '../Profile/EditProfile'    

function Main() {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div className='page_wrapper'>
            <Header />
            <EditProfile />
            <Footer />
        </div>
    )
}

export default Main