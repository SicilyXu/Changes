import React, { useState, useEffect, useContext } from 'react';
import { Carousel } from 'react-bootstrap';
import AppContext from '../context/AppContext.js';

const nameIdMap = [{ name: 'SERVICES', icon: 'services_icon.png', globalId: '01000000' },
{ name: 'MAPS', icon: 'maps_icon.png', globalId: '02000000' },
{ name: 'ACTIVITIES', icon: 'activities_icon.png', globalId: '03000000' },
{ name: 'DESTINATIONS', icon: 'destionations_icon.png', globalId: '04000000' },
{ name: 'EVENTS', icon: 'events_icon.png', globalId: '05000000' },
{ name: 'EATING OUT', icon: 'eating_out_icon.png', globalId: '06000000' },
{ name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' }]


const Footer = () => {
    const [images, setImages] = useState([]);
    const { setGlobalId, setSelectedService, services, setServices } = useContext(AppContext);

    useEffect(() => {
        const apiUrl = `${process.env.PUBLIC_URL}/data/advertisement.json`;
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setImages(data);
            })
    }, []);

    const handleAdvClick = (link_id) => {
        if (link_id) {
            setGlobalId(link_id);
            setSelectedService(nameIdMap.find(tempmap => tempmap.globalId === link_id.substring(0, 2) + '000000').name);
            // Reorder services to put the clicked service in the middle
            const index = services.findIndex(s => s.globalId === link_id.substring(0, 2) + '000000');
            console.log(index);
            const middleIndex = 3;
            if (index < middleIndex) {
                // Move selected service to the middle from start
                const firstHalf = services.slice(0, 4 + index);
                const secondHalf = services.slice(4 + index);
                setServices([...secondHalf, ...firstHalf,]);
            } else if (index > middleIndex) {
                // Move selected service to the middle from end
                const firstHalf = services.slice(0, index - 3);
                const secondHalf = services.slice(index - 3);
                setServices([...secondHalf, ...firstHalf]);
            }
            // If it's already in the middle, do nothing
        }
    }

    return (
        <footer>
            {images &&
                <Carousel interval={5000} pause={false} style={{width:'100%',height:'100%'}} indicators={false}>
                    {images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100 h-100"
                                src={`${process.env.PUBLIC_URL}/images/advertisement/${image.private_image_url}`}
                                alt={`carousel-item-${index}`}
                                style={{ objectFit: 'cover', width: '100%', height:'100%' }}
                                onClick={() => handleAdvClick(image.link_id)}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            }
        </footer>
    );
};

export default Footer;
