import React, {  useState ,useEffect} from "react";
import MedicinesTd from "./MedicinesTd";
import MedicinestrHeader from "./MedicinestrHeader";
import ReactPaginate from "react-paginate";
import CustomTable from "../../Components/Common/CustomTable";
import { getAllMedicines } from "../../Store/MedicinesSlice";
import { useDispatch,useSelector } from "react-redux";


const Medicines = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dispatch=  useDispatch()
  const { totalPages} = useSelector((state) => state.Medicines);

  const offset = currentPage * itemsPerPage;
  const { profileData } = useSelector((state) => state.profile);

    useEffect(() => {
      dispatch(getAllMedicines({
        currentPage: currentPage,
        itemsPerPage,
        sortBy: 'updatedAt', 
        order: 'desc',
        doctorId:profileData._id
      }));
      // eslint-disable-next-line
    }, [currentPage])


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected +1);
  };

  return (
    <>
      <div className="overflow-y-auto sm:rounded-lg">
        <CustomTable trHeader={MedicinestrHeader}>
          <MedicinesTd offset={offset} itemsPerPage={itemsPerPage} />
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
    </>
  );
};

export default Medicines;
