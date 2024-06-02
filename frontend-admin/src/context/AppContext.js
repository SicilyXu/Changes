import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalInfo from './ModalInfo';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // all content data.
  const [id, setId] = useState("");
  const [advertiserData, setAdvertiserData] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [token, setToken] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [ModalMessage, setModalMessage] = useState({ "title": "", "content": "" })


  useEffect(() => {
    if (token) {
      let url;
      if (endpoint === "advertiser") {
        url = `${process.env.REACT_APP_API_BASE_URL}/GetAdvertiserlInfo/${id}/${token}`;
      }
      else if (endpoint === "hotel") {
        url = `${process.env.REACT_APP_API_BASE_URL}/GetHotelInfo/${id}/${token}`;
      }

      const headers = {
        'accept': 'application/json',
      };

      fetch(url, { method: 'GET', headers: headers })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (endpoint === "advertiser") {
            setAdvertiserData(data);
          } else if (endpoint === "hotel")
            setHotelData(data)
        })
        .catch(error => {
          console.error('There was a problem with your fetch operation:', error);
        });
    }
  }, [token, id, endpoint]);

  useEffect(() => {
    if (isTokenExpired()) {
      setToken(""); // 清除过期的token
      localStorage.removeItem('token');
      navigate("/login");
    } else {
      const tokenString = localStorage.getItem('token');
      const tokenObject = tokenString ? JSON.parse(tokenString) : null;
      if (tokenObject) {
        if (!(token || endpoint || email || id)) {
          //这是从storage放入session
          setToken(tokenObject.token);
          setEndpoint(tokenObject.endpoint);
          setEmail(tokenObject.email);
          setId(tokenObject.id);
        } else {
          const now = new Date();
          const item = {
            token: token,
            email: email,
            endpoint: endpoint,
            id: id,
            expiry: tokenObject.expiry || now.getTime() + 86400000, // 24 hours expire time
          };
          localStorage.setItem('token', JSON.stringify(item));
        }
      }

    }
  }, [token, email, endpoint, id, navigate]);

  const saveToken = (token, endpointTemp, emailTemp, idTemp) => {
    setToken(token);
    setEmail(emailTemp);
    setEndpoint(endpointTemp);
    setId(idTemp)
    const now = new Date();
    const item = {
      token: token,
      email: emailTemp,
      endpoint: endpointTemp,
      id: idTemp,
      expiry: now.getTime() + 86400000, // 24 hours expire time
    };
    localStorage.setItem('token', JSON.stringify(item));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setEmail("");
    setEndpoint("");
    setId("");
    setToken("");
    navigate("/login")
  }

  const isTokenExpired = () => {
    const tokenString = localStorage.getItem('token');
    const tokenObject = tokenString ? JSON.parse(tokenString) : null;

    if (!tokenObject) return true;

    const now = new Date();
    if (now.getTime() > tokenObject.expiry) {
      localStorage.removeItem('token');
      return true;
    }

    return false;
  };

  const uploadImage = async (file, targetSize, objectFit = 'fill') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('endpoint', endpoint);
    formData.append('token', token);
    formData.append('object_fit', objectFit);
    formData.append('target_size_input', targetSize); // (200, 100)

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/UploadFile/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.s3_url; // 根据API响应调整返回值
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('endpoint', endpoint);
    formData.append('token', token);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/UploadFile/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.s3_url; // 根据API响应调整返回值
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const uploadAdvertisement = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/ChangeAdvertiserInfo`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...advertiserData, token: token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShowModal(true);
      setModalMessage({ "title": "Success", "content": "Advertisement successfully changed" });
      return data
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  const uploadHotel = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/ChangeHotelInfo/`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...hotelData, token: token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setShowModal(true);
      setModalMessage({ "title": "Success", "content": "Hotel successfully changed" });
      return data
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }


  return (
    <AppContext.Provider value={{
      token,
      endpoint,
      email,
      advertiserData, hotelData,
      setAdvertiserData, setHotelData,
      uploadImage, uploadVideo,
      saveToken,
      logout,
      uploadAdvertisement,
      uploadHotel,
      setShowModal,setModalMessage
    }}>
      {children}
      <ModalInfo
        title={ModalMessage.title}
        show={showModal}
        handleClose={() => setShowModal(false)}
      >
        {ModalMessage.content}
      </ModalInfo>
    </AppContext.Provider>
  );
};

export default AppContext;
