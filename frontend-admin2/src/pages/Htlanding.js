import React, { useState, useContext, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Modal, Spinner } from 'react-bootstrap';
import AppContext from '../context/AppContext';

function Htlanding() {
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
    border: '1px solid #ddd'
  };

  const imageContainer2Style = {
    width: '100%',
    paddingTop: '31.5%',
    position: 'relative',
    border: '1px solid #ddd'
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
      const s3PublicAddress = await uploadImage(file, "(1080, 340)");
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
        <div className='pb-3'>
          <Container style={{ backgroundColor: 'white' }}>
            <Row className="mb-3 mt-3">
              <Col xs={12} className="p-2 mt-3">
                <span>Main Header</span>
              </Col>
              <Col xs={12} md={6} className='p-2'>
                <Form.Group controlId="formFileLogo">
                  <Form.Control type="file" onChange={handleLogoUpload} accept="image/*" />
                  <Form.Label style={{ margin: 0, fontSize: '0.8em' }}>Suggested ratios: <small><b>1080px (w) x 316px (h)</b></small></Form.Label>
                </Form.Group>
                <Form.Group controlId="objectFit" className="mb-3" style={{ direction: "rtl" }}>
                  <button onClick={() => { setHasAddedNewSlides(true) }} className='genenric-button'>Save</button>
                </Form.Group>
              </Col>
              {hotelData.landing.public_hotel_logo && (
                <Col xs={12} md={6} className=''>
                  <Col md={11} xs={11}>
                    <div style={imageContainer1Style}>
                      <img src={hotelData.landing.public_hotel_logo} alt="Hotel Logo" style={imageStyle} />
                    </div>
                  </Col>
                  <Col md={1} xs={1}>&nbsp;</Col>


                </Col>)}
            </Row>
            <Row className="mb-3 mt-3">
              <Col xs={12} className="p-2 mt-3">
                <span>Sliders</span>
              </Col>
              <Col xs={12} md={6} className='p-2'>
                <Form.Group controlId="formFileSlides">
                  <Form.Control type="file" multiple onChange={handleSlideUpload} accept="image/*" />
                  <Form.Label style={{ margin: 0, fontSize: '0.8em' }}>Suggested ratios: <small><b>1080px (w) x 340px (h)</b> maximun <b>6</b></small></Form.Label>
                </Form.Group>
                <Form.Group controlId="objectFit" className="mb-3" style={{ direction: "rtl" }}>
                  <button onClick={() => { setHasAddedNewSlides(true) }} className='genenric-button'>Save</button>
                </Form.Group>
              </Col>
              <Col>
                {hotelData.landing.public_hotel_slides.map((slideUrl, index) => (
                  <React.Fragment key={index}>
                    <Row key={index} className="map-thumbnail d-flex justify-content-between mb-3">
                      <Col md={11} xs={11} className=''>
                        <div style={imageContainer2Style}>
                          <img src={slideUrl} alt={`Map ${index}`} style={imageStyle} />
                        </div>
                      </Col>
                      <Col md={1} xs={1} className='d-flex flex-column justify-content-between'>
                        <i className="bi bi-x-square" onClick={() => handleSlideDelete(index)} style={{ cursor: "pointer" }}></i>
                        <span className='d-flex flex-column'>
                          <i className="bi bi-arrow-up-square" onClick={() => moveSlide(index, 'up')} style={{ cursor: "pointer" }}></i>
                          <i className="bi bi-arrow-down-square" onClick={() => moveSlide(index, 'down')} style={{ cursor: "pointer" }}></i>
                        </span>


                      </Col>
                    </Row>
                  </React.Fragment>
                ))}
              </Col>
            </Row>
            <Row className="mb-3 mt-3">
              <Col xs={12} className="p-2 mt-3">
                <span>Showcase Videos</span>
              </Col>
              <Col xs={12} md={6} className='p-2'>
                <Form.Group controlId="formFileVideos" className="mb-3">
                  <Form.Control type="file" onChange={handleVideoUpload} accept="video/*" />
                  <Form.Label style={{ margin: 0, fontSize: '0.8em' }}>Suggested ratios: <small><b>16(w) : 9(h)</b> maximun <b>2</b></small></Form.Label>
                </Form.Group>
                <Form.Group controlId="objectFit" className="mb-3" style={{ direction: "rtl" }}>
                  <button onClick={() => { setHasAddedNewSlides(true) }} className='genenric-button'>Save</button>
                </Form.Group>
              </Col>
              <Col xs={0} md={6}>&nbsp;</Col>
              {hotelData.landing.public_hotel_videos.length > 0 && <Col xs={12} md={6} className='p-2'>
                <video width="100%" controls ref={videoRef} key={selectedVideoUrl}>
                  <source src={selectedVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Col>}
              <Col xs={12} md={6} className=''>
                {hotelData.landing.public_hotel_videos.map((videoUrl, index) => (
                  <Row key={index} className="mb-2 justify-content-between ">
                    <Col xs={1} md={1} className='d-flex justify-content-center' >
                      <span style={{ border: '1px solid grey', width: '2em', height: '2em' }} className='d-flex justify-content-center align-items-center'>{index + 1}</span>
                    </Col>
                    <Col xs={10} md={10} style={{ backgroundColor: selectedVideoIndex === index ? 'whitesmoke' : 'transparent', border: '1px solid grey', height: '2em' }}
                      className='pt-2 pb-2 ps-2 d-flex justify-content-left align-items-center'>
                      <span style={{ cursor: 'pointer' }} onClick={() => playVideo(videoUrl, index)}>{videoUrl.substring(videoUrl.lastIndexOf('/') + 1)}</span>
                    </Col>
                    <Col xs={1} md={1} className='ps-1'>
                      <i className="bi bi-x-square" onClick={() => handleVideoDelete(index)} style={{ cursor: "pointer" }}></i>
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
        </div>
      }</>
  );
}

export default Htlanding;