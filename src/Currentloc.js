import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const LocationFetcher = () => {
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                const ipAddress = ipData.ip;

                const locationResponse = await fetch(`https://ipinfo.io/${ipAddress}/geo`);
                const locationData = await locationResponse.json();

                setLocation(locationData);
                const { loc, timezone } = locationData;
                const [lat, lon] = loc.split(',');

                const weatherResponse = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=d5b4d76c01d9469586374236240907&q=${lat},${lon}&days=7&aqi=no&alerts=no`);
                setWeather(weatherResponse.data);

                const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
                setCurrentTime(currentTime);

            } catch (error) {
                console.error('Error fetching location or weather:', error);
            }
        };

        fetchLocation();
    }, []);

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = () => {
        setInputValue(inputValue);
        handleLocation();
    };

    const handleLocation = async () => {
        try {
            const weatherResponse = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=d5b4d76c01d9469586374236240907&q=${inputValue}&days=7&aqi=no&alerts=no`);
            setWeather(weatherResponse.data);

            const locationResponse = {
                city: weatherResponse.data.location.name,
                timezone: weatherResponse.data.location.tz_id,
            };
            setLocation(locationResponse);

            const currentTime = new Date().toLocaleString('en-US', { timeZone: locationResponse.timezone, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
            setCurrentTime(currentTime);

        setInputValue('');
        } catch (error) {
            console.error('Error fetching weather for input location:', error);
        }
    };

    return (
        <>
            <div className="NAVBAR">
                <div className="Logo">
                    <img src='weatherrr.png' alt='logo' />
                    <h2> Weather</h2>
                </div>
                <div id='contentt'>
                    <ul>
                        <li>
                            <input
                                type='text'
                                placeholder='Search Location'
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <button onClick={handleButtonClick}>
                                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            </button>
                        </li>
                        <li>
                            <a href="#Home" id='homepage'>Homepage</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="main-content">
                {weather ? (
                    <div className="weather-container">
                        <div className="current-weather">
                            <div className='groups' id='Home'>
                                <h1>{location.city}</h1>
                                <p>{currentTime}</p>
                                <h2>{weather.current.temp_c}°C</h2>
                                <p>Humidity: {weather.current.humidity}%</p>
                            </div>
                            <div className='groups'>
                                <img src={weather.current.condition.icon} alt="weather icon" />
                                <h2>{weather.current.condition.text}</h2>
                            </div>

                        </div>
                        <div className="hourly-weather">
                            <h2>Hourly Weather</h2>
                            <div className="hourly-weather-cards">
                                {weather.forecast.forecastday[0].hour.filter((_, index) => index % 2 === 0).map((hour, index) => {
                                    const date = new Date(hour.time);
                                    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <div className="hourly-weather-card" key={index}>
                                            <img src={hour.condition.icon} alt="weather icon" />
                                            <p>{timeString}</p>
                                            <p>{hour.temp_c}°C</p>
                                            <p>{hour.condition.text}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="daily-weather">
                            <h2>Daily Weather</h2>
                            <div className="daily-weather-cards">
                                {weather.forecast.forecastday.map((day, index) => (
                                    <div className="daily-weather-card" key={index}>
                                        <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                        <img src={day.day.condition.icon} alt="weather icon" />
                                        <p>{day.day.avgtemp_c}°C</p>
                                        <p>{day.day.condition.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="loading-message">Loading weather...</p>
                )}
            </div>
        </>
    );
};

export default LocationFetcher;

