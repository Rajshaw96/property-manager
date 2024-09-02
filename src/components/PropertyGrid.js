import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QRCodeComponent from './QRCodeComponent'; // Ensure this import is correct
import axios from 'axios';
import './PropertyGrid.css';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons

function PropertyGrid() {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("https://property-api-ajcn.onrender.com/api/properties").then((response) => {
      setProperties(response.data);
    }).catch(error => {
      console.error("Error fetching properties:", error);
    });
  }, []);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  // Add defensive checks here
  const filteredProperties = properties.filter((property) => {
    const title = property.title ? property.title.toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    return title.includes(search);
  });

  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    axios.delete(`https://property-api-ajcn.onrender.com/api/properties/${id}`).then(() => {
      setProperties(properties.filter((property) => property.id !== id));
    }).catch(error => {
      console.error("Error deleting property:", error);
    });
  };

  return (
    <div className="property-grid">
      <h1>Property Listings</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button
          className="clear-button"
          onClick={() => setSearchTerm('')}
        >
          Clear
        </button>
      </div>
      <table className="property-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProperties.length > 0 ? (
            currentProperties.map((property) => (
              <tr key={property.id}>
                <td>{property.id}</td>
                <td>{property.title || 'N/A'}</td> {/* Add fallback */}
                <td>{property.location?.city || 'N/A'}</td> {/* Add fallback */}
                <td>{property.location?.state || 'N/A'}</td> {/* Add fallback */}
                <td>{property.location?.country || 'N/A'}</td> {/* Add fallback */}
                <td>${property.price?.amount?.toLocaleString() || 'N/A'}</td> {/* Add fallback */}
                <td>
                  <Link to={`/property-details/${property.id}`} className="action-button">
                    <FaEye /> {/* View icon */}
                  </Link>
                  <Link to={`/edit-property/${property.id}`} className="action-button">
                    <FaEdit /> {/* Edit icon */}
                  </Link>
                  <button 
                    className="action-button delete-button"
                    onClick={() => handleDelete(property.id)}
                  >
                    <FaTrash /> {/* Delete icon */}
                  </button>
                  <QRCodeComponent
                    id={property.id}
                    size={64}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No properties found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(Math.ceil(filteredProperties.length / propertiesPerPage)).keys()].map(number => (
          <button
            key={number}
            onClick={() => paginate(number + 1)}
            className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PropertyGrid;
