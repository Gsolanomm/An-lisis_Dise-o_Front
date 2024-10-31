// src/components/Main.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import MenuImg from '../../assets/images/right_menu_table.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Main() {
  const [active, setActive] = useState();
  const [Nav, setNav] = useState(false);
  const [Home, setHome] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token); // Establece autenticación si hay un token
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

   //haz que se remueva el token del localStorage al hacer click en cerrar sesión
    const handleLogout = () => {
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
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
      navigate('/login'); // Redirige a login si no está autenticado
    }
  };

  return (
    <>
      {active && <div className="menu-backdrop" style={{ opacity: "1", visibility: "visible" }}></div>}
      <header className={`fixed ${menuOpen ? 'menu-open' : ''}`}>
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="logo" />
            </Link>
            <button className={`navbar-toggler ${menuOpen ? 'open' : ''}`} type="button" onClick={toggleMenu}>
              <span className="navbar-toggler-icon" onClick={() => setHome(Home === true ? false : true)}>
                <span className={`toggle-wrap ${menuOpen ? "active" : ""}`}>
                  <span className="toggle-bar"></span>
                </span>
              </span>
            </button>
            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item has_dropdown">
                  <Link className="nav-link" to="#" onClick={handleMenuItemClick}>Home</Link>
                  <span className="drp_btn"><i className="icofont-rounded-down" /></span>
                  <div className={`sub_menu ${isDropdownOpen ? 'open' : ''}`}>
                    <ul style={{ display: "block" }}>
                      <li><Link to="/">Home Default</Link></li>
                      <li><Link to="/home2">Home Slider Hero</Link></li>
                      <li><Link to="/home3">Home Dish List</Link></li>
                      <li><Link target="_blank" to={"https://mediacity.co.in/flavoury/04"}>Home Burger</Link></li>
                    </ul>
                  </div>
                </li>



                
                {/* Cambié la lista de menú a un botón que redirige a menulist3 */}
                <li className="nav-item">
                  <Link className="nav-link" to="/menulist3" onClick={handleMenuItemClick}>MENU</Link> {/* Redirige a menulist3 */}
                </li>




                <li className="nav-item"><Link className="nav-link" to="/about" onClick={handleMenuItemClick}>ABOUT US</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/ourchef" onClick={handleMenuItemClick}>OUR CHEFS</Link></li>
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
                <li className="nav-item contact_number">
                  <Link className="nav-link" to="tel:+18001234578">
                    <span>Book a table :</span> +1 800 123 45 78
                  </Link>
                </li>
              </ul>
            </div>
            {/* Ícono de usuario fijo fuera del menú */}
            <div className="user-icon" onClick={toggleUserDropdown}>
              <i className="fa fa-user-circle" style={{ fontSize: "20px", cursor: "pointer" }}></i>
              {isAuthenticated && isUserDropdownOpen && (
                <div className="user-dropdown">
                  <ul>
                    <li><Link to="/perfil">Perfil</Link></li>
                    
                    <li><Link to="#" onClick={handleLogout}>Cerrar sesión</Link></li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {Nav && (
        <div className={`right_sidemenu ${Nav && "active"}`}>
          <span className="close_rightmenu" onClick={() => setNav(false)}>
            <i className="icofont-close-circled" />
          </span>
          <div className="menu_inner_content">
            <Link to="#" className="side_logo"><img src={logo} alt="logo" /></Link>
            <ul className="contact_listing">
              <li><p className="sub_title">Call us</p><div className="cnt_block"><Link to="tel:+11234567890">+1 123 456 7890</Link></div></li>
              <li><p className="sub_title">Email us</p><div className="cnt_block"><Link to="mailto:hello@gmail.com">hello@gmail.com</Link></div></li>
              <li><p className="sub_title">Find us</p><div className="cnt_block"><p>Restaurant St, Delicious City, London 9578, UK</p></div></li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
