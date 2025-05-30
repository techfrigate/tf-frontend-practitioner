import React, { useState, useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";
import CustomButton from "../Common/CustomButton";
import CustomSelect from "../Common/CustomSelect";
import CustomInput from "../Common/CustomInput";
import { useDispatch } from "react-redux";
import Loader from "../Common/Loader";
import CutomInputDropdown from "../Common/CutomInputDropdown";
import toast from "react-hot-toast";

const FHIRFormComponent = ({
  formFields = [],
  closeSheet,
  onSubmit,
  searchCallback,
  resourceType,
  initialFormState = {},
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [showDropdowns, setShowDropdowns] = useState({});
  const [errors, setErrors] = useState({});
  const [searchCache, setSearchCache] = useState({});
  const dropdownRefs = useRef({});
  const dispatch = useDispatch();

  const ValidationFields = ()=>{
    const errors = {};
    formFields.forEach((field) => {
      if (!formData[field.name] && field.name != "note") {
        errors[field.name] = `please enter ${field.label}`;
      }
    });
    console.log("Errors:", errors);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const debouncedSearch = useCallback(
    debounce(async (term, field) => {
      if (term.length < 3) {
        setSearchResults((prev) => ({ ...prev, [field.name]: [] }));
        setErrors((prev) => ({
          ...prev,
          [field.name]: `Please enter at least 3 characters to search ${field.name}`,
        }));
        return;
      }

      setShowDropdowns((prev) => ({ ...prev, [field.name]: true }));
      const cacheKey = `${field.name}-${term}`;

      if (searchCache[cacheKey]) {
        return setSearchResults((prev) => ({
          ...prev,
          [field.name]: searchCache[cacheKey],
        }));
      }

      try {
        setIsLoading((prev) => ({ ...prev, [field.name]: true }));
        const data = await searchCallback(term, field.ecl);
        setSearchCache((prev) => ({ ...prev, [cacheKey]: data?.items }));
        setSearchResults((prev) => ({
          ...prev,
          [field.name]: data?.items,
        }));
      } catch (error) {
        console.error(`Error searching ${field}:`, error);
        setSearchResults((prev) => ({ ...prev, [field.name]: [] }));
      } finally {
        setIsLoading((prev) => ({ ...prev, [field?.name]: false }));
      }
    }, 500),
    []
  );

  useEffect(() => {
    function handleClickOutside(e) {
      Object.entries(dropdownRefs.current).forEach(([field, ref]) => {
        if (ref && !ref.contains(e.target)) {
          setShowDropdowns((prev) => ({ ...prev, [field]: false }));
        }
      });
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (e, field) => {
    const term = e.target.value;
    setErrors((prev) => ({ ...prev, [field.name]: "" }));
    setSearchTerms((prev) => ({ ...prev, [field.name]: term }));
    debouncedSearch(term, field);
  };

  const handleSelect = (item, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: item.pt.term,
      [`${field}Code`]: item.conceptId,
    }));
    setSearchTerms((prev) => ({ ...prev, [field]: item.pt.term }));
    setShowDropdowns((prev) => ({ ...prev, [field]: false }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);    
    if(!ValidationFields()){
      return
    }

    setIsLoading((prev) => ({ ...prev, submit: true }));
    try {
      await onSubmit(formData);
      closeSheet();
      setFormData(initialFormState);
      setSearchTerms({});
    } catch (error) {
      toast.error("Error submitting form:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className="w-full relative px-6 py-3 h-fit mx-auto bg-white rounded-lg customScrollbar">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Search Fields */}

        {formFields.map((field) => {
          if (field.fieldType === "textArea") {
            return (
              <div key={field.name} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  rows={3}
                  className="mt-1 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 shadow-sm sm:text-sm"
                />
                {errors[field.name] && (
                  <p className="text-[12px] text-red-700 mt-1">{errors[field.name]}</p>
                )}
              </div>
            );
          } else if (field.fieldType === "select") {
            return (
              <CustomSelect
                key={field.name}
                id={field.name}
                label={field.label}
                value={formData[field.name]}
                required={field.required}
                onChange={handleSelectChange}
                options={field.options}
                isInvalid={errors[field.name]}
              />
            );
          } else if (field.fieldType === "search") {
            return (
              <CutomInputDropdown
                field={field}
                searchTerms={searchTerms}
                handleSearch={handleSearch}
                required={field.required}
                showDropdowns={showDropdowns}
                searchResults={searchResults}
                isLoading={isLoading}
                dropdownRefs={dropdownRefs}
                handleSelect={handleSelect}
                isInvalid={errors[field.name]}
              />
            );
          } else {
             return <CustomInput
              key={field.name}
              id={field.name}
              label={field.label}
              required={field.required}
              type={field.type}
              value={formData[field.name]}
              placeholder={field.placeholder}
              onChange={handleInputChange}
              isInvalid={errors[field.name]}
            />;
          }
        })}

        <CustomButton
          type="submit"
          disabled={isLoading.submit}
          text={isLoading.submit ? "Saving..." : `Save ${resourceType}`}
        />
      </form>
    </div>
  );
};

export default FHIRFormComponent;
