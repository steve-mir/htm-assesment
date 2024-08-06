import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './rooms.css';

interface Property {
  id: number;
  name: string;
  description: string;
  bathrooms: number;
  standardPax: number;
  maximumPax: number;
  floorArea: number;
  bedConfigurations: number[];
  amenities: {
    aircon: boolean;
    appletv: boolean;
    btspeakers: boolean;
    cardkey: boolean;
    chromecast: boolean;
    fireplace: boolean;
    hdtv: boolean;
    jacuzzi: boolean;
    nespresso: boolean;
  };
  images: string[];
}

const Rooms: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filterText, setFilterText] = useState<string>('');
  const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>([]);

  useEffect(() => {
    fetch('./properties.json')
      .then((response) => response.json())
      .then((data: Property[]) => {
        setProperties(data);
        setFilteredProperties(data);
      })
      .catch((error) => {
        console.error('Error fetching properties:', error);
      });
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.toLowerCase();
    setFilterText(text);

    const filtered = properties.filter(property =>
      property.name.toLowerCase().includes(text) ||
      property.description.toLowerCase().includes(text)
    );

    setFilteredProperties(filtered);
  };

  const clearFilter = () => {
    setFilterText('');
    setFilteredProperties(properties);
  };

  // Define a threshold for when to show the "Read More" button
  const descriptionThreshold = 110;
  const toggleDescription = (id: number) => {
    setExpandedDescriptions(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="property-list">
      <motion.h1
        className="property-list-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        HTM Hotel Rooms
      </motion.h1>
      
      <div className="search-container">
        {/* <Search className="search-icon" /> */}
        <input
          type="text"
          placeholder="Search rooms by name or description"
          value={filterText}
          onChange={handleFilterChange}
          className="search-input"
        />
        {filterText && (
          <button onClick={clearFilter} className="clear-search">
            <X size={18} />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {filteredProperties.length === 0 ? (
          <motion.p
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No rooms match your search criteria.
          </motion.p>
        ) : (
          <motion.div
            className="property-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredProperties.map(property => (
              <motion.div
                key={property.id}
                className="property-card"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={property.images[0] || '/api/placeholder/400/300'}
                  alt={property.name}
                  className="property-image"
                />
                <div className="property-content">
                  <h2 className="property-name">{property.name}</h2>
                  {/* <p className="property-description">{property.description}</p> */}
                  <p className={`property-description ${expandedDescriptions.includes(property.id) ? 'expanded' : ''}`}>
                  {property.description.length > descriptionThreshold && !expandedDescriptions.includes(property.id)
                    ? `${property.description.slice(0, descriptionThreshold)}...`
                    : property.description}
                  </p>

                  {property.description.length > descriptionThreshold && (
                  <button className="read-more" onClick={() => toggleDescription(property.id)}>
                    {expandedDescriptions.includes(property.id) ? 'Read Less' : 'Read More'}
                  </button>
                )}
                
                  <div className="property-details">
                    <span className="detail-item">
                      <i className="icon-bed"></i> {property.bedConfigurations.length} Beds
                    </span>
                    <span className="detail-item">
                      <i className="icon-users"></i> {property.standardPax}-{property.maximumPax} Guests
                    </span>
                    <span className="detail-item">
                      <i className="icon-bath"></i> {property.bathrooms} Bathrooms
                    </span>
                    <span className="detail-item">
                      <i className="icon-maximize"></i> {property.floorArea} sqm
                    </span>
                  </div>
                  <div className="property-amenities">
                    <h3 className="amenities-title">Amenities</h3>
                    <ul className="amenities-list">
                      {Object.entries(property.amenities).map(([key, value]) => (
                        value && <li key={key} className="amenity-item">{key}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button className="book-button">Book Now</button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rooms;