import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
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
  const [isAdmin, setIsAdmin] = useState(false);

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
      setIsAdmin(response.data.role === 'administrador');
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
    setIsAdmin(false);
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
            {/* <Link className="navbar-brand" to="/">
              <img src={logo} alt="image" />
            </Link> */}
            <button className={`navbar-toggler ${menuOpen ? 'open' : ''}`} type="button" onClick={toggleMenu}>
              <span className="navbar-toggler-icon">
                <span className={`toggle-wrap ${menuOpen ? "active" : ""}`}>
                  <span className="toggle-bar"></span>
                </span>
              </span>
            </button>
            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/home2" onClick={closeMenu}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/notifications" onClick={handleMenuItemClick}>Notificaciones</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/menu" onClick={handleMenuItemClick}>MENU</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/listar_rifa" onClick={handleMenuItemClick}>Listar Rifas</Link>
                </li>
                {isAuthenticated && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/reservation1" onClick={handleMenuItemClick}>Reservaciones</Link>
                  </li>
                )}

                {isAuthenticated && isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/OrderMenu">Comandas</Link>
                  </li>
                )}
                {isAuthenticated && isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/listreservation" onClick={handleMenuItemClick}>Lista de reservaciones</Link>
                  </li>
                )}

                {isAuthenticated && isAdmin && (
                  <>
                    <li className="nav-item has_dropdown">
                      <Link className="nav-link" to="#" onClick={handleMenuItemClick}>
                        Ajustes
                      </Link>
                      <span className="drp_btn">
                        <i className="icofont-rounded-down" />
                      </span>
                      <div className="sub_menu">
                        <ul>
                          <li className="nav-item">
                            <Link to="/Admin_Categorys" onClick={handleMenuItemClick}>Categorias</Link>
                          </li>
                          <li className="nav-item">
                            <Link to="/configurationmenu" onClick={handleMenuItemClick}>Agregar al menu </Link>
                          </li>
                          <li className="nav-item">
                            <Link to="/crear_rifa" onClick={handleMenuItemClick}>Crear Rifa</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </>
                )}
                {/* <li className="nav-item contact_number">
                  <Link className="nav-link" to="tel:+506 2716 5187">
                    <span>Numero telefonico :</span> +506 2716 5187
                  </Link>
                </li> */}
              </ul>
            </div>
            <div className="user-icon" onClick={toggleUserDropdown}>
              {isAuthenticated ? (
                <img src={profileImage || logo} alt="Imagen de Perfil" className="rounded-circle" style={{ width: "30px", height: "30px", cursor: "pointer" }} />
              ) : (
                <i className="fa fa-user-circle" style={{ fontSize: "20px", cursor: "pointer" }}></i>
              )}
              {isAuthenticated && isUserDropdownOpen && (
                <div className="user-dropdown">
                  <ul>
                    <li><Link to="/perfil"><i className="fa fa-user"></i></Link></li>
                    {isAdmin && (
                      <li><Link to="/administrar_usuarios"><i className="fa fa-screwdriver-wrench"></i></Link></li>
                    )}
                    <li><Link to="/login" onClick={handleLogout}><i className="fa fa-sign-out-alt"></i></Link></li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Main;
