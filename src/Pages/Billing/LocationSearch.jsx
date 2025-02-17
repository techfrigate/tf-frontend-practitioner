import React, { useState, useEffect } from "react";
import { Search, X, Hospital } from "lucide-react";
import { Input } from "../../Components/ui/input";
import { useSelector } from "react-redux";

const LocationSearch = ({searchQuery, setSearchQuery, locations, onSelect, selectedLocation}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { profileData } = useSelector((state) => state.profile);

  const filteredLocations = searchQuery.trim() === ""
    ? locations
        .filter(location => location.status !== false)
        .filter(location => 
          profileData?.locations?.includes(location.id) || 
          profileData?.locations?.includes(location._id)
        )
    : locations
        .filter((location) => {
          const searchLower = searchQuery.toLowerCase();
          const name = location.name?.toLowerCase() || "";
          const city = location.address?.city?.toLowerCase() || "";
          const state = location.address?.state?.toLowerCase() || "";
          return (
            location.status !== false && 
            (profileData?.locations?.includes(location.id) || 
             profileData?.locations?.includes(location._id)) &&
            (name.includes(searchLower) ||
             city.includes(searchLower) ||
             state.includes(searchLower))
          );
        });

  const formatAddress = (address) => {
    if (!address) return "Address not available";
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.location-search-container')) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full space-y-4 space-x-2 location-search-container">
      {!selectedLocation ? (
        <>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search locations by name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsVisible(true)}
              className="pl-10 w-full md:w-[25rem] truncate border-2 border-gray-200 rounded-2xl
                focus:border-gray-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200
                h-14 text-base shadow-sm"
            />
          </div>
          <div
            className={`absolute w-[24rem] max-h-[300px] bg-white border border-gray-300 rounded-lg shadow-lg 
              transition-all duration-700 ease-out transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
            style={{
              overflow: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filteredLocations.map((location) => (
              <div
                key={location.id || location._id}
                className="cursor-pointer p-4 hover:bg-gray-50 transition-all duration-200 first:rounded-t-xl 
                  last:rounded-b-xl border-b border-gray-100 last:border-0"
                onClick={() => {
                  onSelect(location);
                  setIsVisible(false);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-50 p-2 rounded-lg">
                    <Hospital className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">{location.name}</h3>
                    <p className="text-sm text-gray-500 leading-snug line-clamp-2">
                      {formatAddress(location.address)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filteredLocations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No locations found matching your search
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          className="flex items-center gap-3 p-1.5 bg-emerald-50 border-2 border-emerald-500 
            rounded-2xl w-full md:w-[25rem] group cursor-pointer transition-all duration-200
            hover:bg-emerald-100 shadow-sm"
        >
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Hospital className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-emerald-800 mb-0.5">
              {selectedLocation.name}
            </div>
          </div>
          <div
            className="bg-emerald-100 p-1.5 rounded-full opacity-0 group-hover:opacity-100 
              transition-all duration-200"
            onClick={() => onSelect(null)}
          >
            <X className="h-4 w-4 text-emerald-600 flex-shrink-0 group-hover:rotate-180 transition-transform" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;