import React, { useContext } from 'react';
import { Row, Col, Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import AppContext from '../context/AppContext';

function Header() {
  const { logout,endpoint } = useContext(AppContext);
  const handleLogout = () => {
    logout();
  }

  const activeStyle = {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  const generalStyle = {
    color: 'white',
    textDecoration: 'none'
  }
  return (
    <Row style={{ backgroundColor: "rgb(2,10,61)", color: "white" }}
      className='d-flex justify-content-between align-items-center'>
      <Col xs={4} md={1} className='d-flex justify-content-around align-items-center'>
        <img src={`${process.env.PUBLIC_URL}/pladdypus_logo.png`} width={70} alt='logo' />
      </Col>
      <Col xs={4} md={9}>
        <Navbar collapseOnSelect expand="lg" variant="light">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                {endpoint==="advertiser" && <Nav.Link as={NavLink} to="/adlanding" style={({ isActive }) => isActive ? activeStyle : generalStyle}>ad-landing</Nav.Link>}
                {endpoint==="advertiser" && <Nav.Link as={NavLink} to="/adcontent" style={({ isActive }) => isActive ? activeStyle : generalStyle}>ad-content</Nav.Link>}
                {endpoint==="hotel" && <Nav.Link as={NavLink} to="/htlanding" style={({ isActive }) => isActive ? activeStyle : generalStyle}>ht-landing</Nav.Link>}
                {endpoint==="hotel" && <Nav.Link as={NavLink} to="/htcontent" style={({ isActive }) => isActive ? activeStyle : generalStyle}>ht-content</Nav.Link>}             
              </Nav>
            </Navbar.Collapse>
        </Navbar>
      </Col>
      <Col xs={4} md={2}>
        <button className='logout-button' onClick={handleLogout}>Logout</button>
      </Col>
    </Row>
  );
}

export default Header;