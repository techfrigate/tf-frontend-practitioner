import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import CustomTable from "../../Components/Common/CustomTable";
import PatientsTd from "./PatientsTd";
import { useDispatch, useSelector } from "react-redux";
import { clearError, fetchPatients } from "../../Store/patientSlice";
import Loading from "../../Components/Common/Loading";
import PatientsttrHeader from "./PatientstrHeader";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../Components/Common/Loader";

const Patients = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const itemsPerPage = 5;

  const dispatch = useDispatch();
  function handleSortField(field) {
    setSortBy(field)
  }
  function handleSortOrder(order) {
    setOrder(order)
  }


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  useEffect(() => {
    dispatch(fetchPatients({ page: currentPage, limit: itemsPerPage,sortBy,order }));
  }, [currentPage, itemsPerPage, dispatch,sortBy,order]);

  const { totalPages, isLoading, patients, error,saveStatus,saveError } = useSelector(
    (state) => state.patient
  );

  useEffect(() => {
    if(error || saveError){
      toast.error(error?error:saveError);
    }
    setTimeout(() => {
      dispatch(clearError());
    }, 2000);
  }, [error,saveError]);


  return (
    <div className="overflow-x-auto sm:rounded-lg h-full">
      {
        (isLoading || saveStatus) ?<Loader/> :
        patients.length > 0 ? (
        <>
          <CustomTable trHeader={<PatientsttrHeader sortBy={sortBy} setSortBy={handleSortField} setOrder={handleSortOrder} order={order}/>}>
            <PatientsTd />
          </CustomTable>
          <ReactPaginate
            forcePage={currentPage - 1}
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
        </>
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex flex-col items-center justify-center h-64 text-gray-600">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <p className="mt-4 text-lg font-semibold">No Patients Found</p>
            <p className="text-gray-500">
              Try adding some patients or check back later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
