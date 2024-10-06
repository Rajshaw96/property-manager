import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCopy, FaWifi, FaKey } from 'react-icons/fa';
import './SplashPage.css';

function SplashPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [wifiDetails, setWifiDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState('');
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine); // Detect offline mode

  // Handle online/offline status changes
  useEffect(() => {
    const updateOnlineStatus = () => setOfflineMode(!navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Fetch property details and Wi-Fi data from API or local storage
  useEffect(() => {
    if (navigator.onLine) {
      axios.get(`https://property-api-ajcn.onrender.com/api/properties/${id}`)
        .then(response => {
          setProperty(response.data);
          if (response.data.backgroundImgs) {
            setBackgroundImg(response.data.backgroundImgs);
          }
          // Save property data to local storage for offline access
          localStorage.setItem(`property_${id}`, JSON.stringify(response.data));
        })
        .catch(() => setError('Error fetching property details'));
    } else {
      // Offline: Load data from local storage
      const savedProperty = localStorage.getItem(`property_${id}`);
      if (savedProperty) {
        setProperty(JSON.parse(savedProperty));
        setError(null); // Clear error if data is found
      } else {
        setError('No data available offline.');
      }
    }
  }, [id]);

  // Form validation
  useEffect(() => {
    const isValidEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    setIsFormValid(firstName !== '' && lastName !== '' && isValidEmail);
  }, [firstName, lastName, email]);

  const handleClear = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  const handleConnect = () => {
    const postData = { firstName, lastName, email };

    if (navigator.onLine) {
      // Online: Post form data and fetch Wi-Fi details
      axios.post('https://property-api-ajcn.onrender.com/api/connect', postData)
        .then(() => {
          return axios.get(`https://property-api-ajcn.onrender.com/api/properties/${id}`);
        })
        .then(response => {
          if (response.data.wifi_details) {
            setWifiDetails(response.data.wifi_details);
            // Save Wi-Fi details to local storage
            localStorage.setItem(`wifiDetails_${id}`, JSON.stringify(response.data.wifi_details));
          } else {
            setError('No WiFi details found');
          }
        })
        .catch(() => setError('Error connecting to the property'));
    } else {
      // Offline: Save form data locally
      localStorage.setItem('formData', JSON.stringify(postData));
      const savedWifiDetails = localStorage.getItem(`wifiDetails_${id}`);
      if (savedWifiDetails) {
        setWifiDetails(JSON.parse(savedWifiDetails));
      } else {
        setError('No WiFi details available offline.');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy!', err);
      });
  };

  const splashPageData = property && property.splash_page && property.splash_page[0];

  return (
    <div className="splash-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <nav className="splash-nav">
        {splashPageData && <img src={splashPageData.logo} alt="Property Logo" className="logo" />}
      </nav>

      <div className="splash-content">
        <div className="form-container">
          {error && <p className="error-message">{error}</p>}
          {offlineMode && <p className="offline-message">You are currently offline. Data will be saved locally and submitted when you're back online.</p>}
          {splashPageData ? (
            <div>
              <h1 className="splash-title">{splashPageData.title}</h1>
              <p className="splash-description">{splashPageData.description1}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}

          <form className={`splash-form ${wifiDetails ? 'hidden' : ''}`} autoComplete="off">
            <div className="name-fields">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                className="input-field"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field full-width"
            />
            <div className="button-group">
              <button type="button" onClick={handleConnect} disabled={!isFormValid} className="splash-button connect-button">Quick Connect</button>
            </div>
          </form>

          {wifiDetails && (
            <div className="wifi-details">
              <h3 className="wifi-heading"><FaWifi className="steps-icon" /> WiFi Login Details:</h3>
              <div className="wifi-detail-item">
                <p><strong><FaWifi className="steps-icon" /> Wifi Name:</strong> {wifiDetails.wifiName}</p>
                <FaCopy className="copy-icon" onClick={() => copyToClipboard(wifiDetails.wifiName)} />
              </div>
              <div className="wifi-detail-item">
                <p><strong><FaKey className="steps-icon" /> Wifi Password:</strong> {wifiDetails.wifiPassword}</p>
                <FaCopy className="copy-icon" onClick={() => copyToClipboard(wifiDetails.wifiPassword)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SplashPage;