import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Form, Button, FormGroup, FormControl, FormLabel, Carousel, Modal, Spinner } from 'react-bootstrap';
import AppContext from '../context/AppContext';
import './RealPageMock.css';


function AdvertiserContent() {
  const { uploadImage, advertiserData, setAdvertiserData, uploadAdvertisement } = useContext(AppContext);
  const [details, setDetails] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapName, setMapName] = useState('');
  const [mapUrl, setMapUrl] = useState('');
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
      const updatedMapsPrivate = [...prevDetails.map_private_urls];
      [updatedMapsPublic[index], updatedMapsPublic[index - 1]] = [updatedMapsPublic[index - 1], updatedMapsPublic[index]];
      [updatedMapsPrivate[index], updatedMapsPrivate[index - 1]] = [updatedMapsPrivate[index - 1], updatedMapsPrivate[index]];
      return { ...prevDetails, map_urls: updatedMapsPublic, map_private_urls: updatedMapsPrivate };
    });
  };


  const mapImageDown = (index) => {
    setDetails((prevDetails) => {
      if (index === prevDetails.map_urls.length - 1) return prevDetails;
      const updatedMapsPublic = [...prevDetails.map_urls];
      const updatedMapsPrivate = [...prevDetails.map_private_urls];
      [updatedMapsPublic[index], updatedMapsPublic[index + 1]] = [updatedMapsPublic[index + 1], updatedMapsPublic[index]];
      [updatedMapsPrivate[index], updatedMapsPrivate[index + 1]] = [updatedMapsPrivate[index + 1], updatedMapsPrivate[index]];
      return { ...prevDetails, map_urls: updatedMapsPublic, map_private_urls: updatedMapsPrivate };
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
          return {
            ...prevDetails,
            map_urls: [...prevDetails.map_urls, { name: 'New Map', public_url: s3PublicAddress, private_url: localAddress }],
          };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted data:', details);
    // 在这里添加数据提交逻辑
  };

  const handleMapClick = (name, url) => {
    setMapUrl(url);
    setMapName(name)
    setShowMap(true);
  };

  const hideMap = () => {
    setShowMap(false);
  };

  return (
    <>
      <Row style={{ margin: 0 }}>
        {/* 左侧展示区 */}
        {details && <Col md={6} xs={12} style={{}}>
          <div className="advertiser-display" style={{ position: "relative", display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid black' }}>
            {/* Carousel 或单张图片 */}
            <div className="content-image" style={{ width: '100%', }}>
              {details.public_image_urls.length > 1 ? (
                <Carousel interval={5000} pause={false}>
                  {details.public_image_urls.map((url, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100 h-100"
                        src={url}
                        alt={`carousel-item-${index}`}
                        style={{ objectFit: 'cover', width: '100%', aspectRatio: '2.19' }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <img
                  className="d-block w-100 single-image"
                  src={details.public_image_urls[0]}
                  alt={`${details.name}`}
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>

            {/* Brand URL */}

            <div className='content-title' style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
              <span style={{ height: 0 }}>
                {!details.custom_actions.includes("no-brand-picture") &&
                  <img src={details.public_brand_url} alt="Brand" className='brand-img' />
                }
              </span>
              <span className='brand-name'>{details.name}</span>
            </div>


            {/* Descriptions */}
            <div className='content-list' style={{ display: 'flex' }}>
              <div className='content-content' style={{ borderRight: '1px solid', whiteSpace: 'pre-wrap', width: '50%' }}>
                {details.left_description}
              </div>
              <div className='content-content' style={{ whiteSpace: 'pre-wrap', width: '50%' }}>
                {details.right_description}
                {details.map_urls && details.map_urls.length > 0 && details.map_urls.map((map, index) => (
                  <button className='btn-map'
                    onClick={() => handleMapClick(map.name ? map.name : details.name + " Map", map.public_url)}
                    key={index}> {map.name ? map.name : "See Map"}</button>
                ))}
                {Object.keys(details.QR).length !== 0 && <div >
                  <br />
                  {details.QR.name ? <span>{details.QR.name}</span> : <span>More info in QR:</span>}
                  <img
                    className="d-block w-50 "
                    src={details.QR.public_url}
                    alt={details.QR.name}
                    style={{ objectFit: 'cover', aspectRatio: '1', margin: '0 auto' }}
                  />
                  <br />
                </div>}
              </div>

            </div>

            {showMap && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '0',
                  right: '0',
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 100,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={() => hideMap()}
              >
                <div style={{
                  position: 'absolute',
                  top: 0
                }}>
                  <div className='d-flex justify-content-between align-items-center'
                    style={{
                      backgroundColor: "grey",
                      color: "white"
                    }}>
                    <span>&nbsp;</span>
                    <span>{mapName}</span>
                    <span>X&nbsp;</span>
                  </div>
                  <div className='map-content' style={{
                    overflow: 'hidden',
                    maxWidth: '100%',
                    maxHeight: '100vh',
                  }}>
                    <img
                      src={mapUrl}
                      alt="Map"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100vh',
                        objectFit: 'contain',
                        zIndex: 200,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className='d-flex justify-content-center align-items-center'
                    style={{
                      backgroundColor: "grey",
                      color: "white"
                    }}>
                    <span>Click Outside to Exit</span>
                  </div>
                </div>
              </div>
            )}
          </div>



        </Col>
        }

        {/* 右侧表单区 */}
        {details && <Col md={6} xs={12}>
          <Form onSubmit={handleSubmit}>
            {/* 表单元素 */}
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
                    <img src={url} alt={`Carousel ${index}`} width="40%" style={{ aspectRatio: '2.13' }} />
                    {details.public_image_urls.length !== 1 && <span style={{ maxWidth: '25%' }}>
                      <img src={`${process.env.PUBLIC_URL}/icons8-up.png`} onClick={() => carouselImageUp(index)} width="25%" style={{ cursor: "pointer", border: "1px solid green", borderRadius: '50%' }} className="me-1" alt="Up" />
                      <img src={`${process.env.PUBLIC_URL}/icons8-down.png`} onClick={() => carouselImageDown(index)} width="25%" style={{ cursor: "pointer", border: "1px solid red", borderRadius: '50%' }} className="me-1" alt="Down" />
                      <img src={`${process.env.PUBLIC_URL}/icons8-delete.png`} onClick={() => removeCarouselImage(index)} width="25%" style={{ cursor: "pointer", border: "1px solid teal", borderRadius: '50%' }} className="me-1" alt="Delete" />
                    </span>}
                  </div>
                ))}
              </div>
            </FormGroup>
            <FormGroup>
              <Form.Check
                type="switch"
                id="brand-image-switch"
                label={!details.custom_actions.includes("no-brand-picture") ? "Show Brand Image" : "Hide Brand Image"}
                checked={!details.custom_actions.includes("no-brand-picture")}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setDetails((prevDetails) => {
                    let updatedCustomActions = [...prevDetails.custom_actions];
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
            {details.custom_actions.includes("no-brand-picture") && <FormGroup>
              <FormControl
                type="file"
                onChange={(e) => updateBrandImage(e, 'brand')}
                accept="image/*"
              />
            </FormGroup>}

            <FormGroup className="mb-3 mt-3">
              <FormLabel>Name  <span style={{ fontSize: "0.6rem" }}>{details.name.length}/50</span></FormLabel>
              <FormControl
                type="text"
                name="name"
                value={details.name}
                onChange={handleChange}
                maxLength={50}
              />
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
            {/* Map Images */}
            {details.map_urls &&
              <FormGroup className="mb-3">
                <FormLabel>Map Images</FormLabel>
                <FormControl
                  type="file"
                  onChange={addMapImage}
                  accept="image/*"
                />
                {details.map_urls.map((map, index) => (
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
                    <span>
                      <img src={`${process.env.PUBLIC_URL}/icons8-up.png`} onClick={() => mapImageUp(index)} width="25%" style={{ cursor: "pointer", border: "1px solid green", borderRadius: '50%' }} className="me-1" alt="Up" />
                      <img src={`${process.env.PUBLIC_URL}/icons8-down.png`} onClick={() => mapImageDown(index)} width="25%" style={{ cursor: "pointer", border: "1px solid red", borderRadius: '50%' }} className="me-1" alt="Down" />
                      <img src={`${process.env.PUBLIC_URL}/icons8-delete.png`} onClick={() => removeMapImage(index)} width="25%" style={{ cursor: "pointer", border: "1px solid teal", borderRadius: '50%' }} className="me-1" alt="Delete" />
                    </span>
                  </div>
                ))}
              </FormGroup>}
            <FormGroup>
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
              </FormGroup>}
            <Button variant="primary" className='w-100 mt-3' onClick={() => { setHasNewContent(true) }}>Save Changes</Button>
          </Form>
        </Col>}
      </Row>
      <Modal show={isloading} centered size="sm">
        <Modal.Body className="text-center">
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AdvertiserContent;
