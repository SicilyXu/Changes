import React, { useState, useContext } from 'react';
import { Modal, Spinner, Row, Col, Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import AppContext from '../context/AppContext';


function DetailContent({ details, setDetails, handleback }) {
  const { uploadImage, uploadHotel } = useContext(AppContext);
  const [isloading, setIsLoading] = useState(false);


  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });

  }

  const addCarouselImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadImage(file, "(925, 423)");
      setIsLoading(false);
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        let updatedDetail;
        if (details.public_image_urls) {
          updatedDetail = {
            ...details,
            public_image_urls: [...details.public_image_urls, s3PublicAddress],
            private_image_urls: [...details.private_image_urls, localAddress],
          };
        } else {
          updatedDetail = {
            ...details,
            public_image_urls: [s3PublicAddress],
            private_image_urls: [localAddress],
          };
        }
        setDetails(updatedDetail);
      }
    }
  }

  const carouselImageUp = (index) => {
    if (index === 0) return;
    const updatedPublicImages = [...details.public_image_urls];
    const updatedPrivateImages = [...details.private_image_urls];
    [updatedPublicImages[index], updatedPublicImages[index - 1]] = [updatedPublicImages[index - 1], updatedPublicImages[index]];
    [updatedPrivateImages[index], updatedPrivateImages[index - 1]] = [updatedPrivateImages[index - 1], updatedPrivateImages[index]];

    const updatedDetail = {
      ...details,
      public_image_urls: updatedPublicImages,
      private_image_urls: updatedPrivateImages,
    };

    setDetails(updatedDetail);
  };

  const carouselImageDown = (index) => {
    if (index >= details.public_image_urls.length - 1) return;
    const updatedPublicImages = [...details.public_image_urls];
    const updatedPrivateImages = [...details.private_image_urls];
    [updatedPublicImages[index], updatedPublicImages[index + 1]] = [updatedPublicImages[index + 1], updatedPublicImages[index]];
    [updatedPrivateImages[index], updatedPrivateImages[index + 1]] = [updatedPrivateImages[index + 1], updatedPrivateImages[index]];

    const updatedDetail = {
      ...details,
      public_image_urls: updatedPublicImages,
      private_image_urls: updatedPrivateImages,
    };

    setDetails(updatedDetail);
  };

  const removeCarouselImage = (index) => {
    const updatedPublicImageUrls = [...details.public_image_urls];
    const updatedPrivateImageUrls = [...details.private_image_urls];
    updatedPublicImageUrls.splice(index, 1);
    updatedPrivateImageUrls.splice(index, 1);

    const updatedDetail = {
      ...details,
      public_image_urls: updatedPublicImageUrls,
      private_image_urls: updatedPrivateImageUrls,
    };

    setDetails(updatedDetail);
  };

  const updateBrandImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadImage(file, "(206, 152)");
      setIsLoading(false);
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setDetails((prevDetails) => {
          return {
            ...prevDetails,
            public_brand_url: s3PublicAddress,
            private_brand_url: localAddress
          };
        });
      }
    }
  }

  const handleSave = () => {
    uploadHotel();
    handleback();
  }

  return (
    <>
      {details &&
        <>
          <Row className='mt-1'>
            <Col md={6} xs={12} className='p-2'>
              <FormGroup className="mb-3 ">
                <FormLabel>Name  <span style={{ fontSize: "0.6rem" }}>{details.name.length}/50</span></FormLabel>
                <FormControl
                  type="text"
                  name="name"
                  value={details.name}
                  onChange={handleChange}
                  maxLength={50}
                />
              </FormGroup>

              <FormGroup className='mb-3'>
                <Form.Check
                  type="switch"
                  id="brand-image-switch"
                  label={details.custom_actions.includes("no-brand-picture") ? "Hide Brand Image" : "Show Brand Image on Page"}
                  checked={!details.custom_actions.includes("no-brand-picture")}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setDetails((prevDetails) => {
                      let updatedCustomActions = prevDetails.custom_actions;
                      if (!checked) {
                        updatedCustomActions = "no-brand-picture";
                      } else {
                        updatedCustomActions = "";
                      }
                      return { ...prevDetails, custom_actions: updatedCustomActions };
                    });
                  }}
                />
              </FormGroup>
              {!details.custom_actions.includes("no-brand-picture") && <FormGroup>
                <FormControl
                  type="file"
                  onChange={(e) => updateBrandImage(e, 'brand')}
                  accept="image/*"
                />
                <img src={details.public_brand_url} width="60%" style={{ aspectRatio: '1.33' }} alt="brand" />
              </FormGroup>}
              <FormGroup className="mb-3 mt-3">
                <FormLabel>Left Description <span style={{ fontSize: "0.6rem" }}>{details.left_description.length}/1500</span></FormLabel>
                <FormControl
                  as="textarea"
                  rows={5}
                  type="text"
                  name="left_description"
                  value={details.left_description}
                  onChange={handleChange}
                  maxLength={1500}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Right Description <span style={{ fontSize: "0.6rem" }}>{details.right_description.length}/1500</span></FormLabel>
                <FormControl
                  as="textarea"
                  rows={5}
                  type="text"
                  name="right_description"
                  value={details.right_description}
                  onChange={handleChange}
                  maxLength={1500}
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={12} className='p-2'>
              <FormGroup className="mb-3">
                <FormLabel>Carousel Images</FormLabel>
                <FormControl
                  type="file"
                  onChange={addCarouselImage}
                  accept="image/*"
                />
                <div className="carousel-thumbnails">
                  {details.public_image_urls && details.public_image_urls.map((url, index) => (
                    <div key={index} className="carousel-thumbnail d-flex justify-content-between align-items-center">
                      <img src={url} alt={`Carousel ${index}`} width="60%" style={{ aspectRatio: '2.13' }} />
                      {details.public_image_urls.length !== 1 && <span style={{ maxWidth: '25%' }}>
                        <i className="bi bi-arrow-up-square p-1" style={{ cursor: "pointer" }} onClick={() => carouselImageUp(index)} alt="Up"></i>
                        <i className="bi bi-arrow-down-square p-1" style={{ cursor: "pointer" }} onClick={() => carouselImageDown(index)}
                          alt="Down"></i>
                        <i className="bi bi-x-square p-1" style={{ cursor: "pointer" }} onClick={() => removeCarouselImage(index)}></i>
                      </span>}
                    </div>
                  ))}
                </div>
              </FormGroup>

            </Col>

          </Row>
          <Row>
            <Col md={6} >
              &nbsp;</Col>
            <Col md={6} className='mt-3 mb-3'>
              <button onClick={handleSave} className='w-100 genenric-button '>Save & Update</button>
            </Col>
          </Row>
        </>
      }
      <Modal show={isloading} centered size="sm">
        <Modal.Body className="text-center">
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
    </>

  )
}

export default DetailContent;