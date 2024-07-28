import React from "react";
import { useDispatch } from "react-redux";
import CustomInput from "../../Common/CustomInput";
import PhoneNumberInput from "../../Common/PhoneNumberInput";
import { setPatientData } from "../../../Store/patientSlice";

const EmergencyContactInfo = ({ ele, index }) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;

    dispatch(setPatientData({ emergencyContact: { [id]: value } }));
  };

  return (
    <div
      key={index}
      className="rounded-xl border bg-white text-gray-900 shadow-md mt-3 p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="mb-4 border-b pb-2">
        <h1 className="text-sm font-semibold text-[#1e817e]">{ele.heading}</h1>
      </div>
      <div className="px-4 mt-4 grid grid-cols-3 gap-x-7 gap-y-4">
        {ele?.formInput?.map((elem, idx) => {
          if (elem.id === "ContactNo") {
            return (
              <PhoneNumberInput
                key={elem.id}
                type="text"
                label={elem.label}
                id={elem.id}
                placeholder={elem.placeholder}
                dialCode={elem.dialCode || "+91"}
                value={elem.value}
                isInvalid={elem.isInvalid}
                onChangeDialCode={(code) => {
                  const newValue = `${code} ${elem.value.replace(
                    /^\+91\s*/,
                    ""
                  )}`;
                  handleChange({
                    target: {
                      id: elem.id,
                      value: newValue,
                    },
                  });
                }}
                onChangeNumber={(number) => {
                  handleChange({ target: { id: elem.id, value: number } });
                }}
              />
            );
          }
          return (
            <CustomInput
              key={elem.id}
              type={elem.type}
              label={elem.label}
              id={elem.id}
              placeholder={elem.placeholder}
              onChange={(e) => {
                handleChange(e);
              }}
              value={elem.value}
              isInvalid={elem.isInvalid}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyContactInfo;
