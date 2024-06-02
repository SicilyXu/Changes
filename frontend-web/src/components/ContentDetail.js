import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext.js';
import { Carousel } from 'react-bootstrap';

const ContentDetail = ({ globalId, setGlobalId }) => {
    const [content, setContent] = useState(null);
    const { generalData } = useContext(AppContext);

    const [showMap, setShowMap] = useState(false);
    const [mapName, setMapName] = useState('');
    const [mapUrl, setMapUrl] = useState('');

    useEffect(() => {
        if (globalId && globalId.substring(6, 8) !== "00") {
            const temp1 = generalData.find(data => data.global_id === globalId.substring(0, 2) + '000000');
            if (temp1.attributes_inner === 'sidebar' || !temp1.attributes_is_index) {
                setContent(temp1.attributes.find(data => data.global_id === globalId));
            } else {
                const temp2 = temp1.attributes.find(data => data.global_id === globalId.substring(0, 4) + '0000');
                if (temp2.attributes_inner === 'sidebar' ) {
                    setContent(temp2.attributes.find(data => data.global_id === globalId));
                } else {
                    const temp3 = temp2.attributes.find(data => data.global_id === globalId.substring(0, 6) + '00');
                    if (temp3.attributes_inner === 'sidebar' || !temp3.attributes_is_index) {
                        setContent(temp3.attributes.find(data => data.global_id === globalId));
                    }
                }
            }
        }
    }, [globalId, generalData])

    const handleMapClick = (name, url) => {
        setMapUrl(url);
        setMapName(name)
        setShowMap(true);
    };

    const hideMap = () => {
        setShowMap(false);
    };

    const backMap = () => {
        setGlobalId(globalId.substring(0, 6) + "00");
    }

    const handlePress = (e) => {
        let clientX, clientY;
        const imgElement = e.target;

        if (e.type === 'mousedown') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        const rect = imgElement.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        const originX = (offsetX / imgElement.clientWidth) * 100;
        const originY = (offsetY / imgElement.clientHeight) * 100;

        imgElement.style.transform = 'scale(3)';
        imgElement.style.transformOrigin = `${originX}% ${originY}%`;
    };

    const handlePressRelease = (e) => {
        // delete the zoom in process
        e.target.style.transform = 'none';
    };

    return (
        <>
            {content && !content.custom_actions.includes("map-only") && (
                <div className='d-flex flex-column h-100'>
                    <div className='content-image'>
                        {content.public_image_urls.length > 1 ?
                            <Carousel interval={5000} pause={false}>
                                {content.public_image_urls.map((url, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100 h-100"
                                            src={`${url}`}
                                            alt={`carousel-item-${index}`}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel> :
                            <img
                                className="d-block w-100 single-image"
                                src={`${content.public_image_urls[0]}`}
                                alt={`${content.name}`}
                            />
                        }
                    </div>
                    {content.public_brand_url && !(content.custom_actions.includes("no-brand-picture")) ?
                        <div className='content-title'>

                            <span style={{ height: 0 }}>
                                <img src={content.public_brand_url} alt={content} style={{ width: '12.5rem', height: '9.375rem', transform: "translateY(-7.5rem)", border: "0.3rem solid white", objectFit: 'fill' }} />
                            </span>

                            <span style={{ paddingLeft: "3.125rem" }}>{content.name}</span>
                        </div> :
                        <div className='content-title' style={{ justifyContent: 'center' }}>
                            {content.name}
                        </div>
                    }
                    <div className='content-list'>
                        <div className='content-content' style={{ borderRight: '1px solid' }}>
                            <span>{content.left_description + "\n"}</span>
                        </div>
                        <div className='content-content'>
                            <span> {content.right_description + "\n"}</span>
                            {content.map_urls && content.map_urls.length > 0 && content.map_urls.map((map, index) => (
                                <button className='btn-map' onClick={() => handleMapClick(map.name ? map.name : content.name + " map", map.public_url)} key={index}> {map.name ? map.name : "See Map"}</button>
                            ))}
                            {Object.keys(content.QR).length !== 0 && <div>
                                <br />
                                <p>{content.QR.name}</p>
                                <img
                                    className="d-block w-50 "
                                    src={content.QR.public_url}
                                    alt={content.QR.name}
                                    style={{ objectFit: 'cover' }}
                                />
                                <br />
                            </div>}
                        </div>
                    </div>
                    {showMap && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: '62.5rem',
                                height: '100vh',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 100
                            }}
                            onClick={() => hideMap()}
                        >
                            <div>
                                <div className='map-header'>
                                    <span>&nbsp;</span>
                                    <span>{mapName}</span>
                                    <span>X</span>
                                </div>
                                <div className='map-content' style={{
                                    overflow: 'hidden',
                                    width: '62.5rem',
                                    height: '48.94rem',
                                }}>
                                    <img
                                        src={mapUrl}
                                        alt="Map"
                                        style={{
                                            width: '62.5rem',
                                            height: '48.94rem',
                                            maxHeight: '48.94rem',
                                            margin: 'auto',
                                            top: '0',
                                            zIndex: 200,
                                        }}
                                        onTouchStart={handlePress} // touchscreen press
                                        onTouchEnd={handlePressRelease} // touchscreen back
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div className='map-footer'>
                                    <span>Long Press the Map to Enlarge</span>
                                    <span>Click Outside to Exit</span>
                                </div>
                            </div>

                        </div>
                    )}
                    <div className='content-wrapper'>&nbsp;</div>
                </div>

            )}
            {content && content.custom_actions.includes("map-only") && (
                <div className='d-flex flex-column h-100'>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '62.5rem',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 100
                        }}
                        onClick={() => backMap()}
                    >
                        <div>
                            <div className='map-header'>
                                <span>&nbsp;</span>
                                <span>{content.map_urls[0].name}</span>
                                <span>X</span>
                            </div>
                            <div className='map-content' style={{
                                overflow: 'hidden',
                                width: '62.5rem',
                                height: '48.94rem',
                            }}>
                                <img
                                    src={content.map_urls[0].public_url}
                                    alt="Map"
                                    style={{
                                        width: '62.5rem',
                                        height: '48.94rem',
                                        maxHeight: '48.94rem',
                                        margin: 'auto',
                                        top: '0',
                                        zIndex: 200,
                                    }}
                                    onTouchStart={handlePress} // touchscreen press
                                    onTouchEnd={handlePressRelease} // touchscreen back
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <div className='map-footer'>
                                <span>Long Press the Map to Enlarge</span>
                                <span>Click Outside to Exit</span>
                            </div>
                        </div>

                    </div>
                    <div className='content-wrapper'>&nbsp;</div>
                </div>

            )}
        </>
    );
};

export default ContentDetail;