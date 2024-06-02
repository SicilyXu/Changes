import React, { useState, useContext, useEffect } from 'react';
import { Button, Col, FormControl, InputGroup, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

function Login() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false)

  const handleLogin = async () => {
    const result = await login(username, password);
    if (result.status) {
      console.log(result.endpoint);
      if (result.endpoint === 'hotel')
        navigate("/htlanding")
      else if (result.endpoint === 'advertiser')
        navigate("/adlanding")
    } else {
      setShowError(true);
      setUsername('');
      setPassword('');
    }
  }

  const InStockTooltip = (props) => (
    <Tooltip id="sold-out-tooltip" {...props}>
      Please contact info@pladdypus.com for changing password.
    </Tooltip>
  );

  useEffect(() => {
    if (username !== "" || password !== "")
      setShowError(false)
  }, [username, password])

  return (
    <div style={{ width: '100vw', height: '100vh' }} className='d-flex justify-content-center align-items-center'>
      <video autoPlay muted loop
        style={{
          position: 'fixed',
          right: '0',
          bottom: '0',
          minWidth: '100%',
          minHeight: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          zIndex: '1',
          objectFit: 'cover',
        }} >
        <source src={`${process.env.PUBLIC_URL}/background.mp4`} type="video/mp4" />
      </video>

      <Col md={4}>
        <div style={{ backgroundColor: 'white', zIndex: '10', position: 'relative' }}>
          <div style={{ padding: '1rem', backgroundColor: "rgb(2,10,61)" }}>
            <span style={{ width: '100%' }}>
              <img src={`${process.env.PUBLIC_URL}/main-icon.png`} className='img-fluid' alt='backgound' />
            </span>
          </div>

          <div style={{ padding: '0 1.5rem 0 1.5rem', color: '#707070' }}>
            <div style={{ fontSize: '1.8rem', padding: '1.5rem 0 1.5rem 0' }}>Welcome</div>
            <InputGroup className="mb-1">
              <FormControl
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>
            <div className="mb-3">Email</div>

            <InputGroup className="mb-1">
              <FormControl
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            <div className="">Password</div>
            <OverlayTrigger placement="top" overlay={InStockTooltip}>
              <div className="mb-2 text-end" style={{ color: 'black', cursor: 'pointer', fontWeight: '600' }}>Forgot Password?</div>
            </OverlayTrigger>
            <Button variant="primary" type="submit" className="px-4 w-100 mb-4" style={{ borderRadius: '0' }}
              onClick={handleLogin}>
              Login
            </Button>
          </div>
        </div>
        {showError && <div style={{ padding: '0 1.5rem 0 1.5rem', backgroundColor: '#FFF6F6', borderTop: '1px solid rgb(175,101,99)' }}
          className="pt-2 pb-5">
          <div style={{ fontSize: '1.2rem', fontWeight: '400', color: '#973937' }}>Action Required</div>
          <div style={{ color: '#973937' }}>Incorrect username and/or password.</div>
        </div>}
      </Col>
    </div>
  );
}

export default Login;
