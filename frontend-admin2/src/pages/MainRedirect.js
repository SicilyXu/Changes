import { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';


function MainRedirect() {
    const { endpoint } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (endpoint === "advertiser")
            navigate("/adlanding")
        if (endpoint === "hotel")
            navigate("/htlanding")
    }, [endpoint, navigate])
    return ("")
}

export default MainRedirect;