import React, { useContext,useEffect } from 'react';
import Header from '../components/Header.js';
import HomeContent from '../components/HomeContent.js';
import GeneralContent from '../components/GeneralContent.js';
import NewsContent from '../components/NewsContent.js';
import FlightsContent from '../components/FlightsContent.js';
import Footer from '../components/Footer.js';
import AppContext from '../context/AppContext.js';
import { useSearchParams  } from 'react-router-dom';

const MainPage = () => {
    const { selectedService,setHotelId } = useContext(AppContext);
    const [searchParams] = useSearchParams(); // 使用useSearchParams获取查询参数
    const hotel_id = searchParams.get('hotel_id'); // 获取hotel_id查询参数

    useEffect(() => {
        setHotelId(hotel_id);
    }, [hotel_id, setHotelId]);
    function renderContent(selectedService) {
        switch (selectedService) {
            case "News":
                return <NewsContent />;
            case "Flights":
                return <FlightsContent />;
            default:
                return <GeneralContent />;
        }
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header />
            {selectedService ? renderContent(selectedService) : <HomeContent />}
            <Footer />
        </div>
    )
}

export default MainPage;
