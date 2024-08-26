import React, { useState } from "react";
import Axios from "axios";
import moment from "moment-timezone";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

function App() {
  const [weatherData, setWeatherData] = useState({
    temp: "",
    description: "",
    countryName: "",
    humidity: "",
    windSpeed: "",
    feelsLike: "",
    dt: "",
  });
  const [weatherIcon, setWeatherIcon] = useState(null);

  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = today.toLocaleTimeString({ hour: "2-digit", minute: "2-digit" });

  const [isFocused, setIsFocused] = useState(false);
  const [city, setCity] = useState("");
  const [showWeatherSummary, setShowWeatherSummary] = useState(false);
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(null);
  const [backgroundStyle, setBackgroundStyle] = useState(
    "bg-gradient-to-r from-blue-500 to-purple-600"
  );

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (city === "") {
      setIsFocused(false);
    }
  };

  const fetchWeatherData = () => {
    setIsLoading(true);
    setIsError(false);

    Axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=267c0adb331482b5ef373058244b82b3&units=metric`
    )
      .then((res) => {
        const iconUrl = `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`;
        setWeatherIcon(iconUrl);
        setWeatherData({
          description: res.data.weather[0].description,
          temp: Math.round(res.data.main.temp),
          humidity: res.data.main.humidity,
          windSpeed: res.data.wind.speed,
          countryName: res.data.sys.country,
          feelsLike: res.data.main.feels_like,
          dt: moment
            .utc()
            .add(res.data.timezone / 3600, "hours")
            .format("HH:mm:ss"),
        });

        const weather = res.data.weather[0].main.toLowerCase();

        let backgroundClass = "";
        switch (weather) {
          case "clear":
            backgroundClass = "bg-gradient-to-r from-blue-400 to-blue-200";
            break;
          case "clouds":
            backgroundClass = "bg-gradient-to-r from-gray-400 to-gray-600";
            break;
          case "rain":
            backgroundClass = "bg-gradient-to-r from-gray-500 to-blue-900";
            break;
          case "thunderstorm":
            backgroundClass = "bg-gradient-to-r from-blue-800 to-black";
            break;
          case "snow":
            backgroundClass = "bg-gradient-to-r from-white to-blue-100";
            break;
          case "mist":
          case "fog":
            backgroundClass = "bg-gradient-to-r from-gray-300 to-white";
            break;
          case "haze":
            backgroundClass = "bg-gradient-to-r from-gray-300 to-gray-400";
            break;
          default:
            backgroundClass = "bg-gradient-to-r from-gray-700 to-gray-900";
            break;
        }

        setBackgroundStyle(backgroundClass);

        setIsLoading(false);
      })
      .catch((error) => {
        setIsError(true);
        setIsLoading(false);
      });
  };

  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const handleSearch = () => {
    if (!city) {
      setIsEmpty("Please Enter a Location!");
      return;
    }
    setIsEmpty(null);
    setShowWeatherSummary(true);
    setShowWeatherDetails(true);
    fetchWeatherData();
  };

  return (
    <div
      className={`min-h-screen bg-gray-900 flex items-center justify-center p-6`}
    >
      {isLoading ? (
        <div className="text-white text-center">
          <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8a8 8 0 01-16 0z"
            />
          </svg>
          <p>Loading...</p>
        </div>
      ) : isError ? (
        <div className="text-white text-center top-0">
          <svg
            className="h-8 w-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>No result found!</p>
        </div>
      ) : (
        <div className="flex flex-col-reverse lg:flex-row mx-auto justify-center items-center">
          {showWeatherSummary && (
            <div
              className={`${backgroundStyle} rounded-lg shadow-lg p-6 lg:px-6 lg:py-[8px] text-white flex flex-col justify-between w-72`}
              data-aos="flip-up"
            >
              <p className="ml-48">{weatherData.dt}</p>
              <p className="font-bold text-4xl">{day}</p>
              <p className="text-[18px] my-1">{date}</p>
              <div className="mt-6 lg:my-6">
                <div className="flex justify-center">
                  <img
                    src={weatherIcon}
                    alt="Weather Icon"
                    className="w-16 h-16"
                  />
                </div>
                <h1 className="text-6xl font-bold">
                  {weatherData.temp}°<sub className="text-[30px]">C</sub>
                </h1>
                <p className="my-2">RealFeel {weatherData.feelsLike}°</p>
                <p className="text-xl mt-2 -mb-4">
                  {capitalize(weatherData.description)}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 lg:px-6 lg:py-[34px] text-white w-72">
            <div className="relative mb-4">
              <label
                className={`absolute translate-y-4 left-3 transition-all transform ${
                  isFocused || city
                    ? "-translate-y-[18px] text-xs text-blue-500"
                    : "text-gray-400"
                }`}
                htmlFor="search"
              >
                Search by Location
              </label>
              <input
                type="text"
                id="search"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setIsEmpty(null);
                  {
                    !!city && setShowWeatherSummary(false);
                    setShowWeatherDetails(false);
                  }
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full mt-2 p-2 border bg-gray-700 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isEmpty && <p className="mt-4 text-red-400">{isEmpty}</p>}
            </div>
            <button
              onClick={handleSearch}
              className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700 transition"
            >
              Search
            </button>
            {showWeatherDetails && (
              <div className="mt-6 lg:space-y-4">
                <p>
                  <strong>NAME:</strong> {weatherData.countryName}
                </p>
                <p>
                  <strong>TEMP:</strong> {weatherData.temp} °C
                </p>
                <p>
                  <strong>HUMIDITY:</strong> {weatherData.humidity}%
                </p>
                <p>
                  <strong>WIND SPEED:</strong> {weatherData.windSpeed}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
