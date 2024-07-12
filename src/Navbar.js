import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  return (
    <div className="NAVBAR">
      <div className="Logo">
        <img src='weatherrr.png' alt='logo'/>
        <h2> Weather</h2>
      </div>
      <div id='contentt'>
        <ul>
            <li><input type='text' placeholder='Search Location'/></li>
            <li><button>
      <FontAwesomeIcon icon={faSearch} className="search-icon" /></button></li>
          <li><a href="#Home">Homepage</a></li>
        </ul>
        </div>
        </div>
  );
}

export default Navbar;
