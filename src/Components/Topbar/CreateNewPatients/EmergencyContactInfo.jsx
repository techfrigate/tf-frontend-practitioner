import React from 'react'
import CustomInput from '../../Common/CustomInput'

const EmergencyContactInfo = ({ele,index}) => {
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
    </div>
  </div>
  )
}

export default EmergencyContactInfo