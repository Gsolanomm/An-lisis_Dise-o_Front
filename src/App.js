import './App.css';
import { BrowserRouter as Router } from "react-router-dom"
import Routing from './routes';
import '../src/assets/css/icofont.min.css'
import '../src/assets/css/animate.min.css'
import '../src/assets/css/owl.carousel.min.css'
import '../src/assets/css/bootstrap.min.css'
import '../src/assets/css/aos.css'
import '../src/assets/css/style.css'
import '../src/assets/css/responsive.css'
import '../src/assets/css/lightbox.css'
import '../src/assets/css/slick.css'
import '../src/assets/css/register.css'
import '../src/assets/css/login.css'
// Al comienzo del archivo Main.js
import '@fortawesome/fontawesome-free/css/all.min.css';



function App() {
  return (
    <>
      <Router >
        <Routing />
      </Router>
    </>
  );
}

export default App;
