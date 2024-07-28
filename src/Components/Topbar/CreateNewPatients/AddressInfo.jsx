import React, { useState, useEffect, useCallback } from "react";
import CustomInput from "../../Common/CustomInput";
import { useDispatch } from "react-redux";
import { setPatientData } from "../../../Store/patientSlice";

const AddressInfo = ({ ele, index, saved }) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({
    Address1: "",
    PIN: "",
    country: "",
    state: "",
    city: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const initialData = ele?.formInput?.reduce((acc, input) => {
      acc[input.id] = "";
      return acc;
    }, {});
    setFormData(initialData);
  }, [ele]);

  useEffect(() => {
    if (saved) {
      const errors = { ...validationErrors };

      Object.keys(formData).forEach((key) => {
        if (!formData[key] && key !== "Address2") {
          errors[key] = `Please enter ${key}`;
        } else {
          errors[key] = "";
        }
      });

      if (!formData.country) {
        errors.country = "Please select a country";
      } else {
        errors.country = "";
      }

      if (!formData.state) {
        errors.state = "Please select a state";
      } else {
        errors.state = "";
      }

      if (!formData.city) {
        errors.city = "Please select a city";
      } else {
        errors.city = "";
      }

      setValidationErrors(errors);
    }
    // eslint-disable-next-line
  }, [formData, saved]);

  const handleChange = useCallback(
    (e) => {
      const { id, value } = e.target;
      setFormData((prev) => {
        const updatedFormData = { ...prev, [id]: value };
        dispatch(setPatientData({ [id]: value }));
        return updatedFormData;
      });
    },
    [dispatch]
  );

  return (
    <div
      key={index}
      className="rounded-xl border bg-white text-gray-900 shadow-md mt-3 p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="mb-4 border-b pb-2">
        <h1 className="text-sm font-semibold text-[#1e817e]">{ele.heading}</h1>
      </div>
      <div className="px-4 mt-4 grid grid-cols-3 gap-x-7 gap-y-4">
        {ele?.formInput?.map((elem) => (
          <CustomInput
            key={elem.id}
            type={elem.type}
            label={elem.label}
            id={elem.id}
            placeholder={elem.placeholder}
            value={formData[elem.id] || ""}
            onChange={handleChange}
            isInvalid={validationErrors[elem.id]}
          />
        ))}
        <div>
          <label
            htmlFor="country"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            Country<span className="text-gray-400">*</span>
          </label>
          <select
            id="country"
            name="country"
            onChange={handleChange}
            value={formData.country || ""}
            className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 ${
              validationErrors.country
                ? "border-red-500 shadow-red-400/50"
                : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              Select Country
            </option>
            <option value="india">India</option>
          </select>
          {validationErrors.country && (
            <p className="text-[12px] text-red-700 -mt-1">
              {validationErrors.country}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="state"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            State/Province<span className="text-gray-400">*</span>
          </label>
          <select
            id="state"
            name="state"
            onChange={handleChange}
            value={formData.state || ""}
            className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 ${
              validationErrors.state
                ? "border-red-500 shadow-red-400/50"
                : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              Select State
            </option>
            <option value="rajasthan">Rajasthan</option>
          </select>
          {validationErrors.state && (
            <p className="text-[12px] text-red-700 -mt-1">
              {validationErrors.state}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="city"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            City<span className="text-gray-400">*</span>
          </label>
          <select
            id="city"
            name="city"
            onChange={handleChange}
            value={formData.city || ""}
            className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 ${
              validationErrors.city
                ? "border-red-500 shadow-red-400/50"
                : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              Select City
            </option>
            <option value="hanumangarh">Hanumangarh</option>
            <option value="churu">Churu</option>
          </select>
          {validationErrors.city && (
            <p className="text-[12px] text-red-700 -mt-1">
              {validationErrors.city}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;
