import React, { useState } from "react";
import { data } from "./WorkListData";
import ReactPaginate from "react-paginate";
import WorkListTd from "./WorkListTd";
import WorkListtrHeader from "./WorkListtrHeader";
import PatientDetails from "../Prescription/PatientDetails";
import CustomTable from "../../Components/Common/CustomTable";

// Function to check if the appointment time has passed
// Function to check if appointment can be checked-in
const canCheckIn = (appointmentTime) => {
  const now = new Date();
  const appointmentDate = new Date(appointmentTime);

  // 5 minutes before appointment
  const checkInAllowedTime = new Date(appointmentDate.getTime() - 5 * 60000);

  return now >= checkInAllowedTime; 
};


const WorkList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showPatientDetail, setShowPatientDetail] = useState(true);
  const itemsPerPage = 5;

  // Filter the data to show only scheduled appointments after their time
  const filteredData = data.filter((appointment) => {
  return (
    appointment.status === "Scheduled" && canCheckIn(appointment.appointmentTime)
  );
});


  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handlePrescription = () => {
    setShowPatientDetail(true);
  };

  return (
    <div className="sm:rounded-lg h-[100%]">
      {showPatientDetail ? (
        <PatientDetails />
      ) : (
        <div>
          <CustomTable trHeader={WorkListtrHeader}>
            {/* Pass the filtered data slice to WorkListTd */}
            <WorkListTd
              offset={offset}
              itemsPerPage={itemsPerPage}
              handlePrescription={handlePrescription}
              data={filteredData} // Pass the filtered data to the component
            />
          </CustomTable>
          <ReactPaginate
            previousLabel={"«"}
            nextLabel={"»"}
            breakLabel={"..."}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"flex justify-center mt-6 mb-0"}
            pageClassName={"mx-1"}
            pageLinkClassName={
              "block px-4 py-2 rounded hover:bg-[#4cb59c] hover:text-white"
            }
            previousClassName={"mx-1"}
            previousLinkClassName={
              "block px-3 py-2 rounded bg-slate-100 hover:bg-[#4cb59c] hover:text-white"
            }
            nextClassName={"mx-1"}
            nextLinkClassName={
              "block px-3 py-2 rounded bg-slate-100 hover:bg-[#4cb59c] hover:text-white"
            }
            activeClassName={"bg-[#64c6b0] text-white rounded"}
            activeLinkClassName={"border-none"}
          />
        </div>
      )}
    </div>
  );
};

export default WorkList;