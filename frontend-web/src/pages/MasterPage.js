import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import './MasterPage.css'
import { useNavigate } from 'react-router-dom';


const MasterPage = () => {
    const navigate = useNavigate();
    const [activeHotel, setActiveHotel] = useState(null);

    useEffect(() => {
        let isScrolled = false;
        const handleFirstScroll = () => {
            if (!isScrolled) {
                isScrolled = true;
                const targetElement = document.querySelector('.present-header');
                if (targetElement) {
                    const topPos = targetElement.offsetTop;
                    window.scrollTo({ top: topPos, behavior: 'smooth' });
                }
                window.removeEventListener('scroll', handleFirstScroll);
            }
        };
        window.addEventListener('scroll', handleFirstScroll);
        return () => window.removeEventListener('scroll', handleFirstScroll);
    }, []);

    const handleHotelClick = (hotelId) => {
        setActiveHotel(hotelId);
        setTimeout(() => {
            navigate(`/hotel/?hotel_id=${hotelId}`);
        }, 1000);
    };

    return (
        <div style={{ color: "#ffffff" }} >
            <div className="head-image" style={{ borderBottom: '0.1rem solid rgb(168, 145, 66)' }}>
                <img src={`${process.env.PUBLIC_URL}/master_1.png`} alt="headplace" />
                <div className="text-bottom-left">
                    <p>Your Content.</p>
                    <p>Your Control.</p>
                </div>
                <div className="icon-top-right">
                    <img src={`${process.env.PUBLIC_URL}/master_4.png`}
                        style={{ width: '10rem' }} alt="pladdypushead" />
                </div>
            </div>


            <Row className="justify-content-center present-header">
                <img src={`${process.env.PUBLIC_URL}/master_3.png`} alt="Digital Concierge" className="img-fluid"
                    style={{ padding: "1.2rem 2.5rem" }} />

                <Col xs={7} className="text-left left-text" style={{ paddingBottom: '3rem' }}>
                    <p style={{ fontWeight: "600" }}>
                        Touchscreen <br />
                        Interactive <br />
                        Displays for <br />
                    </p>
                    <p style={{ color: "rgb(38, 63, 252)", fontWeight: "900" }}>
                        Hotels, Airports, <br />
                        FIFO Camps, <br />
                        Corporate Offices, <br />
                        Health Facilities, <br />
                        Schools & more!
                    </p>
                </Col>
                <Col xs={5}>&nbsp;</Col>
            </Row>
            <Row className="position-relative text-center" style={{ height: "0" }}>
                <img
                    src={`${process.env.PUBLIC_URL}/master_2.png`}
                    alt="Interactive Display"
                    className="img-fluid position-absolute present-img"
                    style={{
                        top: '50%',
                        left: '50%',
                        zIndex: '99'
                    }}
                />
            </Row>
            <Row className="position-relative text-center" style={{ height: "0" }}>
                <img
                    src={`${process.env.PUBLIC_URL}/holidayinn.webp`}
                    alt="Interactive Display2"
                    className="img-fluid  position-absolute present-img2"
                    style={{
                        top: '50%',
                        left: '50%',
                        zIndex: '99',
                    }}
                />
            </Row>

            <Row className="justify-content-center present-footer">
                <Col xs={6} className="text-left left-text">
                    <p style={{ fontSize: '1.95rem' }}>
                        YOU CAN DISPLAY
                    </p>
                    <p style={{ fontWeight: "600" }}>
                        • Your Information <br />
                        • Promote Events / Deals<br />
                        • Flight Information<br />
                        • Advertising Options<br />
                        • Weather<br />
                        • Local Information
                    </p>
                </Col>
                <Col xs={6} style={{ zIndex: '99' }}>
                    &nbsp;
                </Col>
            </Row>
            <Row className='demo-show'>
                <div className='main-show' style={{ flexShrink: "1" }}>
                    <p>CLIENT EXAMPLES</p>
                    <div className='d-flex'>
                        <Col xs={4} className='d-flex flex-column'>
                            <div className={`img-container ${activeHotel === "crown_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("crown_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/crown.webp`} alt="crown" className="img-fluid img-hotel" style={{ transform: "scale(0.9)" }} />
                            </div>
                            <div className={`img-container ${activeHotel === "stanley_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("stanley_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/stanley.webp`} alt="stanley" className="img-fluid img-hotel" style={{ transform: "scale(1.1)" }} />
                            </div>
                            <div className={`img-container ${activeHotel === "grandpapua_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("grand_papua_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/grandpapua.webp`} alt="grandpapua" className="img-fluid img-hotel" style={{ transform: "scale(1.15)" }} />
                            </div>
                            <div className={`img-container ${activeHotel === "highlander_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("highlander_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/highlander.webp`} alt="highlander" className="img-fluid img-hotel" style={{ transform: "scale(0.9)" }} />
                            </div>
                        </Col>
                        <Col xs={4} className='d-flex flex-column'>
                            <div className={`img-container ${activeHotel === "loloata_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("loloata_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/loloata.webp`} alt="loloata" className="img-fluid img-hotel" style={{ transform: "scale(0.8)" }} />
                            </div>
                            <div className={`img-container ${activeHotel === "holidayinn_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("holiday_inn_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/holidayinn.webp`} alt="holidayinn" className="img-fluid img-hotel" style={{ transform: "scale(0.8)" }} />
                            </div>
                            <div className={`img-container ${activeHotel === "gateway_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("gateway_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/gateway.webp`} alt="gateway" className="img-fluid img-hotel" style={{ transform: "scale(0.9)" }} />
                            </div>
                            <div className={`img-container ${activeHotel === "bird_of_paradise_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("bird_of_paradise_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/birdofparadise.webp`} alt="birdofparadise" className="img-fluid img-hotel" style={{ transform: "scale(0.9)" }} />
                            </div>
                        </Col>
                        <Col xs={4} className='d-flex flex-column'>
                            <div className={`img-container ${activeHotel === "hilton_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("hilton_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/hilton.webp`} alt="hilton" className="img-fluid img-hotel" style={{ transform: "translateY(-1rem)" }} />
                            </div>
                            <div className={`img-container ${activeHotel === "holidayexpress_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("holiday_inn_express_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/holidayexpress.webp`} alt="holidayexpress" className="img-fluid img-hotel" style={{}} /> {/* 如果这里没有特定的transform，可以省略style属性 */}
                            </div>
                            <div className={`img-container ${activeHotel === "elabeach_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("ela_beach_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/elabeach.webp`} alt="elabeach" className="img-fluid img-hotel" style={{ transform: "scale(0.9)" }} />
                            </div>
                            <div className={`img-container ${activeHotel === "huon_gulf_hotel" ? "animate" : ""}`} onClick={() => handleHotelClick("huon_gulf_hotel")}>
                                <img src={`${process.env.PUBLIC_URL}/huongulf.webp`} alt="huongulf" className="img-fluid img-hotel" style={{ transform: "scale(0.9)" }} />
                            </div>
                        </Col>
                    </div>
                </div>


            </Row>
            <Row className='advertiser-place'>
                <span className='header'>With more on the way!</span>
                <Col xs={6} style={{ height: '20rem' }}>
                    <img src={`${process.env.PUBLIC_URL}/master_5.png`} alt='adv-left'
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </Col>
                <Col xs={6} style={{ height: '20rem' }}>
                    <img src={`${process.env.PUBLIC_URL}/master_6.png`} alt='adv-left'
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </Col>
                <span className='footer'>CONTACT&nbsp;&nbsp;US</span>
                <Row className='d-flex align-items-center justify-content-around'
                    style={{ paddingLeft: '6rem', paddingRight: '4rem', marginBottom: '3rem' }}>
                    <Col xs={3} >
                        Jarrod La Canna <br />
                        D: 7109 6841 <br />
                        B: 7659 8821 <br />
                        E: jarrod@johnbatman.com.au <br />
                    </Col>
                    <Col xs={5} className='d-flex justify-content-center align-items-center'
                        style={{
                            borderRight: '0.1rem solid rgb(168, 145, 66)',
                            borderLeft: '0.1rem solid rgb(168, 145, 66)'
                        }}>
                        JBG Hospitality Publications <br />
                        & Supplies PNG Ltd<br />
                        Section 36, Lot 03, Lawes Road, Konedobu<br />
                        PO Box 3058 Boroko, NCD, Papua New Guinea<br />
                        Tel: +675 321 8588<br />
                        emait: info@jbg.com.pg
                    </Col>
                    <Col xs={4} className='d-flex justify-content-center align-items-center flex-column'>
                        <img src={`${process.env.PUBLIC_URL}/master_QR.png`} alt="QR" style={{ width: '8rem' }} />
                        <span style={{ paddingTop: '0.5rem', letterSpacing: "0.1rem" }}>info@pladdypus.com</span>
                    </Col>
                </Row>
            </Row>
            <Row style={{ backgroundColor: "rgb(38, 63,252)", padding: '1rem 2rem' }}
                className='d-flex justify-content-center align-items-center'>
                <Col xs={4}>
                    <img src={`${process.env.PUBLIC_URL}/master_7.png`} alt="pladdypus icon"
                        className="img-fluid" style={{ transform: "scale(0.9, 0.9)" }} />
                </Col>
                <Col xs={4}>
                    <img src={`${process.env.PUBLIC_URL}/master_8.png`} alt="JBG icon"
                        className="img-fluid" style={{ transform: "scale(1.4, 1.4)" }} />
                </Col>
                <Col xs={4}>
                    <img src={`${process.env.PUBLIC_URL}/master_9.png`} alt="John Batman Group icon"
                        className="img-fluid" style={{ transform: "scale(0.7, 0.7)" }} />
                </Col>
            </Row>
        </div>
    );
};


export default MasterPage;
