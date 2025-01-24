import React from 'react'
import CustomInput from './CustomInput'
import Loader from "../Common/Loader";

const CutomInputDropdown = ({field,searchTerms,required,handleSearch,showDropdowns,searchResults,isLoading,dropdownRefs,handleSelect,isInvalid}) => {
  return (
    <div key={field.name} className="relative">
    <CustomInput
      id={field.name}
      label={field.label}
      type="text"
      required={required}
      value={searchTerms[field.name] || ""}
      onChange={(e) => handleSearch(e, field)}
      placeholder={field.placeholder}
      isInvalid={isInvalid}
    />
    {showDropdowns[field.name] &&
      (searchResults[field.name]?.length > 0 ||
        isLoading[field.name]) && (
        <div
          ref={(el) => (dropdownRefs.current[field.name] = el)}
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg"
        >
          <div className="h-full max-h-60 overflow-auto customScrollbar">
            {isLoading[field.name] ? (
              <Loader />
            ) : (
              searchResults[field.name]?.map((item) => (
                <div
                  key={item.conceptId}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(item, field.name)}
                >
                  {item.pt.term}
                </div>
              ))
            )}
          </div>
        </div>
      )}
  </div>
  )
}

export default CutomInputDropdown