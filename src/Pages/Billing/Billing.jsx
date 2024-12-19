import React, { useState } from "react";
import BillingTd from "./BillingTd";
import BillingtrHeader from "./BillingtrHeader";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../Components/Common/CustomTable";
import { data } from "./billingdata";
import CustomButton from "../../Components/Common/CustomButton";

const Billing = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const pageCount = Math.ceil(data.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleAddBillClick = () => {
    navigate("/AddBill");
  };

  return (
    <>
      <div className="flex relative px-3 py-2 w-full  justify-end">
        <CustomButton text="+ New Bill" onclick={handleAddBillClick} />
      </div>

      <div className="overflow-y-auto sm:rounded-lg">
        <CustomTable trHeader={BillingtrHeader}>
          <BillingTd offset={offset} itemsPerPage={itemsPerPage} />
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
    </>
  );
};

export default Billing;
