import React, { useEffect, useState } from "react";
import CustomInput from "../../Common/CustomInput";
import PhoneNumberInput from "../../Common/PhoneNumberInput";
import { useDispatch } from "react-redux";
import { setPatientData } from "../../../Store/patientSlice";

const PersonalInfo = ({ ele, index, saved }) => {
  const [formData, setFormData] = useState(() =>
    ele?.formInput?.reduce((acc, input) => {
      acc[input.id] = input.value || "";
      return acc;
    }, {})
  );

  const dispatch = useDispatch();

  const [validationErrors, setValidationErrors] = useState({
    FName: "",
    LName: "",
    DOB: "",
    ContactNo: "",
    Email: "",
    gender: "",
    relation: "",
  });

  useEffect(() => {
    setFormData(
      ele?.formInput?.reduce((acc, input) => {
        acc[input.id] = input.value || "";
        return acc;
      }, {})
    );
  }, [ele]);

  useEffect(() => {
    if (saved) {
      const errors = { ...validationErrors };
      Object.keys(formData).forEach((key) => {
        if (key !== "ContactNo") {
          if (!formData[key]) {
            errors[key] = `Please enter ${key}`;
          } else {
            errors[key] = "";
          }
        }
      });

      if (!formData.ContactNo) {
        errors.ContactNo = "Please enter a valid phone number";
      } else {
        errors.ContactNo = "";
      }

      if (!formData.gender) {
        errors.gender = "Please enter Gender";
      } else {
        errors.gender = "";
      }

      if (!formData.relation) {
        errors.relation = "Please enter relation";
      } else {
        errors.relation = "";
      }

      setValidationErrors(errors);
    }
    // eslint-disable-next-line
  }, [formData, saved]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    dispatch(setPatientData({ [id]: value }));
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
        {ele?.formInput?.map((elem) => {
          if (elem.id === "ContactNo") {
            return (
              <PhoneNumberInput
                key={elem.id}
                type="text"
                label={elem.label}
                id={elem.id}
                placeholder={elem.placeholder}
                dialCode={elem.dialCode || "+91"}
                value={formData[elem.id] || ""}
                isInvalid={validationErrors[elem.id]}
                onChangeDialCode={(code) =>
                  handleChange({
                    target: {
                      id: elem.id,
                      value: `${code} ${formData[elem.id].replace(
                        /^\+91\s*/,
                        ""
                      )}`,
                    },
                  })
                }
                onChangeNumber={(number) =>
                  handleChange({ target: { id: elem.id, value: number } })
                }
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
              onChange={handleChange}
              value={formData[elem.id] || ""}
              isInvalid={validationErrors[elem.id]}
            />
          );
        })}
        <div>
          <label
            htmlFor="gender"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            Gender<span className="text-gray-400">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            onChange={handleChange}
            value={formData.gender || ""}
            className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 disabled:cursor-not-allowed disabled:opacity-50 ${
              validationErrors.gender
                ? "border-red-500 shadow-red-400/50"
                : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {validationErrors.gender && (
            <p className="text-[12px] text-red-700 -mt-1">
              {validationErrors.gender}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="relation"
            className="text-gray-800 text-sm font-medium mb-1"
          >
            Relation<span className="text-gray-400">*</span>
          </label>
          <select
            id="relation"
            name="relation"
            onChange={handleChange}
            value={formData.relation || ""}
            className={`flex mt-1 h-10 w-full max-w-sm rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:shadow-md focus:border-[#64C6B0] focus:shadow-[#64C6B0]/30 disabled:cursor-not-allowed disabled:opacity-50 ${
              validationErrors.relation
                ? "border-red-500 shadow-red-400/50"
                : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="self">Self</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="wife">Wife</option>
            <option value="husband">Husband</option>
            <option value="son">Son</option>
            <option value="daughter">Daughter</option>
            <option value="sister">Sister</option>
            <option value="brother">Brother</option>
          </select>
          {validationErrors.relation && (
            <p className="text-[12px] text-red-700 -mt-1">
              {validationErrors.relation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
