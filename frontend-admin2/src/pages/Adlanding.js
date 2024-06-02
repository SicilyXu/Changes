import React, { useState, useContext, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, InputGroup, FormControl, Modal, Spinner } from 'react-bootstrap';
import AppContext from '../context/AppContext';
import ModalInfo from '../context/ModalInfo';

function Adlanding() {
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
        <div className='pb-3'>
          <Container style={{ backgroundColor: 'white' }}>
            {/* Image Upload Section */}
            <Row className="mb-3 mt-3">
              <Col xs={12} className="p-2 mt-3">
                <span className="mb-1">Advertisement Banner General Image</span>
              </Col>
              <Col xs={12} md={6} className='p-2'>
                <Form.Group controlId="formFile">
                  <Form.Control type="file" onChange={handleImageUpload} accept="image/*" />
                  <Form.Label style={{ margin: 0, fontSize: '0.8em' }}>Suggested ratios: <small><b>1080px (w) x 346px (h)</b></small></Form.Label>
                </Form.Group>
                <Form.Group controlId="objectFit" style={{ direction: "rtl" }}>
                  <button onClick={() => { setHasAddedNewRange(true) }} className='genenric-button'>Save</button>
                </Form.Group>
              </Col>
              {advertiserData.public_image_url && (
                <Col xs={12} md={6}>
                  <Col md={11} xs={11}>
                    <div style={imageContainerStyle}>
                      <img src={advertiserData.public_image_url} alt="Preview" style={imageStyle} />
                    </div>
                  </Col>
                </Col>
              )}
            </Row>

            {/* Video Upload Section */}
            {advertiserData.public_video_url.length !== 0 &&
              <Row className="mb-3">
                <Col xs={12} className="p-2 mt-3">
                  <span className="mb-1">Advertisement Video</span>
                </Col>
                <Col xs={12} md={6} className='p-2'>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control type="file" onChange={handleVideoUpload} accept="video/*" />
                    <Form.Label style={{ margin: 0, fontSize: '0.8em' }}>Suggested ratios: <small><b>1080px (w) x 607px (h) (&lt;100MB)</b></small></Form.Label>
                  </Form.Group>
                  <Form.Group controlId="objectFit" style={{ direction: "rtl" }}>
                    <button onClick={() => { setHasAddedNewRange(true) }} className='genenric-button'>Save</button>
                  </Form.Group>
                </Col>
                {advertiserData.public_video_url && (
                  <Col xs={12} md={6} className="mb-3">
                    <Col md={11} xs={11}>
                      <video width="100%" controls ref={videoRef} key={advertiserData.public_video_url}>
                        <source src={advertiserData.public_video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </Col>
                  </Col>
                )}
              </Row>}


            {/* Special Range Section */}
            <Row className="mb-3">
              <Col xs={12} className="p-2 mt-3">
                <span className="mb-1">Banner Special Time Image</span>
              </Col>
              <Col md={6} xs={12} className='p-2'>
                {/* Date Input Groups */}
                <InputGroup className="mb-2">
                  <InputGroup.Text style={{ width: '6em' }}>Start Date:</InputGroup.Text>
                  <FormControl type="date" min={todayDate} value={newRange.start_date} onChange={(e) => setNewRange({ ...newRange, start_date: e.target.value })} />
                </InputGroup>
                <InputGroup className="mb-2">
                  <InputGroup.Text style={{ width: '6em' }}>End Date:</InputGroup.Text>
                  <FormControl type="date" min={newRange.start_date || todayDate} value={newRange.end_date} onChange={(e) => setNewRange({ ...newRange, end_date: e.target.value })} />
                </InputGroup>
                <Form.Group controlId="specialRangeFile" className="mb-3">
                  <Form.Label style={{ margin: 0, fontSize: '0.8em' }}>Upload Image <small><b>1080px (w) x 346px (h)</b></small></Form.Label>
                  <Form.Control type="file" onChange={handleSpecialImageUpload} accept="image/*" />
                </Form.Group>
                <Form.Group controlId="objectFit" style={{ direction: "rtl" }}>
                  <button onClick={handleRangeAddition} className='genenric-button'>Save</button>
                </Form.Group>
              </Col>
              {newRange.public_image_url && (
                <Col md={6} xs={12}>
                  <Col md={11} xs={11}>
                    <div style={imageContainerStyle}>
                      <img src={newRange.public_image_url} alt="Preview" style={imageStyle} />
                    </div>
                  </Col>
                </Col>
              )}
            </Row>

            {/* Displaying Special Ranges */}
            <Row className="mt-5">
              {advertiserData.specials.map((range, index) => (
                <Row key={index} className="mb-3 align-items-center">
                  <Col md={6} xs={12} className="p-2">
                    {/* Display range information */}
                    <InputGroup className="mb-2">
                      <InputGroup.Text style={{ width: '6em' }}>Start Date:</InputGroup.Text>
                      <FormControl type="date" value={range.start_date} readOnly />
                    </InputGroup>
                    <InputGroup className="mb-2">
                      <InputGroup.Text style={{ width: '6em' }}>End Date:</InputGroup.Text>
                      <FormControl type="date" value={range.end_date} readOnly />
                    </InputGroup>
                    <InputGroup style={{ direction: "rtl" }}>
                      <button onClick={() => handleRangeDeletion(index)} className='genenric-button-red'>Delete</button>
                    </InputGroup>
                  </Col>
                  <Col md={6} xs={12}>
                    <Col md={11} xs={11}>
                      {range.public_image_url && (
                        <div style={imageContainerStyle}>
                          <img src={range.public_image_url} alt="Preview" style={imageStyle} />
                        </div>
                      )}
                    </Col>
                  </Col>
                </Row>
              ))}
            </Row>
          </Container></div>}
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

export default Adlanding;