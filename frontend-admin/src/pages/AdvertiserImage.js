import React, { useState, useContext, useEffect,useRef } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, FormControl, Modal, Spinner } from 'react-bootstrap';
import AppContext from '../context/AppContext';
import ModalInfo from '../context/ModalInfo';

function AdvertiserImage() {
  const [newRange, setNewRange] = useState({
    start_date: '', end_date: '',
    private_image_url: "", public_image_url: ""
  });
  const todayDate = new Date().toISOString().split('T')[0];
  const [isloading, setIsLoading] = useState(false);
  const { advertiserData, setAdvertiserData, uploadImage, uploadAdvertisement, uploadVideo } = useContext(AppContext);
  const [hasAddedNewRange, setHasAddedNewRange] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // 只有在成功添加新range后才调用uploadAdvertisement
    if (hasAddedNewRange) {
      uploadAdvertisement();
      setHasAddedNewRange(false); // 重置状态，防止再次触发
    }
  }, [hasAddedNewRange, uploadAdvertisement]);

  const imageContainerStyle = {
    width: '100%',
    paddingTop: '32%',
    position: 'relative',
    border: '1px solid #ddd',
    marginBottom: '20px'
  };

  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadImage(file, "(1080, 346)");
      setIsLoading(false);
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setAdvertiserData(prevDetails => {
          return {
            ...prevDetails,
            public_image_url: s3PublicAddress,
            private_image_url: localAddress
          };
        })
      }
    }

  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadVideo(file);
      setIsLoading(false);
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setAdvertiserData(prevData => ({
          ...prevData,
          public_video_url: s3PublicAddress,
          private_video_url: localAddress
        }));
      }
    }
  }

  const handleSpecialImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadImage(file, "(1080, 346)");
      setIsLoading(false);
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setNewRange((prevDetails) => {
          return {
            ...prevDetails,
            public_image_url: s3PublicAddress,
            private_image_url: localAddress
          };
        });
      }
    }
  };

  const handleRangeAddition = async () => {


    if (newRange.start_date && newRange.end_date && newRange.public_image_url && newRange.private_image_url && isRangeValid(newRange)) {
      const newRangetmp = newRange;
      setAdvertiserData((prevDetails) => {
        const specials = [newRangetmp, ...prevDetails.specials]
        return { ...prevDetails, specials: specials }
      })
      setNewRange({ start_date: '', end_date: '', private_image_url: "", public_image_url: "" });
      setHasAddedNewRange(true);
    } else {
      setShowModal(true);
    }
  };

  const isRangeValid = (range) => {
    return !advertiserData.specials.some(r => (new Date(range.start_date) <= new Date(r.end_date) && new Date(range.end_date) >= new Date(r.start_date)));
  };

  const handleRangeDeletion = (index) => {
    let updateSpecials = [...advertiserData.specials];
    updateSpecials.splice(index, 1);
    setAdvertiserData((prevDetails) => {
      return { ...prevDetails, specials: updateSpecials }
    })
    setHasAddedNewRange(true);
  };

  return (
    <>
      {advertiserData &&
        <Container>
          {/* Image Upload Section */}
          <Row className="mb-3">
            <Col xs={12}>
              <h4 className="mb-1">Advertisement Banner General Image</h4>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Change Image <small><b>Ideal Size: 1080*346px</b></small></Form.Label>
                <Form.Control type="file" onChange={handleImageUpload} accept="image/*" />
              </Form.Group>
              <Form.Group controlId="objectFit" className="mb-3">
                <Button onClick={() => { setHasAddedNewRange(true) }}>Save Change</Button>
              </Form.Group>
            </Col>
            {advertiserData.public_image_url && (
              <Col xs={12} md={6}>
                <div style={imageContainerStyle}>
                  <img src={advertiserData.public_image_url} alt="Preview" style={imageStyle} />
                </div>
              </Col>
            )}
          </Row>

          {/* Video Upload Section */}
          <Row className="mb-3">
            <Col xs={12}>
              <h4 className="mb-1">Advertisement Video</h4>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Change Video <small><b>Ideal Size: 1080*607px (&lt;100MB)</b></small></Form.Label>
                <Form.Control type="file" onChange={handleVideoUpload} accept="video/*" />
              </Form.Group>
              <Form.Group controlId="objectFit" className="mb-3">
                <Button onClick={() => { setHasAddedNewRange(true) }}>Save Change</Button>
              </Form.Group>
            </Col>
            {advertiserData.public_video_url && (
              <Col xs={12} md={6}>
                <video width="100%" controls ref={videoRef} key={advertiserData.public_video_url}>
                  <source src={advertiserData.public_video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Col>
            )}
          </Row>


          {/* Special Range Section */}
          <Row className="mt-3">
            <Col xs={12}>
              <h4 className="mb-1">Banner Special Time Image</h4>
            </Col>
            <Col md={6} xs={12}>
              {/* Date Input Groups */}
              <InputGroup className="mb-2">
                <InputGroup.Text style={{ width: '100px' }}>Start Date:</InputGroup.Text>
                <FormControl type="date" min={todayDate} value={newRange.start_date} onChange={(e) => setNewRange({ ...newRange, start_date: e.target.value })} />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text style={{ width: '100px' }}>End Date:</InputGroup.Text>
                <FormControl type="date" min={newRange.start_date || todayDate} value={newRange.end_date} onChange={(e) => setNewRange({ ...newRange, end_date: e.target.value })} />
              </InputGroup>
              <Form.Group controlId="specialRangeFile" className="mb-3">
                <Form.Label>Upload Image <small><b>Ideal Size: 1080*346px</b></small></Form.Label>
                <Form.Control type="file" onChange={handleSpecialImageUpload} accept="image/*" />
              </Form.Group>
              <Button onClick={handleRangeAddition}>Save Ranges</Button>
            </Col>
            {newRange.public_image_url && (
              <Col md={6} xs={12}>
                <div style={imageContainerStyle}>
                  <img src={newRange.public_image_url} alt="Preview" style={imageStyle} />
                </div>
              </Col>
            )}
          </Row>

          {/* Displaying Special Ranges */}
          <Row className="mt-3">
            {advertiserData.specials.map((range, index) => (
              <Row key={index} className="mb-3 align-items-center">
                <Col md={6} xs={12}>
                  {/* Display range information */}
                  <InputGroup className="mb-2">
                    <InputGroup.Text style={{ width: '100px' }}>Start Date:</InputGroup.Text>
                    <FormControl type="date" value={range.start_date} readOnly />
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <InputGroup.Text style={{ width: '100px' }}>End Date:</InputGroup.Text>
                    <FormControl type="date" value={range.end_date} readOnly />
                  </InputGroup>
                  {range.start_date > todayDate &&
                    <Button variant="danger" onClick={() => handleRangeDeletion(index)}>Delete Range</Button>
                  }
                </Col>
                <Col md={6} xs={12}>
                  {range.public_image_url && (
                    <div style={imageContainerStyle}>
                      <img src={range.public_image_url} alt="Preview" style={imageStyle} />
                    </div>
                  )}
                </Col>
              </Row>
            ))}
          </Row>
        </Container>}
      <Modal show={isloading} centered size="sm">
        <Modal.Body className="text-center">
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
      <ModalInfo
        title="Error"
        show={showModal}
        handleClose={() => setShowModal(false)}
      >
        Invalid range, missing image, or invalid image. Please check your data.
      </ModalInfo>
    </>

  );
}

export default AdvertiserImage;
