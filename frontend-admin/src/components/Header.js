import React, {useContext} from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import AppContext from '../context/AppContext';

function Header() {
  const { logout} = useContext(AppContext);

  const activeStyle = {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
      <img src={`${process.env.PUBLIC_URL}/icons8-log-out.png`} 
      alt='logout' width={24} height={24} className='me-2'
      onClick={logout}/>
        <Navbar.Brand as={NavLink} to="/" style={{ textDecoration: 'none' }}>JBG System</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/profile" style={({ isActive }) => isActive ? activeStyle : {}}>Profile</Nav.Link>
            {/* <Nav.Link as={NavLink} to="/statistics" style={({ isActive }) => isActive ? activeStyle : {}}>Statistics</Nav.Link> */}
            <Nav.Link as={NavLink} to="/htlanding" style={({ isActive }) => isActive ? activeStyle : {}}>ht-landing</Nav.Link>
            <Nav.Link as={NavLink} to="/htcontent" style={({ isActive }) => isActive ? activeStyle : {}}>ht-content</Nav.Link>
            <Nav.Link as={NavLink} to="/adimage" style={({ isActive }) => isActive ? activeStyle : {}}>ad-image</Nav.Link>
            <Nav.Link as={NavLink} to="/adcontent" style={({ isActive }) => isActive ? activeStyle : {}}>ad-content</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default Header;
