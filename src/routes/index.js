import React from 'react'
import { Route, Routes,  } from 'react-router-dom';
import Home from '../components/Home/Main'
import HomeTwo from '../components/HomeTwo/Main'
import HomeThree from '../components/HomeThree/Main'
import MenuList1 from '../components/MenuList1/Main'
import MenuList2 from '../components/MenuList2/Main'
import MenuList3 from '../components/MenuList3/Main'
import ConfigurationMenu from '../components/ConfigurationMenu/Main'
import About from '../components/About/Main'
import Reserv1 from '../components/Reserv1/Main'
import Reviews from '../components/Reviews/Main'
import OurChef from '../components/OurChef/Main'
import Contact from '../components/Contact/Main'
import BlogList from '../components/BlogList/Main'
import BlogDetail from '../components/BlogDetail/Main'
import Gallery from '../components/Gallery/Main'
import Category from '../components/Categorys/Main'
import Login from '../components/Login/Main'
import ProtectedRoute from '../components/Auth/ProtectedRoute'
import Register from '../components/Register/Main'
import Profile from '../components/Profile/Main'
import OrdersMenu from '../components/Orders/Main';
import Raffle from '../components/Raffle/Main';
import RaffleListinigPage from '../components/Raffle/RaffleListingPage';
import PeopleTable from '../components/Profile/PeopleTable';
import SeeOrders from '../components/Orders/SeeOrders';
import ListReser from '../components/MainReserv/ListReservation';

function Index() {
    
  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home2" element={<HomeTwo />} />
          <Route path="/home3" element={<HomeThree />} />
          <Route path="/menulist1" element={<MenuList1 />} />
          <Route path="/menulist2" element={<MenuList2 />} />
          <Route path="/menu" element={<MenuList3 />} />
          <Route path="/configurationmenu" element={<ConfigurationMenu />} />
          <Route path="/about" element={<About />} />
          <Route path="/reservation1" element={<Reserv1 />} />
        <Route path="/listreservation" element={<ListReser />} />
          <Route path="/review" element={<Reviews />} />
          <Route path="/ourchef" element={<OurChef />} />
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/bloglist" element={<BlogList />} />
          <Route path="/blogdetail" element={<BlogDetail/>} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/Admin_Categorys" element={
              <ProtectedRoute allowedRoles={"administrador"} >
                  <Category />
              </ProtectedRoute>} />

            <Route path="/OrderMenu" element={
                <ProtectedRoute allowedRoles={["administrador","empleado"]} >
                    <OrdersMenu />
                 </ProtectedRoute>} />

<Route path="/see_orders" element={<ProtectedRoute allowedRoles={["administrador","mesero"]} >
            <SeeOrders />
          </ProtectedRoute>} />

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/perfil' element={<ProtectedRoute >
            <Profile />
          </ProtectedRoute>} />

          <Route path='/crear_rifa' element={<ProtectedRoute allowedRoles={"administrador"}>
            <Raffle />
          </ProtectedRoute>} />

          <Route path='/listar_rifa' element={ <RaffleListinigPage/> }/>

          <Route path='/administrar_usuarios' element={<ProtectedRoute allowedRoles={"administrador"}>
            <PeopleTable />
          </ProtectedRoute>} />
            
          <Route path='/reservation1' element={<ProtectedRoute allowedRoles={"administrador"}>
            <Reserv1 />
          </ProtectedRoute>} />

          <Route path='/listreservation' element={<ProtectedRoute allowedRoles={"administrador"}>
            <ListReser />
          </ProtectedRoute>} />




        </Routes>
    </>
  )
}

export default Index