import React from 'react'
import CustomInput from '../../Common/CustomInput'

const PersonalInfo = ({ele, index}) => {
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
          htmlFor="gender"
          className="text-gray-800 text-sm font-medium mb-1"
        >
          Gender<span className="text-gray-400">*</span>
        </label>
        <select
          id="type"
          name="gender"
          // value={besicClientInfo.type || ""}
          // onChange={(e) => handleChange("type", e.target.value)}
          className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <option value="" disabled>
            Gender
          </option>
          <option value="male">Male</option>
          <option value="femlae">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="relation"
          className="text-gray-800 text-sm font-medium mb-1"
        >
          Relation<span className="text-gray-400">*</span>
        </label>
        <select
          id="type"
          name="relation"
          // value={besicClientInfo.type || ""}
          // onChange={(e) => handleChange("type", e.target.value)}
          className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <option value="" disabled>
            Select
          </option>
          <option value="male">Self</option>
          <option value="femlae">Father</option>
          <option value="mother">Mother</option>
          <option value="wife">Wife</option>
          <option value="husband">Husband</option>
          <option value="son">Son</option>
          <option value="daughter">Daughter</option>
          <option value="sister">Sister</option>
          <option value="bother">Bother</option>
        </select>
      </div>
    </div>
  </div>
  )
}

export default PersonalInfo