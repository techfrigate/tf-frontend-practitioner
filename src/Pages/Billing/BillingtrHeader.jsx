import { IoArrowUpSharp, IoArrowDownSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

const BillingtrHeader = ({ setLocationId, locationId, handleSort, currentSort }) => {
  const { profileLocations } = useSelector((state) => state.locations);

  const handleLocationSelect = (e) => {
    setLocationId(e.target.value);
  };

  const renderSortIcon = (columnName) => {
    if (currentSort.sortBy !== columnName) {
      return <IoArrowUpSharp className="inline ml-1" size={16} />;
    }
    
    return currentSort.order === 'asc' ? 
      <IoArrowUpSharp className="inline ml-1" size={16} /> : 
      <IoArrowDownSharp className="inline ml-1" size={16} />;
  };

  return (
    <tr className="text-white">
      <th className="py-4 px-6 text-left">
        Patient
      </th>
      <th>   
        <select 
          name="location" 
          className="bg-[#64c6b0]" 
          onChange={handleLocationSelect} 
          value={locationId}
        >
          {profileLocations?.map((elm) => (
            <option key={elm._id} value={elm._id}>
              {elm.displayName}
            </option>
          ))}
        </select>
      </th>
      <th className="py-4 px-6 text-left">UHID</th>
      <th className="py-4 px-6 text-left">Bill ID</th>
      <th 
        className="py-4 px-6 text-left cursor-pointer" 
        onClick={() => handleSort('status')}
      >
        Status {renderSortIcon('status')}
      </th>
      <th 
        className="py-4 px-6 text-left cursor-pointer" 
        onClick={() => handleSort('updatedAt')}
      >
        Updated At {renderSortIcon('updatedAt')}
      </th>
      <th className="py-4 px-6 text-left">Bill</th>
      <th></th>
    </tr>
  );
};

export default BillingtrHeader;