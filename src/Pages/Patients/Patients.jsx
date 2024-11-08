import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import CustomTable from "../../components/Common/CustomTable";
import PatientsTd from "./PatientsTd";
import { data } from "./PatientsData";
import PatientsttrHeader from "./PatientstrHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../../Store/patientSlice";

const Patients = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected+1);
  };

  const dispatch=  useDispatch()

  useEffect(()=>{
    dispatch(fetchPatients({page:currentPage,limit:itemsPerPage}))
  },[currentPage,itemsPerPage])


  const{totalPages} = useSelector((state)=>state.patient)

  return (
    <div className="overflow-x-auto sm:rounded-lg">
      <CustomTable trHeader={PatientsttrHeader}>
        <PatientsTd />
      </CustomTable>
      <ReactPaginate
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
      />
    </div>
  );
};

export default Patients;
