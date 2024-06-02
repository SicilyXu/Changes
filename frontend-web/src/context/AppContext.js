import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
const AppContext = createContext();

const TIMER_REQUEST = 3 * 60 * 60; // time to query news/flights/weather in sec
const TIMER_REFRESH = 60; // time to refresh to main in sec
const TIMER_RELOAD = 2 * 60 * 60; // time to fully reload the project

export const AppProvider = ({ children }) => {

    const [hotelId,setHotelId] = useState("");
    const [theme, setTheme] = useState([]); // default theme
    const [selectedService, setSelectedService] = useState(null);
    const [flightsData, setFlightsData] = useState(null);
    const [newsData, setNewsData] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [globalId, setGlobalId] = useState("");
    const [generalData, setGeneralData] = useState(null);
    const [hotelData, setHotelData] = useState(null);
    const [services, setServices] = useState([
        { name: 'SERVICES', icon: 'services_icon.png', globalId: '01000000' },
        { name: 'MAPS', icon: 'maps_icon.png', globalId: '02000000' },
        { name: 'ACTIVITIES', icon: 'activities_icon.png', globalId: '03000000' },
        { name: 'DESTINATIONS', icon: 'destionations_icon.png', globalId: '04000000' },
        { name: 'EVENTS', icon: 'events_icon.png', globalId: '05000000' },
        { name: 'EATING OUT', icon: 'eating_out_icon.png', globalId: '06000000' },
        { name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' }
    ]);

    // set theme for the whole pages
    useEffect(() => {
        const root = document.documentElement;
        Object.keys(theme).forEach(key => {
            root.style.setProperty(key, theme[key]);
        });
    }, [theme]);

    // fetch all data 
    useEffect(() => {
        if (hotelId !== ""){
            const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}/GetAllItemsByHotelID/${hotelId}`;
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setGeneralData(data);
                    // console.log(data);
                })
            const hotelURL = `${process.env.REACT_APP_API_ENDPOINT}/GetHotelItemByID/${hotelId}`;
            fetch(hotelURL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setTheme(data["theme"])
                    data.landing.public_hotel_slides.unshift("https://jbg-touchscreen-cms-prod.s3.ap-southeast-2.amazonaws.com/general/jbg.jpg");
                    setHotelData(data);
                })
        }


    }, [hotelId]);

    // fetch three api data
    const fetchData = useCallback(() => {

        // Fetch Flights Data
        const fetchFlightsData = async () => {
            // helper function to sort flights data
            const updateData = (flightsDataRaw) => {
                const now = new Date();
                if (flightsDataRaw !== null) {
                    const updatedData = flightsDataRaw.filter(flight => {
                        const departureTime = new Date(flight.departure.estimated);
                        const arrivalTime = new Date(flight.arrival.estimated);
                        return departureTime > now && arrivalTime > now && flight.flight.iata !== null;
                    }).sort((a, b) => new Date(a.departure.estimated) - new Date(b.departure.estimated));

                    setFlightsData(updatedData);
                }
            };
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/flights`);
                if (!response.ok) throw new Error('Network response was not ok for flights');
                const flightsData = await response.json();
                updateData(flightsData);
                // Add any specific handling for flights data here
            } catch (error) {
                console.error('Fetch error for flights:', error);
                setTimeout(fetchFlightsData, 60000); // Retry after 1 minute
            }
        };

        // Fetch News Data
        const fetchNewsData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/news`);
                if (!response.ok) throw new Error('Network response was not ok for news');
                const newsData = await response.json();
                setNewsData(newsData);
                // Add any specific handling for news data here
            } catch (error) {
                console.error('Fetch error for news:', error);
                setTimeout(fetchNewsData, 60000);
            }
        };

        // Fetch Weather Data
        const fetchWeatherData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/weather`);
                if (!response.ok) throw new Error('Network response was not ok for weather');
                const weatherData = await response.json();
                setWeatherData(weatherData);
                // Add any specific handling for weather data here
            } catch (error) {
                console.error('Fetch error for weather:', error);
                setTimeout(fetchWeatherData, 60000); // Retry after 1 minute
            }
        };

        fetchFlightsData();
        fetchNewsData();
        fetchWeatherData();
    }, []);

    // Timer to back to main page
    const timerId = useRef(null);
    const backMainPage = useCallback(() => {
        handleServiceReset();
    }, []);
    const resetTimer = useCallback(() => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }
        if (selectedService !== null) {
            timerId.current = setTimeout(backMainPage, TIMER_REFRESH * 1000);
        }
    }, [selectedService, backMainPage]);

    const handleServiceClick = service => {
        setSelectedService(service.name);
        setGlobalId(service.globalId)

        // Reorder services to put the clicked service in the middle
        const index = services.findIndex(s => s.name === service.name);
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
    };

    const handleServiceReset = () => {
        setServices(
            [
                { name: 'SERVICES', icon: 'services_icon.png', globalId: '01000000' },
                { name: 'MAPS', icon: 'maps_icon.png', globalId: '02000000' },
                { name: 'ACTIVITIES', icon: 'activities_icon.png', globalId: '03000000' },
                { name: 'DESTINATIONS', icon: 'destionations_icon.png', globalId: '04000000' },
                { name: 'EVENTS', icon: 'events_icon.png', globalId: '05000000' },
                { name: 'EATING OUT', icon: 'eating_out_icon.png', globalId: '06000000' },
                { name: 'OUR HOTEL', icon: 'accomodation_icon.png', globalId: '07000000' }
            ]
        );
        setSelectedService(null);
        setGlobalId(null);
    }

    // return the page back to main if no action detected for 60s
    useEffect(() => {
        resetTimer();

        const handleUserActivity = () => resetTimer();
        window.addEventListener('mousemove', handleUserActivity);

        return () => {
            clearTimeout(timerId.current);
            window.removeEventListener('mousemove', handleUserActivity);
        };
    }, [resetTimer]);

    // make a new query to get weather/news/flights
    useEffect(() => {
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, (TIMER_REQUEST + Math.floor(Math.random() * 100)) * 1000); //have a random number to avoid peak access 

        return () => clearInterval(intervalId);
    }, [fetchData]);

    const refreshPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        let refreshTimer;

        if ((selectedService === null || selectedService === "") && (globalId === null || globalId === "")) {
            // 如果 selectedService 和 globalId 都是 null，则设置定时器
            refreshTimer = setTimeout(refreshPage, TIMER_RELOAD * 1000);
        }

        return () => {
            // 清除定时器
            if (refreshTimer) {
                clearTimeout(refreshTimer);
            }
        };
    }, [selectedService, globalId]);


    return (
        <AppContext.Provider value={{
            generalData,
            hotelData,
            flightsData,
            newsData,
            weatherData,
            selectedService,
            setSelectedService,
            globalId,
            setGlobalId,
            services,
            setServices,
            handleServiceReset,
            handleServiceClick,
            hotelId,
            setHotelId
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
