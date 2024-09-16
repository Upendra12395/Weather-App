import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import { fetchWeatherApi } from 'openmeteo';

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

    return `${days[new Date().getDay()]} ${new Date().getDate()} ${months[new Date().getMonth()]}`
  }

  const getWeatherInfo = async (event) => {
    console.log("event log : ", event);
    if(event.key == 'Enter'){
      event.preventDefault();
      setQuery('');
      setData({ ...data, waiting: true });
      const params = {
        "latitude": 52.52,
        "longitude": 13.41,
        "hourly": "temperature_2m"
      };
      const url = "https://api.open-meteo.com/v1/forecast"//'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
      const responses = await fetchWeatherApi(url, params);
      // axios.get(url, {  params  })
      //   .then((response) => {
        if(responses){
          console.log("weather info : ", responses);
          setData({ ...data, data: responses.data, waiting: false, error: false })
        // })
        // .catch((error) => {
        }else{
          console.log('Error in getting weather info : ');
          setQuery('');
          setData({ error: true, data: {}, prediction: false });
        }
    }
  }

  return (
    <div className="App">
      <h1> Weather Update </h1>
      <div>
        <input type='text' name='city' value={query} placeholder='Enter the city name...' onChange={event => setQuery(event.target.value)} onKeyPress={getWeatherInfo} />
      </div>
      {data.waiting && <>
        <br />
        <br />
        <Oval type="Oval" color="black" height={100} width={100} />
      </>
      }
      {data.error && <>
        <br />
        <br />
        <span className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span style={{ fontSize: '20px' }}>City not found</span>
        </span>
      </>}
      {/* {data.} */}
    </div>
  );
}

export default App;
