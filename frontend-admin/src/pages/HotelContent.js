import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Form, Button, FormGroup, FormControl, FormLabel, Carousel } from 'react-bootstrap';
import AppContext from '../context/AppContext';
import './RealPageMock.css';
// todo hoteldata-> details -> selectedDetail. 但是反向更新有问题
function HotelContent() {
  const [details, setDetails] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [selectedDetail, setSelectedDetail] = useState();
  const { uploadImage, hotelData, setHotelData, uploadHotel } = useContext(AppContext);
  const [hasNewContent, setHasNewContent] = useState(false);


  // 把hotelData赋值给details
  useEffect(() => {
    if (hotelData && details === null) {
      setDetails(hotelData.attributes.attributes);
    }
  }, [hotelData, details])

  // 把details 反向更新给hotelData
  useEffect(() => {
    if (details !== null) {
      setHotelData((preData) => ({
        ...preData,
        attributes: {
          ...preData.attributes,
          attributes: details
        }
      }))
    }

  }, [details, setHotelData])

  //把 selectedDetail 反向更新给details
  useEffect(() => {
    if (selectedId && selectedDetail) {
      setDetails(preData => {
        preData.map((hotelCategory) => {
          let updatedCategory = hotelCategory;
          if (hotelCategory.global_id === selectedId.substring(0, 4) + "0000") {
            updatedCategory.attributes = hotelCategory.attributes.map((hotelContent) => {
              if (hotelContent.global_id === selectedId) {
                hotelContent = selectedDetail;
              }
              return hotelContent
            })
          }
          return updatedCategory
        })
        return [...preData]
      })
    }
  }, [selectedId, selectedDetail])

  // 触发上传操作
  useEffect(() => {
    if (hasNewContent) {
      uploadHotel();
      setHasNewContent(false);
    }
  }, [hasNewContent, uploadHotel, details, setHotelData])

  const handleChange = (e) => {
    setSelectedDetail({ ...selectedDetail, [e.target.name]: e.target.value });
  };

  // 递归生成所有选项（包括子属性）
  const generateAllOptions = (attributes, level = 0) => {
    let options = [];
    attributes.forEach((attribute) => {
      if (level) {
        options.push(
          <option key={attribute.global_id} value={attribute.global_id} >
            {'—'.repeat(level) + attribute.name}
          </option>
        );
      } else {
        options.push(
          <option key={attribute.global_id} value={attribute.global_id} disabled >
            {'—'.repeat(level) + attribute.name}
          </option>
        );
      }

      if (attribute.attributes && attribute.attributes.length > 0) {
        options = options.concat(generateAllOptions(attribute.attributes, level + 1));
      }
    });
    return options;
  };

  const handleSelectId = (e) => {
    setSelectedId(e)
    setSelectedDetail(details.find(data => data.global_id === e.substring(0, 4) + "0000").attributes.find(data => data.global_id === e));
  }

  const updateBrandImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const s3PublicAddress = await uploadImage(file, "(206, 152)");
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setSelectedDetail((prevDetails) => {
          return {
            ...prevDetails,
            public_brand_url: s3PublicAddress,
            private_brand_url: localAddress
          };
        });
      }
    }
  }


  // 删除Carousel中的某张图片
  const removeCarouselImage = (index) => {
    const updatedPublicImageUrls = [...selectedDetail.public_image_urls];
    const updatedPrivateImageUrls = [...selectedDetail.private_image_urls];
    updatedPublicImageUrls.splice(index, 1);
    updatedPrivateImageUrls.splice(index, 1);

    const updatedDetail = {
      ...selectedDetail,
      public_image_urls: updatedPublicImageUrls,
      private_image_urls: updatedPrivateImageUrls,
    };

    setSelectedDetail(updatedDetail);
    // 更新整个details数组
    updateDetailsArray(updatedDetail);
  };

  // 添加新的Carousel图片
  const addCarouselImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const s3PublicAddress = await uploadImage(file, "(925, 423)");
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        const updatedDetail = {
          ...selectedDetail,
          public_image_urls: [...selectedDetail.public_image_urls, s3PublicAddress],
          private_image_urls: [...selectedDetail.private_image_urls, localAddress],
        };

        setSelectedDetail(updatedDetail);
        // 更新整个details数组
        updateDetailsArray(updatedDetail);
      }
    }
  };

  // 上移Carousel图片
  const carouselImageUp = (index) => {
    if (index === 0) return;
    const updatedPublicImages = [...selectedDetail.public_image_urls];
    const updatedPrivateImages = [...selectedDetail.private_image_urls];
    [updatedPublicImages[index], updatedPublicImages[index - 1]] = [updatedPublicImages[index - 1], updatedPublicImages[index]];
    [updatedPrivateImages[index], updatedPrivateImages[index - 1]] = [updatedPrivateImages[index - 1], updatedPrivateImages[index]];

    const updatedDetail = {
      ...selectedDetail,
      public_image_urls: updatedPublicImages,
      private_image_urls: updatedPrivateImages,
    };

    setSelectedDetail(updatedDetail);
    // 更新整个details数组
    updateDetailsArray(updatedDetail);
  };

  // 下移Carousel图片
  const carouselImageDown = (index) => {
    if (index >= selectedDetail.public_image_urls.length - 1) return;
    const updatedPublicImages = [...selectedDetail.public_image_urls];
    const updatedPrivateImages = [...selectedDetail.private_image_urls];
    [updatedPublicImages[index], updatedPublicImages[index + 1]] = [updatedPublicImages[index + 1], updatedPublicImages[index]];
    [updatedPrivateImages[index], updatedPrivateImages[index + 1]] = [updatedPrivateImages[index + 1], updatedPrivateImages[index]];

    const updatedDetail = {
      ...selectedDetail,
      public_image_urls: updatedPublicImages,
      private_image_urls: updatedPrivateImages,
    };

    setSelectedDetail(updatedDetail);
    // 更新整个details数组
    updateDetailsArray(updatedDetail);
  };

  // 更新整个details状态
  const updateDetailsArray = (updatedDetail) => {
    // 首先，找到要更新的主要项的索引
    const mainIndex = details.findIndex(item => item.global_id === updatedDetail.global_id.substring(0, 4) + "0000");
    // 如果没有找到对应的项，直接返回
    if (mainIndex === -1) return;
    // 深拷贝 details 以避免直接修改状态
    const newDetails = JSON.parse(JSON.stringify(details));
    // 接下来，找到属性数组中要更新的项的索引
    const attrIndex = newDetails[mainIndex].attributes.findIndex(item => item.global_id === updatedDetail.global_id);
    // 如果也找到了属性项，则替换它
    if (attrIndex !== -1) {
      newDetails[mainIndex].attributes[attrIndex] = updatedDetail;
    }
    // 最后，使用新的数组设置 details 状态
    setDetails(newDetails);
  };





  return (
    <Row style={{ margin: 0 }}>
      <Col md={6} xs={12} style={{ position: "relative" }}>
        {/* 展示区，根据selectedDetail来动态展示内容 */}
        {selectedDetail && (
          <div className="advertiser-display" style={{ position: "relative", display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid black' }}>
            {/* Carousel 或单张图片 */}
            <div className="content-image" style={{ width: '100%', aspectRatio: '2.19' }}>
              {selectedDetail.public_image_urls.length > 1 ? (
                <Carousel interval={5000} pause={false}>
                  {selectedDetail.public_image_urls.map((url, index) => (
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
                  src={selectedDetail.public_image_urls[0]}
                  alt={`${selectedDetail.name}`}
                  style={{ objectFit: 'cover', aspectRatio: '2.19' }}
                />
              )}
            </div>

            {/* Brand URL */}

            <div className='content-title' style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>

              <span style={{ height: 0 }}>
                {!selectedDetail.custom_actions.includes("no-brand-picture") &&
                  <img src={selectedDetail.public_brand_url} alt="Brand" className='brand-img' />
                }
              </span>
              <span className='brand-name'>{selectedDetail.name}</span>
            </div>


            {/* Descriptions */}
            <div className='content-list' style={{ display: 'flex' }}>
              <div className='content-content' style={{ borderRight: '1px solid', whiteSpace: 'pre-wrap', width: '50%' }}>
                {selectedDetail.left_description}
              </div>
              <div className='content-content' style={{ whiteSpace: 'pre-wrap', width: '50%' }}>
                {selectedDetail.right_description}
                {Object.keys(selectedDetail.QR).length !== 0 && <div >
                  <br />
                  {selectedDetail.QR.name ? <span>{selectedDetail.QR.name}</span> : <span>More info in QR:</span>}
                  <img
                    className="d-block w-50 "
                    src={selectedDetail.QR.public_url}
                    alt={selectedDetail.QR.name}
                    style={{ objectFit: 'cover', aspectRatio: '1', margin: '0 auto' }}
                  />
                  <br />
                </div>}
              </div>

            </div>
          </div>
        )}
      </Col>
      <Col md={6} xs={12}>
        {/* 下拉选择区 */}
        {details &&
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Choose a Tab to Edit</Form.Label>
              <Form.Control as="select" value={selectedId} onChange={e => handleSelectId(e.target.value)}>
                <option value="">Select a Tab</option>
                {generateAllOptions(details)}
              </Form.Control>
            </Form.Group>
            {selectedId !== "" &&
              <>
                <FormGroup className="mb-3">
                  <FormLabel>Name  <span style={{ fontSize: "0.6rem" }}>{selectedDetail.name.length}/50</span></FormLabel>
                  <FormControl
                    type="text"
                    name="name"
                    value={selectedDetail.name}
                    onChange={handleChange}
                    maxLength={50}
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <FormLabel>Carousel Images</FormLabel>
                  <FormControl
                    type="file"
                    onChange={addCarouselImage}
                    accept="image/*"
                  />
                  <div className="carousel-thumbnails">
                    {selectedDetail.public_image_urls.map((url, index) => (
                      <div key={index} className="carousel-thumbnail d-flex justify-content-between align-items-center">
                        <img src={url} alt={`Carousel ${index}`} width="40%" style={{ aspectRatio: '2.13' }} />
                        {selectedDetail.public_image_urls.length !== 1 && <span style={{ maxWidth: '25%' }}>
                          <img src={`${process.env.PUBLIC_URL}/icons8-up.png`} onClick={() => carouselImageUp(index)} width="25%" style={{ cursor: "pointer", border: "1px solid green", borderRadius: '50%' }} className="me-1" alt="Up" />
                          <img src={`${process.env.PUBLIC_URL}/icons8-down.png`} onClick={() => carouselImageDown(index)} width="25%" style={{ cursor: "pointer", border: "1px solid red", borderRadius: '50%' }} className="me-1" alt="Down" />
                          <img src={`${process.env.PUBLIC_URL}/icons8-delete.png`} onClick={() => removeCarouselImage(index)} width="25%" style={{ cursor: "pointer", border: "1px solid teal", borderRadius: '50%' }} className="me-1" alt="Delete" />
                        </span>}
                      </div>
                    ))}
                  </div>
                </FormGroup>
                <FormGroup className='mt-3'>
                  <Form.Check
                    type="switch"
                    id="brand-image-switch"
                    label={selectedDetail.custom_actions.includes("no-brand-picture") ? "Show Brand Image" : "Hide Brand Image"}
                    checked={!selectedDetail.custom_actions.includes("no-brand-picture")}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedDetail((prevDetails) => {
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

                {!selectedDetail.custom_actions.includes("no-brand-picture") && <FormGroup>
                  <FormControl
                    type="file"
                    onChange={(e) => updateBrandImage(e, 'brand')}
                    accept="image/*"
                  />
                </FormGroup>}
                <FormGroup className="mb-3 mt-3">
                  <FormLabel>Left Description <span style={{ fontSize: "0.6rem" }}>{selectedDetail.left_description.length}/1500</span></FormLabel>
                  <FormControl
                    as="textarea"
                    rows={4}
                    type="text"
                    name="left_description"
                    value={selectedDetail.left_description}
                    onChange={handleChange}
                    maxLength={1500}
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <FormLabel>Right Description <span style={{ fontSize: "0.6rem" }}>{selectedDetail.right_description.length}/1500</span></FormLabel>
                  <FormControl
                    as="textarea"
                    rows={4}
                    type="text"
                    name="right_description"
                    value={selectedDetail.right_description}
                    onChange={handleChange}
                    maxLength={1500}
                  />
                </FormGroup>
                {/* <FormGroup className='mt-3'>
                  <Form.Check
                    type="switch"
                    id="QR-switch"
                    label={Object.keys(selectedDetail.QR).length !== 0  ? "Show QR" : "Hide QR"}
                    checked={Object.keys(selectedDetail.QR).length !== 0}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedDetail((prevDetails) => {
                        let updatedQR = prevDetails.QR;
                        if (checked){
                          updatedQR = {"name":"","name_zh":"","name_fr":"","private_url":"","public_url":""}
                        }else{
                          updatedQR = {}
                        }
                        return{...prevDetails, QR:updatedQR}
                      })
                    }}
                  />
                </FormGroup> */}
                <Button variant="primary" className='w-100 mt-3' onClick={() => { setHasNewContent(true) }}>Save Changes</Button>
              </>
            }


          </Form>}
      </Col>
    </Row>
  );
}




export default HotelContent;