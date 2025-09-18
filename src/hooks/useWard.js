import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  setSelectedBuilding,
  setSelectedFloor,
  setSelectedWard,
  setSelectedBed,
  updateBedStatus,
  fetchBuildings,
  fetchFloors,
  fetchWards,
  fetchBeds,
  fetchAllBookedBeds,
} from "../Store/wardSlice";
import { fetchLocations } from "../Store/locationSlice";

const useWard = () => {
  const dispatch = useDispatch();
  const { buildings, selectedBuilding, selectedFloor, selectedWard, bookedBed = [], beds } =
    useSelector((state) => state.ward);
  const { locations, fetchStatus } = useSelector((state) => state.locations);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [expandedBuilding, setExpandedBuilding] = useState(selectedBuilding);
  const [expandedFloor, setExpandedFloor] = useState(selectedFloor);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const sortBy = "number";
  const order = "asc";

  useEffect(() => {
    dispatch(
      fetchLocations({
        currentPage: 1,
        itemsPerPage: 20,
        sortBy: "name",
        order: "asc",
      })
    );
  }, [dispatch]);

  const handleLocationChange = (event) => {
    const locationId = event.target.value;
    setSelectedLocation(locationId);
    setExpandedBuilding(null);
    setExpandedFloor(null);
    dispatch(setSelectedBuilding(null));
    dispatch(setSelectedFloor(null));
    dispatch(setSelectedWard(null));
    dispatch(fetchBuildings(locationId));
  };

  const handleBuildingClick = (buildingId) => {
    const isExpanded = expandedBuilding === buildingId;
    setExpandedBuilding(isExpanded ? null : buildingId);
    dispatch(setSelectedBuilding(buildingId));
    setExpandedFloor(null);
    dispatch(setSelectedFloor(null));
    dispatch(setSelectedWard(null));
    if (!isExpanded) dispatch(fetchFloors(buildingId));
  };

  const handleFloorClick = (floor) => {
    const isExpanded = expandedFloor === floor._id;
    setExpandedFloor(isExpanded ? null : floor._id);
    dispatch(setSelectedFloor(floor._id));
    dispatch(setSelectedWard(null));
    if (!isExpanded) dispatch(fetchWards(floor._id));
  };

  const handleWardClick = (wardId) => {
    dispatch(setSelectedWard(wardId));
    dispatch(setSelectedBed(null));
    setCurrentPage(1);
    dispatch(fetchBeds({ wardId, currentPage: 1, itemsPerPage, sortBy, order })).then(() => {
      dispatch(fetchAllBookedBeds());
    });
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setCurrentPage(newPage);
    if (selectedWard) {
      dispatch(fetchBeds({ wardId: selectedWard, currentPage: newPage, itemsPerPage, sortBy, order })).then(() => {
        dispatch(fetchAllBookedBeds());
      });
    }
  };

  const handleBedClick = (bed) => {
    if (bed.status === "available") {
      dispatch(setSelectedBed(bed._id));
      dispatch(updateBedStatus({ bedId: bed._id, bedStatus: "booked" }));
    }
  };

  const getSelectedWardData = () => {
    for (let b of buildings) {
      if (!b.floors) continue;
      for (let f of b.floors) {
        if (!f.wards) continue;
        for (let w of f.wards) {
          if (w._id === selectedWard) {
            return { ...w, floor: f.level, building: b._id };
          }
        }
      }
    }
    return null;
  };

  return {
    buildings,
    selectedBuilding,
    selectedFloor,
    selectedWard,
    bookedBed,
    beds,
    locations,
    fetchStatus,
    selectedLocation,
    expandedBuilding,
    expandedFloor,
    currentPage,
    handleLocationChange,
    handleBuildingClick,
    handleFloorClick,
    handleWardClick,
    handlePageClick,
    handleBedClick,
    getSelectedWardData,
  };
};

export default useWard;
