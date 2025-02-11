import React, { useState, useEffect } from "react";
import BillingTd from "./BillingTd";
import BillingtrHeader from "./BillingtrHeader";
import ReactPaginate from "react-paginate";
import CustomTable from "../../Components/Common/CustomTable";
import { getAllBillings } from "../../Store/billingSlice";
import { useDispatch, useSelector } from "react-redux";
import { FileText } from "lucide-react"; // Importing an icon from lucide-react

const Billing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dispatch = useDispatch();
  const { totalPages, billings } = useSelector((state) => state.billing);
  const { profileData } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(
      getAllBillings({
        currentPage: currentPage,
        itemsPerPage,
        sortBy: "updatedAt",
        order: "desc",
        doctorId: profileData._id,
      })
    );
    // eslint-disable-next-line
  }, [currentPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div className="overflow-y-auto h-full sm:rounded-lg">
      {billings.length > 0 ? (
        <>
          <CustomTable trHeader={BillingtrHeader}>
            <BillingTd />
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
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center justify-center bg-gray-50 shadow-md rounded-lg p-6">
          <FileText className="w-16 h-16 text-gray-400" />
          <p className="mt-4 text-lg font-semibold text-gray-600">
            No Billing Records Found
          </p>
          <p className="text-sm text-gray-500">
            No invoices or bills available. Please generate a new billing record.
          </p>
        </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
