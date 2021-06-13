require('dotenv').config()

import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";


const API_ACCESS_KEY = process.env.REACT_APP_API_ACCESS_KEY;

const SearchInput = ({ value, inputOnChange }) => {
  return (
    <div>
      <input value={value} onChange={inputOnChange} />
    </div>
  );
};

const Country = ({ country={} }) => {
  console.log(process.env.REACT_APP_API_ACCESS_KEY)
  const [weatherData, setWeatherData] = useState({});
  useEffect(() => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${API_ACCESS_KEY}&query=${country.name}`
      )
      .then((response) => {
        setWeatherData({...response.data.current})
      });
  }, []);
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>

      <h3>languages</h3>
      {Array.isArray(country.languages)
        ? country.languages.map((language) => (
            <p key={language.name}>{language.name}</p>
          ))
        : null}

      <img width="200" src={country.flag} alt={`${country.name} flag`} />

      <div>
        <h3>Weather in {country.name}</h3>
        <p>temperature {weatherData.temperature} </p>
        <img src={weatherData.weather_icons}/>
        <p>wind {weatherData.wind_speed} mph direction {weatherData.wind_dir}</p>
      </div>
    </div>
  );
};
const CountriesList = ({ countries }) => {
  const [showCountry, setShowCountry] = useState(false);
  const [countryToShow, setCountryToShow] = useState("");
  return (
    <div>
      {!showCountry ? (
        countries.length > 1 && countries.length < 10 ? (
          countries.map((country) => (
            <div key={country.name}>
              {country.name}
              <button
                onClick={() => {
                  setCountryToShow(country.name);
                  setShowCountry(true);
                }}
              >
                show
              </button>
            </div>
          ))
        ) : countries.length === 1 ? (
          // <Country country={countries[0]} /> 
          null
        ) : (
          "Too many matches. Try another search query."
        )
      ) : (
        <Country
          country={
            countries.filter((country) => country.name === countryToShow)[0]
          }
        />
      )}
    </div>
  );
};
export default function App() {
  const [searchValue, setSearchValue] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
  }, []);
  const searchOnChange = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().startsWith(searchValue.toLowerCase())
  );
  return (
    <div className="App">
      <div>
        Find countries:{" "}
        <SearchInput inputOnChange={searchOnChange} value={searchValue} />
      </div>
      <CountriesList countries={filteredCountries} />
    </div>
  );
}
