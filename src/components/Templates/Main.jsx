import React, { useEffect } from 'react';
import Header from '../Header/Main'
import Footer from '../Footer/Main'
import Aos from 'aos'

function Template({ children }) {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div className='page_wrapper'>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}

export default Template;