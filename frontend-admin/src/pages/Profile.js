import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import InfoModal from '../components/InfoModal.js'
import AppContext from '../context/AppContext';

function Profile() {

  // 密码修改状态
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const { token, endpoint, email, logout } = useContext(AppContext);


  // 处理密码修改
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setModalShow(true);
      return;
    }

    const data = {
      endpoint: endpoint,
      email: email,
      token: token,
      old_password: currentPassword,
      new_password: confirmNewPassword

    }
    const response = await fetch('https://devapi.touchandexplore.com/ChangePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // const data = await response.json();
      logout();
    } else {
      setModalShow(true);
      
      return;
    }
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1>Advertiser Profile</h1>
          <h1 style={{color:'red'}}> TO DO</h1>
          {/* <p><strong>Name:</strong> {advertiserInfo.name}</p>
          <p><strong>Start Date:</strong> {advertiserInfo.start_date}</p>
          <p><strong>End Date:</strong> {advertiserInfo.end_date}</p>
          <p><strong>Plan:</strong> {advertiserInfo.have_video ? "Prenium Plan" : "Standard Plan"}</p>
          <p><strong>Applied Hotels:</strong> {advertiserInfo.hotel_names.join(", ")}</p> */}

        </Col>

        <h2>Change Password</h2>
        <Col md={6}>
          <Form onSubmit={handlePasswordChange}>
            <FormGroup className="mb-3">
              <FormLabel>Current Password</FormLabel>
              <FormControl type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>New Password</FormLabel>
              <FormControl type="password" value={newPassword} minLength={8} onChange={(e) => setNewPassword(e.target.value)} required />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl type="password" value={confirmNewPassword} minLength={8} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
            </FormGroup>
            <Button variant="primary" type="submit">Change Password</Button>
          </Form>
        </Col>
      </Row>
      <InfoModal
        title="Update Error"
        content="Wrong Old Password or New Password Mismatch"
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Container>
  );
}

export default Profile;
