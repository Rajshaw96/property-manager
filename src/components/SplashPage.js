import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCopy, FaWifi, FaKey } from 'react-icons/fa';
import './SplashPage.css';

function SplashPage() {
  const { id } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [wifiDetails, setWifiDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState('');

  // Fetch property details based on ID from URL
  useEffect(() => {
    axios.get(`http://localhost:8000/api/properties/${id}`) // Make sure the path matches your server route
      .then(response => {
        setProperty(response.data);
        if (response.data['backgroundImgs']) {
          setBackgroundImg(response.data['backgroundImgs']);
        }
      })
      .catch(() => setError('Error fetching property details'));
  }, [id]);
  

  // Validate the form
  useEffect(() => {
    const isValidEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    setIsFormValid(firstName !== '' && lastName !== '' && isValidEmail);
  }, [firstName, lastName, email]);

  // Clear the form fields
  const handleClear = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  // Handle the connect action
  const handleConnect = () => {
    const postData = { firstName, lastName, email };

    axios.post('https://property-api-ajcn.onrender.com/api/connect', postData) // Make sure the path matches your server route
      .then(() => {
        return axios.get(`https://property-api-ajcn.onrender.com/api/properties/${id}`); // Refresh the property details
      })
      .then(response => {
        if (response.data['wifi-details']) {
          setWifiDetails(response.data['wifi-details']);
        } else {
          setError('No WiFi details found');
        }
      })
      .catch(() => setError('Error connecting to the property'));
  };

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy!', err);
      });
  };

  const splashPageData = property && property['splash-page'] && property['splash-page'][0];

  return (
    <div className="splash-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <nav className="splash-nav">
        {splashPageData && <img src={splashPageData.logo} alt="Property Logo" className="logo" />}
      </nav>

      <div className="splash-content">
        <div className="form-container">
          {error && <p className="error-message">{error}</p>}
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
              <button type="button" onClick={handleClear} className="splash-button clear-button">Clear</button>
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
                <p><strong><FaKey className="steps-icon" />Wifi Password:</strong> {wifiDetails.wifiPassword}</p>
                <FaCopy className="copy-icon" onClick={() => copyToClipboard(wifiDetails.wifiPassword)} />
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="splash-footer">
        <p>&copy; {new Date().getFullYear()} <strong>Linkbase Technologies Inc.</strong> All Rights Reserved.</p>
        <p>
          <a href="https://linkbase.ca/privacy-and-policy" target='_blank' rel='noopener noreferrer'>Privacy Policy</a> | 
          <a href="https://linkbase.ca/terms-of-service" target='_blank' rel='noopener noreferrer'>Terms & Conditions</a>
        </p>
      </footer>
    </div>
  );
}

export default SplashPage;