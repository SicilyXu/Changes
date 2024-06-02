import React, { useState, useContext, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Modal, Spinner, Button } from 'react-bootstrap';
import AppContext from '../context/AppContext';

function HotelLanding() {
  const { hotelData, setHotelData, uploadImage, uploadVideo, uploadHotel
    , setShowModal, setModalMessage } = useContext(AppContext);
  const [hasAddedNewSlides, setHasAddedNewSlides] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const videoRef = useRef(null);


  useEffect(() => {
    if (hasAddedNewSlides) {
      uploadHotel();
      setHasAddedNewSlides(false); // 重置状态，防止再次触发
    }
  }, [hasAddedNewSlides, uploadHotel]);

  const imageContainer1Style = {
    width: '100%',
    paddingTop: '29.3%',
    position: 'relative',
    border: '1px solid #ddd',
    marginBottom: '20px'
  };

  const imageContainer2Style = {
    width: '100%',
    paddingTop: '17%',
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadImage(file, "(1080, 316)");
      setIsLoading(false);
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setHotelData(prevData => ({
          ...prevData,
          landing: {
            ...prevData.landing,
            public_hotel_logo: s3PublicAddress,
            private_hotel_logo: localAddress
          }
        }));
      }
    }
  };

  const handleSlideUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadImage(file, "(1080, 184)");
      setIsLoading(false);
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setHotelData(prevData => ({
          ...prevData,
          landing: {
            ...prevData.landing,
            public_hotel_slides: [...prevData.landing.public_hotel_slides, s3PublicAddress],
            private_hotel_slides: [...prevData.landing.private_hotel_slides, localAddress]
          }
        }));
      }
    }
  };

  const handleSlideDelete = (index) => {
    const updatedPublicSlides = [...hotelData.landing.public_hotel_slides];
    const updatedPrivateSlides = [...hotelData.landing.private_hotel_slides];
    updatedPublicSlides.splice(index, 1);
    updatedPrivateSlides.splice(index, 1);
    setHotelData(prevData => ({
      ...prevData,
      landing: {
        ...prevData.landing,
        public_hotel_slides: updatedPublicSlides,
        private_hotel_slides: updatedPrivateSlides
      }
    }));
  };
  const moveSlide = (index, direction) => {
    const updatedPublicSlides = [...hotelData.landing.public_hotel_slides];
    const updatedPrivateSlides = [...hotelData.landing.private_hotel_slides];
    if (direction === 'up' && index > 0) {
      [updatedPublicSlides[index], updatedPublicSlides[index - 1]] = [updatedPublicSlides[index - 1], updatedPublicSlides[index]];
      [updatedPrivateSlides[index], updatedPrivateSlides[index - 1]] = [updatedPrivateSlides[index - 1], updatedPrivateSlides[index]];
    } else if (direction === 'down' && index < updatedPublicSlides.length - 1) {
      [updatedPublicSlides[index], updatedPublicSlides[index + 1]] = [updatedPublicSlides[index + 1], updatedPublicSlides[index]];
      [updatedPrivateSlides[index], updatedPrivateSlides[index + 1]] = [updatedPrivateSlides[index + 1], updatedPrivateSlides[index]];
    }
    setHotelData(prevData => ({
      ...prevData,
      landing: {
        ...prevData.landing,
        public_hotel_slides: updatedPublicSlides,
        private_hotel_slides: updatedPrivateSlides
      }
    }));
  };

  const handleVideoUpload = async (e) => {
    if (hotelData.landing.public_hotel_videos.length >= 2) {
      setShowModal(true);
      setModalMessage({ title: "Error", content: "Too Many Hotel Videos, 2 maximun." })
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadVideo(file);
      setIsLoading(false);
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setHotelData(prevData => ({
          ...prevData,
          landing: {
            ...prevData.landing,
            public_hotel_videos: [s3PublicAddress, ...prevData.landing.public_hotel_videos],
            private_hotel_videos: [localAddress, ...prevData.landing.private_hotel_videos]
          }
        }));
      }
    }
  };

  const handleVideoDelete = (index) => {
    const updatedVideos = [...hotelData.landing.public_hotel_videos];
    updatedVideos.splice(index, 1);
    setHotelData(prevData => ({
      ...prevData,
      landing: {
        ...prevData.landing,
        public_hotel_videos: updatedVideos,
      }
    }));
    setSelectedVideoIndex(null);
    setSelectedVideoUrl(null);
  };

  const playVideo = (videoUrl, index) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoIndex(index);
  };

  return (
    <>
      {hotelData &&
        <Container>
          <Row className="mb-3">
            <Col xs={12}>
              <h4 className="mb-1">Hotel Logo Image</h4>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="formFileLogo" className="mb-3">
                <Form.Label>Upload Logo <small><b>Ideal Size: 1080*316px</b></small></Form.Label>
                <Form.Control type="file" onChange={handleLogoUpload} accept="image/*" />
              </Form.Group>
              <Form.Group controlId="objectFit" className="mb-3">
                <Button onClick={() => { setHasAddedNewSlides(true) }}>Save Change</Button>
              </Form.Group>
            </Col>
            {hotelData.landing.public_hotel_logo && (
              <Col xs={12} md={6} >
                <div style={imageContainer1Style}>
                  <img src={hotelData.landing.public_hotel_logo} alt="Hotel Logo" style={imageStyle} />
                </div>

              </Col>)}
          </Row>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <h4 className="mb-1">Hotel Slides Images</h4>
              <Form.Group controlId="formFileSlides" className="mb-3">
                <Form.Label>Upload Slides <small><b>Ideal Size: 1080*184px</b></small></Form.Label>
                <Form.Control type="file" multiple onChange={handleSlideUpload} accept="image/*" />
              </Form.Group>
              <Form.Group controlId="objectFit" className="mb-3">
                <Button onClick={() => { setHasAddedNewSlides(true) }}>Save Changes</Button>
              </Form.Group>
            </Col>
            <Row>
              {hotelData.landing.public_hotel_slides.map((slideUrl, index) => (
                <React.Fragment key={index}>
                  <Row key={index} className="map-thumbnail d-flex justify-content-between align-items-center">
                    <Col md={6} xs={6} className='me-2 '>
                      <div style={imageContainer2Style}>
                        <img src={slideUrl} alt={`Map ${index}`} className='me-2' style={imageStyle} />
                      </div>
                    </Col>
                    <Col md={2} xs={5}>
                      <img src={`${process.env.PUBLIC_URL}/icons8-up.png`} onClick={() => moveSlide(index, 'up')} width="25%" style={{ cursor: "pointer", border: "1px solid green", borderRadius: '50%' }} className="me-1" alt="Up" />
                      <img src={`${process.env.PUBLIC_URL}/icons8-down.png`} onClick={() => moveSlide(index, 'down')} width="25%" style={{ cursor: "pointer", border: "1px solid red", borderRadius: '50%' }} className="me-1" alt="Down" />
                      <img src={`${process.env.PUBLIC_URL}/icons8-delete.png`} onClick={() => handleSlideDelete(index)} width="25%" style={{ cursor: "pointer", border: "1px solid teal", borderRadius: '50%' }} className="me-1" alt="Delete" />
                    </Col>
                    <Col md={3} xs={0}>&nbsp;</Col>
                  </Row>
                </React.Fragment>
              ))}
            </Row>
          </Row>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <h4 className="mb-1">Hotel Videos</h4>
              <Form.Group controlId="formFileVideos" className="mb-3">
                <Form.Label>Upload Videos</Form.Label>
                <Form.Control type="file" onChange={handleVideoUpload} accept="video/*" />
              </Form.Group>
              <Form.Group controlId="objectFit" className="mb-3">
                <Button onClick={() => { setHasAddedNewSlides(true) }}>Save Changes</Button>
              </Form.Group>
            </Col>
            <Col xs={0} md={6}>&nbsp;</Col>
            <Col xs={12} md={6}>
              <video width="100%" controls ref={videoRef} key={selectedVideoUrl}>
                <source src={selectedVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Col>
            <Col xs={12} md={4}>
              {hotelData.landing.public_hotel_videos.map((videoUrl, index) => (
                <Row key={index} className="mb-2 align-items-center" style={{ backgroundColor: selectedVideoIndex === index ? '#f0f0f0' : 'transparent' }}>
                  <Col xs={10}>
                    <span style={{ cursor: 'pointer' }} onClick={() => playVideo(videoUrl, index)}>{videoUrl.substring(videoUrl.lastIndexOf('/') + 1)}</span>
                  </Col>
                  <Col xs={2}>
                    <Button variant="danger" onClick={() => handleVideoDelete(index)}>Delete</Button>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>

          <Modal show={isLoading} centered size="sm">
            <Modal.Body className="text-center">
              <Spinner animation="border" />
            </Modal.Body>
          </Modal>
        </Container>
      }</>
  );
}

export default HotelLanding;
