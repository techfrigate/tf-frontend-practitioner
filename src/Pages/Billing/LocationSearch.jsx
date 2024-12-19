import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../../Components/ui/input";

const LocationSearch = ({
  searchQuery,
  setSearchQuery,
  locations,
  onSelect,
  selectedLocation,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const filteredLocations =
    searchQuery.trim() === ""
      ? locations
      : locations.filter((location) => {
          const searchLower = searchQuery.toLowerCase();
          const name = location.name?.toLowerCase() || "";
          const city = location.address?.city?.toLowerCase() || "";
          const state = location.address?.state?.toLowerCase() || "";

          return (
            name.includes(searchLower) ||
            city.includes(searchLower) ||
            state.includes(searchLower)
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
    if (searchQuery.trim() !== "") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [searchQuery]);

  return (
    <div className="w-full space-y-4 space-x-2">
      {!selectedLocation ? (
        <>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search locations by name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[22rem] truncate border border-gray-500"
            />
          </div>

          {searchQuery && (
            <div
              className={`absolute w-[22rem] max-h-[300px] bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-700 ease-out transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                overflow: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {filteredLocations.map((location) => (
                <div
                  key={location._id}
                  className="cursor-pointer p-3 border-b border-gray-300 hover:bg-gray-100"
                  onClick={() => onSelect(location)}
                >
                  <div className="flex items-center gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800">
                        {location.name}
                      </h3>
                      <p className="text-xs text-gray-600 ">
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
          )}
        </>
      ) : (
        <div className="relative flex items-center">
          <Input
            type="text"
            value={`${selectedLocation.name} - ${formatAddress(
              selectedLocation.address
            )}`}
            readOnly
            onClick={() => onSelect(null)}
            className="w-[21rem] cursor-pointer border truncate border-green-500 bg-green-50 text-green-800 font-semibold"
          />
        </div>
      )}
    </div>
  );
};

export default LocationSearch;

