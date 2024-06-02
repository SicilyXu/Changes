import React, { useContext } from 'react';
import { Row, Col, Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import AppContext from '../context/AppContext';


function DetailIndex({ details, setDetails, handleback }) {

  const { uploadImage, uploadHotel } = useContext(AppContext);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });

  }


  const updateBrandImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const s3PublicAddress = await uploadImage(file, "(1080, 460)");
      if (s3PublicAddress) {
        const localAddress = s3PublicAddress.substring(s3PublicAddress.lastIndexOf('/') + 1);
        setDetails((prevDetails) => {
          return {
            ...prevDetails,
            public_image_url: s3PublicAddress,
            private_image_url: localAddress
          };
        });
      }
    }
  }

  return (<>
    {details &&
      <>
        <Row>
          <Col md={6} xs={12}>
            <Form>
              <FormGroup className="mb-3">
                <FormLabel>Name  <span style={{ fontSize: "0.6rem" }}>{details.name.length}/40</span></FormLabel>
                <FormControl
                  type="text"
                  name="name"
                  value={details.name}
                  onChange={handleChange}
                  maxLength={40}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Brand Image</FormLabel>
                <FormControl
                  type="file"
                  onChange={(e) => updateBrandImage(e, 'brand')}
                  accept="image/*"
                />
                <img src={details.public_image_url} width="50%" style={{ aspectRatio: '1.33' }} alt="brand" />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={6} >
            &nbsp;</Col>
          <Col md={6} className='mt-3 mb-3'>
            <button onClick={() => { uploadHotel(); handleback(); }} className='w-100 genenric-button '> Save & Update</button>
          </Col>
        </Row>
      </>
    }
  </>)
}

export default DetailIndex;