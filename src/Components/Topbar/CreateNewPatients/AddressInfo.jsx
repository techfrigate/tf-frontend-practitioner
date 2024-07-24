import React from 'react'
import CustomInput from '../../Common/CustomInput'

const AddressInfo = ({ele, index}) => {
  return (
    <div
          key={index}
          className="rounded-xl border bg-white text-gray-900 shadow-md mt-3 p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="mb-4 border-b pb-2">
            <h1 className="text-sm font-semibold text-[#1e817e]">
              {ele.heading}
            </h1>
          </div>
          <div className="px-4 mt-4 grid grid-cols-3 gap-x-7 gap-y-4">
            {ele?.formInput?.map((elem, index) => (
              <CustomInput
                key={elem.id}
                type={elem.type}
                label={elem.label}
                id={elem.id}
                placeholder={elem.placeholder}
                // value={besicClientInfo[elem.id] || ""}
                // isInvalid={invalidFields[elem.id]}
                // onchange={(e) => handleChange(elem.id, e.target.value)}
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
                id="type"
                name="country"
                // value={besicClientInfo.type || ""}
                // onChange={(e) => handleChange("type", e.target.value)}
                className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="" disabled>
                  Select Country
                </option>
                <option value="india">India</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="country"
                className="text-gray-800 text-sm font-medium mb-1"
              >
                State/Province<span className="text-gray-400">*</span>
              </label>
              <select
                id="state"
                name="state"
                // value={besicClientInfo.type || ""}
                // onChange={(e) => handleChange("type", e.target.value)}
                className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="" disabled>
                  Select State
                </option>
                {/* <option value="india">India</option> */}
              </select>
            </div>

            <div>
              <label
                htmlFor="country"
                className="text-gray-800 text-sm font-medium mb-1"
              >
                City<span className="text-gray-400">*</span>
              </label>
              <select
                id="city"
                name="city"
                // value={besicClientInfo.type || ""}
                // onChange={(e) => handleChange("type", e.target.value)}
                className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="" disabled>
                  Select City
                </option>
                {/* <option value="india">India</option> */}
              </select>
            </div>
          </div>
        </div>
  )
}

export default AddressInfo