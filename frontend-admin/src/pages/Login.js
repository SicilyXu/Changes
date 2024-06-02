import React, { useState, useContext } from 'react';
import { Button, Card, Form, Container, Row, Col, InputGroup, FormControl, FormCheck } from 'react-bootstrap';
import { Lock, Person } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import InfoModal from '../components/InfoModal.js'


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [endpoint, setEndpoint] = useState('advertiser');
  const navigate = useNavigate();
  const { saveToken } = useContext(AppContext);
  const [modalShow, setModalShow] = useState(false);


  const toggleEndpoint = () => {
    setEndpoint(endpoint === 'hotel' ? 'advertiser' : 'hotel');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      endpoint,
      email,
      password,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        saveToken(data.token, endpoint, email, data.id);
        navigate("/")
      } else {
        setModalShow(true);
        // 处理错误
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <Container>
        <Row className="justify-content-center d-flex align-items-stretch">
          <Col md={6}>
            <Card>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <h1>Just Brilliant Guides</h1>
                  <p className="text-muted">Touchscreen CMS System</p>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <Person />
                    </InputGroup.Text>
                    <FormControl
                      placeholder="E-mail"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroup.Text>
                      <Lock />
                    </InputGroup.Text>
                    <FormControl
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                  <FormCheck
                    type="switch"
                    id="custom-switch"
                    label={endpoint === 'hotel' ? 'Hotel' : 'Advertiser'}
                    checked={endpoint === 'advertiser'}
                    onChange={toggleEndpoint}
                    className="mb-3"
                  />
                  <Button variant="primary" type="submit" className="px-4">
                    Login
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              text="white"
              bg="primary"
              className="text-center py-5 h-100"
            >
              <Card.Body>
                <h2>Advertisement placeholder</h2>
                <p>
                  Advertisement placeholders
                  Advertisement placeholders
                  Advertisement placeholders
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <InfoModal
        title="Login Error"
        content="Email or Password or PLACEHOLDER ERROR"
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default Login;
