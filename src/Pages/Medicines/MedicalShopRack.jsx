import React, { useState, useEffect } from 'react';
import { Package, Edit2, Trash2, X, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import CommonLocationSelect from '../../Components/Common/CommonLocationSelect';
import CustomSelect from '../../Components/Common/CustomSelect';
import { fetchLocations } from "../../Store/locationSlice";
import {
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getAllMedicines,
  getPharmacies
} from "../../Store/MedicinesSlice";
import Cookies from "js-cookie";
import Loader from "../../Components/Common/Loader";

const STATUS_CONFIG = {
  full: { color: 'bg-green-500', label: 'Full (100+ units)' },
  partial: { color: 'bg-yellow-500', label: 'Partial (1-100 units)' },
  empty: { color: 'bg-red-500', label: 'Empty (0 units)' }
};

const INITIAL_FORM_STATE = {
  medicineName: '',
  type: 'rack',
  unit: 0,
  status: 'empty',
  enable: true,
  rackName: ''
};

const MedicalRackApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { locations } = useSelector(state => state.locations);
  const { medicines, isLoading, error } = useSelector(state => state.medicines);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [availablePharmacies, setAvailablePharmacies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRack, setCurrentRack] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const { profileData } = useSelector((state) => state.profile);
  const [filterStatus, setFilterStatus] = useState(null);

  const determineStatus = units => {
    if (units === 0) return 'empty';
    if (units <= 100) return 'partial';
    return 'full';
  };

  const handleError = error => error && toast.error(error);
  
  useEffect(() => {
    if (!locations?.length) {
      dispatch(
        fetchLocations({
          currentPage: null,
          itemsPerPage: null,
          sortBy: "name",
          order: "desc",
        })
      );
    }
    handleError(error);
  }, [dispatch, locations, error]);

  const fetchRacks = async () => {
    if (!selectedLocation?._id || !selectedPharmacy?._id) return;
    
    try {
      await dispatch(getAllMedicines({
        locationId: selectedLocation._id,
        pharmacyId: selectedPharmacy._id,
        doctorId: profileData._id,
        type: 'rack'
      })).unwrap();
    } catch {
      toast.error('Failed to fetch racks');
    }
  };

  useEffect(() => {
    selectedPharmacy ? fetchRacks() : dispatch({ type: 'Medicines/clearMedicines' });
     // eslint-disable-next-line
  }, [selectedLocation, selectedPharmacy]);

  useEffect(() => {
    const fetchRackData = async () => {
      const rackId = searchParams.get("id");
      if (!rackId || !locations?.length) return;
      
      try {
        const rackData = await dispatch(getMedicineById(rackId)).unwrap();
        if (!rackData?.locationId) throw new Error("Rack data not found");

        const locationObj = locations.find(loc => loc._id === rackData.locationId);
        if (!locationObj) throw new Error("Location not found");

        setSelectedLocation(locationObj);
        
        const pharmacyResponse = await dispatch(getPharmacies({locationId: rackData.locationId})).unwrap();
        
        const pharmacyOptions = pharmacyResponse?.map((p) => ({
          value: p._id,
          label: p.name,
          ...p,
        })) || [];
        
        setAvailablePharmacies(pharmacyOptions);
        
        const pharmacyObj = pharmacyResponse.find(p => p._id === rackData.pharmacyId);
        if (!pharmacyObj) throw new Error("Pharmacy not found");

        setSelectedPharmacy(pharmacyObj);
        setFormData({ 
          ...rackData, 
          type: 'rack',
          status: determineStatus(rackData.unit || 0)
        });
        setCurrentRack(rackData);
        setIsModalOpen(true);
      } catch (error) {
        toast.error(error.message || "Failed to fetch rack details");
        navigate("/Medicines");
      }
    };

    fetchRackData();
  }, [searchParams, locations, dispatch, navigate]);

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setSelectedPharmacy(null);
    
    if (location?._id) {
      try {
        const response = await dispatch(getPharmacies({locationId: location._id})).unwrap();
        
        const pharmacyOptions = response?.map((p) => ({
          value: p._id,
          label: p.name,
          ...p,
        })) || [];
        
        setAvailablePharmacies(pharmacyOptions);
      } catch (error) {
        console.log("Error fetching pharmacies:", error);
        toast.error("Failed to load pharmacies");
      }
    } else {
      setAvailablePharmacies([]);
    }
  };

  const handlePharmacySelect = (selectedPharmacyId) => {
    const pharmacy = availablePharmacies.find(p => p._id === selectedPharmacyId);
    setSelectedPharmacy(pharmacy);
  };

  const handleEditRack = (rack) => {
    setCurrentRack(rack);
    setFormData({
      ...rack,
      status: determineStatus(rack.unit || 0)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const rackData = {
      ...formData,
      locationId: selectedLocation._id,
      tenantId: Cookies.get("TenantId"),
      practitionerId: profileData._id,
      pharmacyName: selectedPharmacy.name,
      pharmacyId: selectedPharmacy._id,
      type: 'rack'
    };
    
    try {
      await dispatch(updateMedicine({ 
        medId: currentRack._id, 
        body: rackData 
      })).unwrap();
      toast.success("Rack updated successfully!");
      setIsModalOpen(false);
      fetchRacks();
    } catch (error) {
      console.log(error);
      toast.error('Failed to update rack');
    }
  };

  const filteredRacks = medicines?.filter(rack => {
    if (!selectedPharmacy) return false;
    if (rack.pharmacyId !== selectedPharmacy._id) return false;
    if (filterStatus && determineStatus(rack.unit || 0) !== filterStatus) return false;
    return true;
  });

  const RackCard = ({ rack }) => {
    const status = determineStatus(rack.unit || 0);
    return (
      <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200 p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${STATUS_CONFIG[status].color} bg-opacity-20`}>
              <Package className={`text-${status === 'empty' ? 'red' : status === 'partial' ? 'yellow' : 'green'}-700`} size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">{rack.medicineName}</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleEditRack(rack)} 
              className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors duration-200"
              title="Edit Rack"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this rack?')) {
                  dispatch(deleteMedicine(rack._id)).unwrap()
                    .then(() => {
                      toast.success('Rack deleted successfully');
                      fetchRacks();
                    })
                    .catch((err) => {
                      console.log(err);
                      toast.error('Failed to delete rack');
                    });
                }
              }} 
              className="p-2 hover:bg-red-50 rounded-full text-red-600 transition-colors duration-200"
              title="Delete Rack"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-md mb-3">
          <div className="text-sm font-medium text-gray-700">Rack No. {rack.rackName}</div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Units Available</span>
          <span className={`text-sm px-3 py-1 rounded-full ${STATUS_CONFIG[status].color} text-white font-medium`}>
            {rack.unit || 0} Units
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {isLoading ? <div className="flex justify-center items-center h-64"><Loader /></div> : (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="text-blue-600 mr-2" size={24} />
              Medical Rack Management
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <CommonLocationSelect
                locations={locations}
                value={selectedLocation}
                onChange={handleLocationSelect}
                onClear={() => handleLocationSelect(null)}
              />
              <CustomSelect
                id="pharmacyName"
                label="Pharmacy"
                value={selectedPharmacy?._id || ''}
                options={availablePharmacies}
                onChange={(e) => handlePharmacySelect(e.target.value)}
                isDisabled={!selectedLocation}
                isClearable
              />
            </div>
          </div>
          
          {selectedLocation && selectedPharmacy ? (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setFilterStatus(null)} 
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${!filterStatus ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors duration-200`}
                  >
                    All Racks
                  </button>
                  {Object.entries(STATUS_CONFIG).map(([status, { color, label }]) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status === filterStatus ? null : status)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${filterStatus === status ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors duration-200`}
                    >
                      <div className={`w-3 h-3 rounded-full ${color}`}></div>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={fetchRacks} 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <RefreshCw size={16} />
                  <span className="font-medium">Refresh</span>
                </button>
              </div>
              
              {filteredRacks?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRacks.map(rack => <RackCard key={rack._id} rack={rack} />)}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Racks Found</h3>
                  <p className="text-gray-500 mb-6">
                    {filterStatus 
                      ? `No ${filterStatus} racks found in this pharmacy.` 
                      : "There are no racks in this pharmacy yet."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Data to Display</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Please select a location and pharmacy from the dropdown menus above to view and manage racks.
              </p>
            </div>
          )}
          
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Edit2 size={20} className="text-blue-600 mr-2" />
                    {'Edit Rack' }
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rack Name
                      </label>
                      <input
                        type="text"
                        value={formData.medicineName}
                        onChange={(e) => setFormData(prev => ({ ...prev, medicineName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        placeholder="Enter rack name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rack Number
                      </label>
                      <input
                        type="text"
                        value={formData.rackName}
                        onChange={(e) => setFormData(prev => ({ ...prev, rackName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        placeholder="Enter rack number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Units
                      </label>
                      <input
                        type="number"
                        value={formData.unit}
                        onChange={(e) => {
                          const units = parseInt(e.target.value) || 0;
                          setFormData(prev => ({
                            ...prev,
                            unit: units,
                            status: determineStatus(units)
                          }));
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        min="0"
                        placeholder="Enter number of units"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className={`w-full px-4 py-3 border border-${formData.status === 'empty' ? 'red' : formData.status === 'partial' ? 'yellow' : 'green'}-300 rounded-lg ${STATUS_CONFIG[formData.status].color} text-white font-medium text-center`}>
                        {STATUS_CONFIG[formData.status].label}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {currentRack?._id ? 'Save Changes' : 'Add Rack'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRackApp;