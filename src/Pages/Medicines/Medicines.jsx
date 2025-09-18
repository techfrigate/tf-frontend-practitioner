import React, { useState, useEffect } from "react";
import MedicinesTd from "./MedicinesTd";
import MedicinestrHeader from "./MedicinestrHeader";
import ReactPaginate from "react-paginate";
import CustomTable from "../../Components/Common/CustomTable";
import {
  clearMadicinesError,
  getAllMedicines,
} from "../../Store/MedicinesSlice";
import { useDispatch, useSelector } from "react-redux";
import { PackageSearch } from "lucide-react";  
import Loader from "../../Components/Common/Loader";
import toast from "react-hot-toast";
const Medicines = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("locationName");
  const [order, setOrder] = useState("asc");

  const itemsPerPage = 5;
  const dispatch = useDispatch();
  const { totalPages, medicines, isLoading, error } = useSelector(
    (state) => state.medicines
  );
  const { profileData } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(
      getAllMedicines({
        currentPage: currentPage,
        itemsPerPage,
        sortBy,
        order,
        doctorId: profileData._id,
      })
    );
  }, [currentPage,sortBy,order]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  function handleSortClick(field){
    setSortBy(field);
  }
  function handleOrderClick(order){
    setOrder(order)
  }
  useEffect(() => {
    if (error) {
      toast.error(error);
      setTimeout(() => {
        dispatch(clearMadicinesError());
      }, 2000);
    }
  }, [error]);


  return (
    <div className="overflow-y-auto h-full sm:rounded-lg">
      {isLoading ? (
        <Loader />
      ) : medicines.length > 0 ? (
        <>
          <CustomTable trHeader={<MedicinestrHeader setSortBy={handleSortClick} setOrder={handleOrderClick} sortBy={sortBy} order={order} />}>
            <MedicinesTd />
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
          />
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center bg-gray-50 shadow-md rounded-lg p-6">
            <PackageSearch className="w-16 h-16 text-[#64c6b0]" />
            <p className="mt-4 text-lg font-semibold text-gray-600">
              No Medicines Found
            </p>
            <p className="text-sm text-gray-500">
              Try adding new medicines or adjusting your search criteria.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicines;
