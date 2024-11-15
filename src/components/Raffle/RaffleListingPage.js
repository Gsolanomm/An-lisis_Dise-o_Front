import React, { useEffect } from 'react';
import Aos from 'aos';
import Header from '../Header/Main';
import Footer from '../Footer/Main';
import RaffleList from './RaffleList';

function RaffleListingPage() {
    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div>
            <Header />
        <div className="page_wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' , padding: '5%' }}>
            
            <section className="blog_list_section" style={{ flex: 1, padding: '20px 0' }}>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10">
                            <RaffleList />
                        </div>
                    </div>
                </div>
            </section>
        </div>
                    <Footer />
        </div>

    );
}

export default RaffleListingPage;
