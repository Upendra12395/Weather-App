import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState({
    error: false,
    data: {},
    waiting: false
  });

  const getDate = () => {
    let months = {
      '0': 'January',
      '1': 'Febraury',
      '2': 'March',
      '3': 'April',
      '4': 'May',
      '5': 'June',
      '6': 'July',
      '7': 'August',
      '8': "september",
      '9': 'October',
      '10': 'November',
      '11': 'December'
    };

    let days = {
      '0': 'Sunday',
      '1': 'Monday',
      '2': 'Tuesday',
      '3': 'Wednesday',
      '4': 'Thursday',
      '5': 'Friday',
      '6': 'Saturday'
    };

    return `${days[new Date().getDay()]}, ${new Date().getDate()} ${months[new Date().getMonth()]}`
  }

  const getWeatherInfo = async (event) => {
    console.log("event log : ", event);
    if (event.key === 'Enter') {
      event.preventDefault();
      setQuery('');
      setData({ ...data, waiting: true });
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'cd7500b7c1963b5e42c888d98aabae00';
      axios.get(url, { params: { q: query, units: 'metric', appid: api_key } })
        .then((response) => {
          console.log("weather info : ", response.data);
          setData({ ...data, data: response.data, waiting: false, error: false })
        })
        .catch((error) => {
          console.log('Error in getting weather info : ', error);
          setQuery('');
          setData({ error: true, data: {}, prediction: false });
        })
    }
  }
  const convertTime = (time) => {
    try {
      let hours = `${new Date(time).getHours()}`.length === 1 ? 0 + `${new Date(time).getHours()}` : new Date(time).getHours()
      let minutes = `${new Date(time).getMinutes()}`.length === 1 ? 0 + `${new Date(time).getMinutes()}` : new Date(time).getMinutes()
      return `${hours}:${minutes}`
    } catch (err) {
      return "06:55"
    }
  }
  return (
    <div className="App">
      <h1>Weather Update</h1>
      <div className="search-bar">
        <input
          className="city-search"
          type="text"
          name="city"
          value={query}
          placeholder="Enter the city name..."
          onChange={event => setQuery(event.target.value)}
          onKeyPress={getWeatherInfo}
        />
        <button onClick={getWeatherInfo} className="search-button">Search</button>
      </div>
      {data.waiting && (
        <div className="loading">
          <Oval type="Oval" color="#007BFF" height={100} width={100} />
        </div>
      )}
      {data.error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>City not found</span>
        </div>
      )}
      {data.data && (
        <div className="weather-card">
          <div className="city-name">
            <h2>{data.data.name}, {data.data.sys.country}</h2>
            <p>{getDate()}</p>
          </div>
          <img
            className="weather-logo"
            src={`https://openweathermap.org/img/wn/${data.data.weather[0].icon}@2x.png`}
            alt={data.data.weather[0].description}
          />
          <div className="temperature">
            <div className="feels-like">
              <strong>Feels Like:</strong> {Math.round(data.data.main.feels_like)}<sup>°C</sup>
            </div>
            <div className="max-min">
              <p><strong>Max:</strong> {Math.round(data.data.main.temp_max)}<sup>°C</sup></p>
              <p><strong>Min:</strong> {Math.round(data.data.main.temp_min)}<sup>°C</sup></p>
            </div>
          </div>
          <div className="additional-info">
            <p><strong>Visibility:</strong> {data.data.visibility / 1000} km</p>
            <p><strong>Humidity:</strong> {data.data.main.humidity}%</p>
          </div>
          <div className="wind-info">
            <h4>Breeze Details</h4>
            <p>Speed: {data.data.wind.speed} km/h</p>
          </div>
          <div className="day-info">
            <h4>Sun Activity</h4>
            <p>Sunrise: {convertTime(data.data.sys.sunrise)} AM</p>
            <p>Sunset: {convertTime(data.data.sys.sunset)} PM</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
