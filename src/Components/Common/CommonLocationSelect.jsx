import React, { useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';

const CommonLocationSelect = ({ locations, value, onChange ,onClear }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationList, setShowLocationList] = useState(false);

  const filteredLocations = locations.filter(({ name, address }) =>
    [name, address.city, address.state].some((field) =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleLocationSelect = (location) => {
    onChange(location);
    setSearchQuery('');
    setShowLocationList(false);
  };

  const handleClearSelection = () => {
    if (onClear) {
      onClear(); 
    }
    setSearchQuery('');
    setShowLocationList(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Location*</label>
      {value ? (
        <div className="flex items-center w-[25.8rem] space-x-2 p-2 border border-gray-300 rounded-lg">
          <MapPin className="h-5 w-5 text-gray-500" />
          <span className="flex-1">{value.name}</span>
          <X className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" onClick={handleClearSelection} />
        </div>
      ) : (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowLocationList(true)}
            className="pl-10 pr-4 w-[25.8rem] border border-gray-300 rounded-lg py-2 focus:outline-none"
            placeholder="Search locations by name, city, or state..."
          />
        </div>
      )}
      {showLocationList && !value && searchQuery && (
        <div className="absolute w-[25.8rem] overflow-auto  bg-white border border-gray-300 rounded-lg shadow-lg mt-2 z-50" style={{ maxHeight: '300px' }}>
          {filteredLocations.length ? (
            filteredLocations.map((location) => (
              <div key={location._id} className="flex items-center p-4 cursor-pointer hover:bg-gray-50" 
              onClick={() => handleLocationSelect(location)}>
                <MapPin className="h-5 w-5 text-indigo-500 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-500">{location.address.city}, {location.address.state}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">No locations found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommonLocationSelect;
