import React, { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../context/AppContext.js';

const HomeContent = () => {
    const { hotelData, newsData, setSelectedService, handleServiceClick } = useContext(AppContext);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(hotelData ? Math.floor(Math.random() * hotelData["landing"]["public_hotel_videos"].length) : 0);
    const [currentNewsDisplay, setCurrentNewsDisplay] = useState("");
    const liWidth = document.body.clientWidth;

    const videoRef = useRef(null);
    useEffect(() => {
        if (hotelData) {
            setCurrentVideoIndex(Math.floor(Math.random() * hotelData["landing"]["public_hotel_videos"].length))
        }
    }, [hotelData])

    // Handle the image carousel
    useEffect(() => {
        const imageTimer = setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotelData["landing"]["public_hotel_slides"].length);
        }, 3000); // Change image every 5 seconds

        return () => clearTimeout(imageTimer);
    }, [currentImageIndex, hotelData]);

    // Handle the video carousel


    // Effect to handle the video 'ended' event
    useEffect(() => {
        const videoElement = videoRef.current;

        let isCancelled = false;

        if (videoElement) {
            videoElement.src = `${hotelData["landing"]["public_hotel_videos"][currentVideoIndex]}`;

            videoElement.load();
            const playPromise = videoElement.play();

            if (playPromise instanceof Promise) {
                playPromise.then(() => {
                    if (isCancelled) {
                        videoElement.pause();
                    }
                }).catch(error => {
                    if (!isCancelled) {
                        console.error('Error attempting to play video:', error);
                    }
                });
            }
        }

        const handleVideoEnd = () => {
            if (!isCancelled) {
                setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % hotelData["landing"]["public_hotel_videos"].length);
            }
        };

        videoElement?.addEventListener('ended', handleVideoEnd);

        return () => {
            isCancelled = true;
            videoElement?.removeEventListener('ended', handleVideoEnd);
            videoElement?.pause();
        };
    }, [currentVideoIndex, hotelData]);



    useEffect(() => {
        if (newsData && newsData.length) {
            let currentIndex = 0;
            const updateDisplay = () => {
                setCurrentNewsDisplay(newsData[currentIndex].header);
                currentIndex = (currentIndex + 1) % newsData.length;
            }
            updateDisplay();
            const intervalId = setInterval(updateDisplay, 6000);
            return () => clearInterval(intervalId);
        }

    }, [newsData])


    const getSlideStyles = (index) => {
        const slidesLength = hotelData["landing"]["private_hotel_slides"].length;
        // 计算相对于当前图片索引的位置差
        let positionDifference = index - currentImageIndex;

        // 当从第一张滑动到最后一张时，特殊处理以实现无缝滑动
        if (index === 0 && currentImageIndex === slidesLength - 1) {
            positionDifference = 1;
        } else if (index === slidesLength - 1 && currentImageIndex === 0) {
            // 当从最后一张滑动回第一张时，特殊处理
            positionDifference = -1;
        }

        return {
            position: 'absolute',
            transition: 'all 1s ease-out',
            right: `${positionDifference * liWidth}px`, // 修改这里来控制滑动方向
            opacity: index === currentImageIndex ? 1 : 0,
            width: '100%',
            height: '100%'
        };
    };

    return (
        <div className="main-content" >
            <div className="header-nav-icon-selected align-items-center justify-content-center flip-animation" style={{ overflow: 'hidden', height: '3.4375rem', fontSize: '2rem', color: 'white', border: 0 }} key={currentNewsDisplay} onClick={() => { setSelectedService("News") }}>
                &nbsp;&nbsp;NEWS: {currentNewsDisplay}
            </div>
            {/* Image Carousel */}
            <div className="carousel" style={{ height: '19.5rem', overflow: 'hidden' }} onClick={() => {
                handleServiceClick({ name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' })
            }}>
                {hotelData && hotelData["landing"]["public_hotel_slides"].map((img, index) => (
                    <img key={index} style={getSlideStyles(index)}
                        src={`${img}`}
                        alt={index}
                    />
                ))}
            </div>

            {/* Video Player */}
            {hotelData &&
                <div className="video-player" >
                    <video
                        ref={videoRef}
                    >
                        <source
                            src={`${hotelData["landing"]["public_hotel_videos"][currentVideoIndex]}`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                </div>
            }

        </div>
    );
};

export default HomeContent;
