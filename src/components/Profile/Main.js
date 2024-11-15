import React, { useEffect } from 'react'
import Header from '../Header/Main'
import Footer from '../Footer/Main'
import Aos from 'aos'
import EditProfile from '../Profile/EditProfile'  
import PeopleTable from './PeopleTable'  
import UpdateProfileImage from './UpdateProfileImage'
import ProtectedRoute from '../Auth/ProtectedRoute'
import '../../assets/css/editProfile.css'

function Main() {

    useEffect(() => {
        Aos.init();
        Aos.refresh();
    }, []);

    return (
        <div className='page_wrapper'>
            <Header />
            <div style={{ padding: '10%', borderRadius: '15px' }}>
                <EditProfile />
            </div>
            <Footer />
        </div>
    )
}

export default Main