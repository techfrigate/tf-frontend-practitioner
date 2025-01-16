import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import CustomTable from "../../Components/Common/CustomTable";
import PatientsTd from "./PatientsTd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../../Store/patientSlice";
import Loading from "../../Components/Common/Loading";
import PatientsttrHeader from "./PatientstrHeader";

const Patients = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const dispatch = useDispatch();

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  useEffect(() => {
    dispatch(fetchPatients({ page: currentPage, limit: itemsPerPage }));
  }, [currentPage, itemsPerPage, dispatch]);

  const { totalPages, status } = useSelector((state) => state.patient);
 
  if (status === "loading") {
    return <Loading size="16" color="teal-500" className="h-screen" />;
  }

  return (
    <div className="overflow-x-auto sm:rounded-lg">
      <CustomTable trHeader={PatientsttrHeader}>
        <PatientsTd />
      </CustomTable>
      <ReactPaginate
      forcePage={currentPage-1}
        previousLabel={"«"}
        nextLabel={"»"}
        breakLabel={"..."}
        pageCount={totalPages} 
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
        // eslint-disable-next-line
        forcePage={currentPage - 1}
      />
    </div>
  );
};

export default Patients;
