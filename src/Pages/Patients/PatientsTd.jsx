import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Swal from "sweetalert2";
import Loading from "../../Components/Common/Loading";
import { patchPatientById } from "../../Store/patientSlice";

const PatientsTd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateToPatient = (patientId) => {
    navigate(`/new-patient?id=${patientId}`);
  };

  const { patients, status } = useSelector((state) => state.patient);

  const handleStatusClick = async (e, patient) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: 'Update Patient Status',
      text: `Do you want to mark this patient as ${patient.status ? 'Inactive' : 'Active'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#64C6B0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(patchPatientById({
          id: patient._id,
          userId: patient.userId,
          updates: { status: !patient.status }
        })).unwrap();;
        await Swal.fire({
          title: 'Updated!',
          text: 'Patient status has been updated.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#64C6B0'
        });
      } catch (error) {
        await Swal.fire(
          'Error!',
          'Failed to update patient status.',
          'error'
        );
      }
    }
  };

  if (status === "loading") {
    return <Loading size="16" color="teal-500" className="h-screen" />;
  }

  return (
    <>
      {patients.length > 0 &&
        patients.map((item) => {
          const maskedPhone = `${item.phoneNumber.value}`;
          const formattedDob = format(new Date(item.dob), "MMM dd, yyyy");
          const formattedUpdatedAt = format(
            new Date(item.updatedAt),
            "MMM dd, yyyy"
          );
          return (
            <tr
              key={item._id}
              className="hover:bg-gray-100 bg-gray-50 border border-gray-300 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
              onClick={() => navigateToPatient(item._id)}
            >
              <td className="py-4 px-4 text-nowrap text-xs">
                <div className="flex gap-2 items-center">
                  <img
                    src={item.imageUrl}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <p>{`${item.firstName} ${item.lastName}`}</p>
                    <p className="text-gray-500">{item.gender}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-nowrap text-xs">{item.uhid}</td>
              <td className="py-4 px-4 text-nowrap text-xs">
                <span
                  onClick={(e) => handleStatusClick(e, item)}
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold cursor-pointer
                    ${item.status ? 'bg-green-100 text-green-900 border-green-400' : 'bg-red-100 text-red-900 border-red-400'}
                    hover:opacity-80 transition-opacity
                  `}
                >
                  {item.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-4 px-4 text-nowrap text-xs">{formattedDob}</td>
              <td className="py-4 px-4 text-nowrap text-xs">
                {formattedUpdatedAt}
              </td>
              <td className="py-4 px-4 text-nowrap text-xs">{maskedPhone}</td>
            </tr>
          );
        })}
    </>
  );
};

export default PatientsTd;