import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Swal from "sweetalert2";
import Loading from "../../Components/Common/Loading";
import {
  patchPatientById,
  patchPatientByIdStatus,
} from "../../Store/patientSlice";
import { MdModeEdit } from "react-icons/md";
import Cookies from "js-cookie";
const PatientsTd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateToPatient = (patientId) => {
    navigate(`/new-patient?id=${patientId}`);
  };
  const tenantId = Cookies.get("TenantId");
  const { patients, status } = useSelector((state) => state.patient);

  const handleStatusClick = async (tenant, itemId, e, userId) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Update Patient Status",
      text: `Do you want to mark this patient as ${
        tenant.status ? "Inactive" : "Active"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#64C6B0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(
          patchPatientByIdStatus({
            id: itemId,
            userId,
            updates: { status: !tenant.status },
          })
        ).unwrap();
        await Swal.fire({
          title: "Updated!",
          text: "Patient status has been updated.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#64C6B0",
        });
      } catch (error) {
        await Swal.fire("Error!", "Failed to update patient status.", "error");
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
            >
              <td className="py-4 px-4 text-nowrap text-xs">
                <div className="flex gap-2 items-center">
                  <img
                    src={item.imageUrl}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="w-8 h-8 rounded-full object-contain"
                  />
                  <div className="flex flex-col">
                    <p>{`${item.firstName} ${item.lastName}`}</p>
                    <p className="text-gray-500">{item.gender}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-nowrap text-xs">{item.uhid}</td>
              {item.tenants.map(
                (tenant) =>
                  tenant.userType === "patient" &&
                  tenant.tenantId === tenantId && (
                    <td className="py-4 px-6 text-sm text-[#1f7d68] font-semibold">
                      <span
                        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                          tenant.status
                            ? "bg-green-100 text-green-900"
                            : "bg-blue-100 text-blue-900"
                        }`}
                      >
                        {tenant.status ? "Active" : "Pending"}
                      </span>
                    </td>
                  )
              )}
              <td className="py-4 px-4 text-nowrap text-xs">{formattedDob}</td>
              <td className="py-4 px-4 text-nowrap text-xs">
                {formattedUpdatedAt}
              </td>
              <td className="py-4 px-4 text-nowrap text-xs">{maskedPhone}</td>

              <td className="flex flex-flow-col gap-6 text-xl text-[#64c6b0] py-5 px-7 text-[13px]">
                <div
                  className="hover:bg-gray-300 rounded-full p-2"
                  onClick={() => navigateToPatient(item._id)}
                >
                  <MdModeEdit />
                </div>
              </td>

              {item.tenants.map(
                (tenant) =>
                  tenant.userType === "patient" &&
                  tenant.tenantId === tenantId && (
                    <td className="py-3 px-6">
                      <label
                        htmlFor={`toggle-${item._id}-${tenant._id}`}
                        className="flex items-center gap-2 w-full max-w-full cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id={`toggle-${item._id}-${tenant._id}`}
                          checked={tenant.status}
                          onChange={(event) =>
                            handleStatusClick(
                              tenant,
                              item._id,
                              event,
                              item.userId
                            )
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-6 flex items-center rounded-full p-1 transition duration-300 ease-in-out ${
                            tenant.status ? "bg-[#64C6B0]" : "bg-gray-300"
                          }   cursor-pointer`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition duration-300 ease-in-out ${
                              tenant.status ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      </label>
                    </td>
                  )
              )}
            </tr>
          );
        })}
    </>
  );
};

export default PatientsTd;
