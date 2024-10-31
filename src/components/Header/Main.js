import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import MenuImg from '../../assets/images/right_menu_table.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import api from '../Auth/AxiosConfig';
import Swal from 'sweetalert2';

function Main() {
  const [active, setActive] = useState();
  const [Nav, setNav] = useState(false);
  const [Home, setHome] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si el usuario es administrador

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);

    if (token) {
      fetchUserRole();
      fetchProfileImage();
    }
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await api.get('/auth/verify-role', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setIsAdmin(response.data.role === 'administrador'); // Comprueba si el rol es "administrador"
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error al verificar el rol del usuario.', 'error');
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await api.get('/auth/profile-image', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setProfileImage(response.data.profileImageUrl || logo);
    } catch (error) {
      Swal.fire('Error', 'Error al cargar la imagen de perfil.', 'error');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setProfileImage(null);
    setIsAdmin(false); // Restablece el estado de administrador al cerrar sesión
    navigate('/login');
  };

  const handleMenuItemClick = () => {
    closeMenu();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleUserDropdown = () => {
    if (isAuthenticated) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {active && <div className="menu-backdrop" style={{ opacity: "1", visibility: "visible" }}></div>}
      <header className={`fixed ${menuOpen ? 'menu-open' : ''}`}>
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="image" />
            </Link>
            <button className={`navbar-toggler ${menuOpen ? 'open' : ''}`} type="button" onClick={toggleMenu}>
              <span className="navbar-toggler-icon">
                <span className={`toggle-wrap ${menuOpen ? "active" : ""}`}>
                  <span className="toggle-bar"></span>
                </span>
              </span>
            </button>
            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item has_dropdown">
                  <Link className="nav-link" to="#" onClick={handleMenuItemClick}>
                    Home
                  </Link>
                  <span className="drp_btn">
                    <i className="icofont-rounded-down" />
                  </span>
                  <div className={`sub_menu ${isDropdownOpen ? 'open' : ''}`}>
                    <ul style={{ display: "block" }}>
                      <li><Link to="/">Home Default</Link></li>
                      <li><Link to="/home2">Home Slider Hero</Link></li>
                      <li><Link to="/home3">Home Dish List</Link></li>
                      <li><Link target="_blank" to={"https://mediacity.co.in/flavoury/04"} >Home Burger</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="nav-item has_dropdown">
                  <Link className="nav-link" to="#" onClick={handleMenuItemClick}>MENU</Link>
                  <span className="drp_btn"><i className="icofont-rounded-down" /></span>
                  <div className="sub_menu">
                    <ul>
                      <li><Link to="/menulist1">Menu List 1</Link></li>
                      <li><Link to="/menulist2">Menu List 2</Link></li>
                      <li><Link to="/menulist3">Menu List 3</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="nav-item"><Link className="nav-link" to="/about" onClick={handleMenuItemClick}>ABOUT US</Link></li>
                <li className="nav-item has_dropdown">
                  <Link className="nav-link" to="#" onClick={handleMenuItemClick}>Pages</Link>
                  <span className="drp_btn"><i className="icofont-rounded-down" /></span>
                  <div className="sub_menu">
                    <ul>
                      <li><Link to="/bloglist">Blog List </Link></li>
                      <li><Link to="/blogdetail">Blog Details</Link></li>
                      <li><Link to="/reservation1">Reservation 1</Link></li>
                      <li><Link to="/reservation2">Reservation 2</Link></li>
                      <li><Link to="/review">Reviews</Link></li>
                      <li><Link to="/gallery">Gallery</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="nav-item"><Link className="nav-link" to="/contact" onClick={handleMenuItemClick}>Contact</Link></li>
                {isAuthenticated && isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/Admin_Categorys" onClick={handleMenuItemClick}>Ajustes</Link>
                  </li>
                )}
                <li className="nav-item contact_number">
                  <Link className="nav-link" to="tel:+18001234578"><span>Book a table :</span> +1 800 123 45 78</Link>
                </li>
              </ul>
            </div>
            {/* Ícono de usuario o imagen de perfil */}
            <div className="user-icon" onClick={toggleUserDropdown}>
              {isAuthenticated ? (
                <img src={profileImage || logo} alt="Imagen de Perfil" className="rounded-circle" style={{ width: "30px", height: "30px", cursor: "pointer" }} />
              ) : (
                <i className="fa fa-user-circle" style={{ fontSize: "20px", cursor: "pointer" }}></i>
              )}
              {isAuthenticated && isUserDropdownOpen && (
                <div className="user-dropdown">
                  <ul>
                    <li><Link to="/perfil">Perfil</Link></li>
                    <li><Link to="/login" onClick={handleLogout}>Cerrar sesión</Link></li>
                  </ul>
                </div>
              )}
            </div>
            <div className="action_bar">
              <Link to="/reservation1" className="btn btn_primary" onClick={handleMenuItemClick}>FIND A TABLE</Link>
              <div className="bar" onClick={() => setNav(true)}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Main;
