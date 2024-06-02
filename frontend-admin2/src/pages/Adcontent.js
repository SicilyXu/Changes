import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Form, FormGroup, FormControl, FormLabel, Modal, Spinner, Container } from 'react-bootstrap';
import AppContext from '../context/AppContext';


function AdContent() {
  const { uploadImage, advertiserData, setAdvertiserData, uploadAdvertisement } = useContext(AppContext);
  const [details, setDetails] = useState(null);
  const [isloading, setIsLoading] = useState(false);

  const [hasNewContent, setHasNewContent] = useState(false);

  useEffect(() => {
    if (advertiserData && details === null) {
      setDetails(advertiserData.attributes);
    }

  }, [advertiserData, details])

  useEffect(() => {
    setAdvertiserData((preData) => ({
      ...preData,
      attributes: details
    }))
  }, [details, setAdvertiserData])

  useEffect(() => {
    if (hasNewContent) {
      uploadAdvertisement();
      setHasNewContent(false);
    }
  }, [hasNewContent, uploadAdvertisement, details, setAdvertiserData])

  const updateBrandImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadImage(file, "(206, 152)");
      setIsLoading(false)
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
  const updateQRIamge = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true)
      const s3PublicAddress = await uploadImage(file, "(200, 200)");
      setIsLoading(false)
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setDetails((prevDetails) => {
          const newDetails = { ...prevDetails };
          if (prevDetails.QR || s3PublicAddress) {
            newDetails.QR = {
              ...newDetails.QR, // 保留其他可能存在的QR属性
              public_url: s3PublicAddress,
              private_url: localAddress
            };
          }
          return newDetails;
        });
      }
    }
  };


  // 删除Carousel中的某张图片
  const removeCarouselImage = (index) => {
    setDetails((prevDetails) => {
      const updatedImagesPublic = [...prevDetails.public_image_urls];
      const updatedImagesPrivate = [...prevDetails.private_image_urls]; // This should reference private_image_urls
      updatedImagesPublic.splice(index, 1);
      updatedImagesPrivate.splice(index, 1);
      return { ...prevDetails, public_image_urls: updatedImagesPublic, private_image_urls: updatedImagesPrivate };
    });
  };


  // 添加新的Carousel图片
  const addCarouselImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true)
      const s3PublicAddress = await uploadImage(file, "(925, 423)");
      setIsLoading(false)
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setDetails((prevDetails) => {
          return {
            ...prevDetails,
            public_image_urls: [...prevDetails.public_image_urls, s3PublicAddress],
            private_image_urls: [...prevDetails.private_image_urls, localAddress]
          };
        });
      }
    }
  };

  // Move carousel image up
  const carouselImageUp = (index) => {
    setDetails((prevDetails) => {
      if (index === 0) return prevDetails;
      const updatedPublicImages = [...prevDetails.public_image_urls];
      const updatedPrivateImages = [...prevDetails.private_image_urls];
      [updatedPublicImages[index], updatedPublicImages[index - 1]] = [updatedPublicImages[index - 1], updatedPublicImages[index]];
      [updatedPrivateImages[index], updatedPrivateImages[index - 1]] = [updatedPrivateImages[index - 1], updatedPrivateImages[index]];
      return { ...prevDetails, public_image_urls: updatedPublicImages, private_image_urls: updatedPrivateImages };
    });
  };


  // Move carousel image down
  const carouselImageDown = (index) => {
    setDetails((prevDetails) => {
      if (index === prevDetails.public_image_urls.length - 1) return prevDetails;
      const updatedPublicImages = [...prevDetails.public_image_urls];
      const updatedPrivateImages = [...prevDetails.private_image_urls];
      [updatedPublicImages[index], updatedPublicImages[index + 1]] = [updatedPublicImages[index + 1], updatedPublicImages[index]];
      [updatedPrivateImages[index], updatedPrivateImages[index + 1]] = [updatedPrivateImages[index + 1], updatedPrivateImages[index]];
      return { ...prevDetails, public_image_urls: updatedPublicImages, private_image_urls: updatedPrivateImages };
    });
  };



  // 删除Map中的某张图片
  const removeMapImage = (index) => {
    setDetails((prevDetails) => {
      const updatedMapsPublic = [...prevDetails.map_urls]; // 公共URLs
      updatedMapsPublic.splice(index, 1);
      return { ...prevDetails, map_urls: updatedMapsPublic };
    });
  };


  const mapImageUp = (index) => {
    setDetails((prevDetails) => {
      if (index === 0) return prevDetails;
      const updatedMapsPublic = [...prevDetails.map_urls];
      [updatedMapsPublic[index], updatedMapsPublic[index - 1]] = [updatedMapsPublic[index - 1], updatedMapsPublic[index]];
      return { ...prevDetails, map_urls: updatedMapsPublic };
    });
  };


  const mapImageDown = (index) => {
    setDetails((prevDetails) => {
      if (index === prevDetails.map_urls.length - 1) return prevDetails;
      const updatedMapsPublic = [...prevDetails.map_urls];
      [updatedMapsPublic[index], updatedMapsPublic[index + 1]] = [updatedMapsPublic[index + 1], updatedMapsPublic[index]];
      return { ...prevDetails, map_urls: updatedMapsPublic };
    });
  };


  // 添加新的Map图片
  const addMapImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const s3PublicAddress = await uploadImage(file, "(1080, 846)");
      setIsLoading(false);
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1); // 从公共URL提取私有URL
        setDetails((prevDetails) => {
          console.log("map", prevDetails.map_urls);
          if (prevDetails.map_urls)
            return {
              ...prevDetails,
              map_urls: [...prevDetails.map_urls, { name: 'New Map', public_url: s3PublicAddress, private_url: localAddress }],
            };
          else
            return {
              ...prevDetails,
              map_urls: [{ name: 'New Map', public_url: s3PublicAddress, private_url: localAddress }],

            }
        });
      }
    }
  };


  const updateMapName = (name, index) => {
    setDetails((prevDetails) => {
      const updatedMaps = [...prevDetails.map_urls];
      updatedMaps[index] = { ...updatedMaps[index], name: name };
      return { ...prevDetails, map_urls: updatedMaps };
    });
  };




  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };


  return (
    <>

      {details && <Container style={{backgroundColor:'white'}}>
        <Row className='mt-1'>
          <Col md={6} xs={12} className='p-2'>
            <FormGroup className="mb-3">
              <FormLabel>Name  <span style={{ fontSize: "0.6rem" }}>{details.name.length}/50</span></FormLabel>
              <FormControl
                type="text"
                name="name"
                value={details.name}
                onChange={handleChange}
                maxLength={50}
              />
            </FormGroup>
            <FormGroup>
              <span>Brand Image</span>
              <Form.Check
                type="switch"
                id="brand-image-switch"
                label={details.custom_actions.includes("no-brand-picture") ? "Show Brand Image on Page" : "Hide Brand Image"}
                checked={details.custom_actions.includes("no-brand-picture")}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setDetails((prevDetails) => {
                    let updatedCustomActions = [...prevDetails.custom_actions];
                    if (checked) {
                      updatedCustomActions = "no-brand-picture";
                    } else {
                      updatedCustomActions = "";
                    }
                    return { ...prevDetails, custom_actions: updatedCustomActions };
                  });
                }}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormControl
                type="file"
                onChange={(e) => updateBrandImage(e, 'brand')}
                accept="image/*"
              />
              {details.custom_actions.includes("no-brand-picture") &&
                <img src={details.public_brand_url} alt="brand" width="60%" style={{ aspectRatio: '1.33' }} />
              }
            </FormGroup>
            {details.description && <FormGroup className="mb-3">
              <FormLabel>Description <span style={{ fontSize: "0.6rem" }}>{details.description.length}/80</span></FormLabel>
              <FormControl
                type="text"
                name="description"
                value={details.description}
                onChange={handleChange}
                maxLength={80}
              />
            </FormGroup>}
            <FormGroup className="mb-3">
              <FormLabel>Left Description <span style={{ fontSize: "0.6rem" }}>{details.left_description.length}/1000</span></FormLabel>
              <FormControl
                as="textarea"
                rows={4}
                type="text"
                name="left_description"
                value={details.left_description}
                onChange={handleChange}
                maxLength={1000}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Right Description <span style={{ fontSize: "0.6rem" }}>{details.right_description.length}/800</span></FormLabel>
              <FormControl
                as="textarea"
                rows={4}
                type="text"
                name="right_description"
                value={details.right_description}
                onChange={handleChange}
                maxLength={800}
              />
            </FormGroup>
            <FormGroup>
              <span>QR Image</span>
              <Form.Check
                type="switch"
                id="map-image-switch"
                label={Object.keys(details.QR).length !== 0 ? "Show QR Image" : "Hide QR Image"}
                checked={Object.keys(details.QR).length !== 0}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    setDetails((prevDetails) => {
                      return { ...prevDetails, QR: { name: "", private_url: "", public_url: "" } }
                    })
                  } else {
                    setDetails((prevDetails) => {
                      const newDetails = { ...prevDetails };
                      newDetails.QR = {};
                      return newDetails;
                    });
                  }
                }}
              />
            </FormGroup>
            {/* QR Image */}
            {Object.keys(details.QR).length !== 0 &&
              <FormGroup>
                <FormLabel>QR Image & description <span style={{ fontSize: "0.6rem" }}>{details.QR.name.length}/40</span></FormLabel>
                <FormControl
                  type="file"
                  onChange={(e) => updateQRIamge(e)}
                  accept="image/*"
                />
              </FormGroup>}

            {Object.keys(details.QR).length !== 0 &&
              <FormGroup className="mb-3">
                <FormControl
                  md="8"
                  type="text"
                  name="QRName"
                  value={details.QR ? details.QR.name : ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setDetails(prevDetails => {
                      const newQR = prevDetails.QR ? { ...prevDetails.QR, name: newValue } : { name: newValue, private_url: "", public_url: "" };
                      return { ...prevDetails, QR: newQR };
                    });
                  }}
                  maxLength={40}
                />
                <img src={details.QR.public_url} alt="QR" width="30%" style={{ aspectRatio: '1' }} />
              </FormGroup>}
          </Col>
          <Col md={6} xs={12} className='p-2'>
            {/* Carousel Images */}
            <FormGroup className="mb-3">
              <FormLabel>Carousel Images</FormLabel>
              <FormControl
                type="file"
                onChange={addCarouselImage}
                accept="image/*"
              />
              <div className="carousel-thumbnails">
                {details.public_image_urls.map((url, index) => (
                  <div key={index} className="carousel-thumbnail d-flex justify-content-between align-items-center">
                    <img src={url} alt={`Carousel ${index}`} width="50%" style={{ aspectRatio: '2.13' }} />
                    {details.public_image_urls.length !== 1 && <span>
                      <i className="bi bi-arrow-up-square p-1" style={{ cursor: "pointer" }} onClick={() => carouselImageUp(index)} alt="Up"></i>
                      <i className="bi bi-arrow-down-square p-1" style={{ cursor: "pointer" }} onClick={() => carouselImageDown(index)} alt="Down"></i>
                      <i className="bi bi-x-square p-1" style={{ cursor: "pointer" }} onClick={() => removeCarouselImage(index)}></i>
                    </span>}
                  </div>
                ))}
              </div>
            </FormGroup>
            {/* Map Images */}
            <FormGroup className="mb-3">
              <FormLabel>Map Images</FormLabel>
              <FormControl
                type="file"
                onChange={addMapImage}
                accept="image/*"
              />
              {details.map_urls && details.map_urls.map((map, index) => (
                <div key={index} className="map-thumbnail d-flex justify-content-between align-items-center">
                  <span style={{ maxWidth: '75%' }}>
                    <img src={map.public_url} alt={`Map ${index}`} width="40%" className='me-2' />
                    <input
                      type="text"
                      value={map.name || ""}
                      onChange={(e) => updateMapName(e.target.value, index)}
                      className="me-2"
                      maxLength={25}
                      style={{ maxWidth: "50%" }}
                    />
                  </span>
                  <span style={{ maxWidth: '25%' }}>
                    <i className="bi bi-arrow-up-square p-1" style={{ cursor: "pointer" }} onClick={() => mapImageUp(index)} alt="Up"></i>
                    <i className="bi bi-arrow-down-square p-1" style={{ cursor: "pointer" }} onClick={() => mapImageDown(index)} alt="Down"></i>
                    <i className="bi bi-x-square p-1" style={{ cursor: "pointer" }} onClick={() => removeMapImage(index)}></i>
                  </span>
                </div>
              ))}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} >
            &nbsp;</Col>
          <Col md={6} className='mt-3 mb-3'>
            <button onClick={() => { setHasNewContent(true) }} className='genenric-button w-100'>Save & Update</button>
          </Col>
        </Row>
      </Container>
      }

      <Modal show={isloading} centered size="sm">
        <Modal.Body className="text-center">
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AdContent;