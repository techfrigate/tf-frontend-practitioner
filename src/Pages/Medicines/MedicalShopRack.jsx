import React, { useState, useEffect } from 'react';
import { Package, Edit2, Trash2, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import CommonLocationSelect from '../../Components/Common/CommonLocationSelect';
import CustomSelect from '../../Components/Common/CustomSelect';
import { fetchLocations } from "../../Store/locationSlice";
import {  getMedicineById,  updateMedicine,  deleteMedicine,getAllMedicines } from "../../Store/MedicinesSlice";

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
  enable: true
};

const MedicalRackApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { locations } = useSelector(state => state.locations);
  const { medicines, error } = useSelector(state => state.Medicines);
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [availablePharmacies, setAvailablePharmacies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRack, setCurrentRack] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const determineStatus = units => {
    if (units === 0) return 'empty';
    if (units <= 100) return 'partial';
    return 'full';
  };

  const handleError = error => error && toast.error(error);
  
  useEffect(() => {
    if (!locations?.length) {
      dispatch(fetchLocations({ sortBy: 'name', order: 'desc' }));
    }
    handleError(error);
  }, [dispatch, locations, error]);

  const fetchRacks = async () => {
    if (!selectedLocation?._id || !selectedPharmacy?._id) return;
    
    try {
      await dispatch(getAllMedicines({
        locationId: selectedLocation._id,
        pharmacyId: selectedPharmacy._id,
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

        handleLocationSelect(locationObj);
        const pharmacyObj = locationObj.pharmacy?.find(p => p._id === rackData.pharmacyId);
        if (!pharmacyObj) throw new Error("Pharmacy not found");

        setSelectedPharmacy(pharmacyObj);
        setFormData({ ...rackData, type: 'rack' });
        setCurrentRack(rackData);
        setIsModalOpen(true);
      } catch (error) {
        toast.error(error.message || "Failed to fetch rack details");
        navigate("/Medicines");
      }
    };

    fetchRackData();
  }, [searchParams, locations, dispatch, navigate]);

  const handleLocationSelect = location => {
    setSelectedLocation(location);
    setSelectedPharmacy(null);
    setAvailablePharmacies(location?.pharmacy?.map(p => ({
      value: p._id,
      label: p.name,
      ...p
    })) || []);
  };

  const handleEditRack = (rack) => {
    setCurrentRack(rack);
    setFormData({
      ...rack,
      status: determineStatus(rack.unit)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const rackData = {
      ...formData,
      locationId: selectedLocation._id,
      locationName: selectedLocation.name,
      pharmacyId: selectedPharmacy._id,
      pharmacyName: selectedPharmacy.name,
      type: 'rack'
    };
    
    try {
      await dispatch(updateMedicine({ medId: currentRack._id, body: rackData })).unwrap();
      toast.success("Rack updated successfully!");
      setIsModalOpen(false);
      fetchRacks();
    } catch {
      toast.error('Failed to update rack');
    }
  };

  const RackCard = ({ rack }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Package className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">{rack.medicineName}</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleEditRack(rack)} className="p-1 hover:bg-gray-100 rounded">
            <Edit2 size={16} className="text-gray-600" />
          </button>
          <button onClick={() => dispatch(deleteMedicine(rack._id)).unwrap()
            .then(() => {
              toast.success('Rack deleted successfully');
              fetchRacks();
            })
            .catch(() => toast.error('Failed to delete rack'))} 
            className="p-1 hover:bg-gray-100 rounded">
            <Trash2 size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-600">Rack No. {rack.rackName}</div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Units Available</span>
        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_CONFIG[determineStatus(rack.unit)].color} text-white`}>
          {rack.unit} Units
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Medical Rack Management</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
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
              onChange={(e) => setSelectedPharmacy(availablePharmacies.find(p => p._id === e.target.value))}
              isDisabled={!selectedLocation}
              isClearable
            />
          </div>
        </div>
        {selectedLocation && selectedPharmacy ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                {Object.entries(STATUS_CONFIG).map(([status, { color, label }]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {medicines?.filter(rack => rack.pharmacyId === selectedPharmacy._id)
                .map(rack => <RackCard key={rack._id} rack={rack} />)}
            </div>
          </>
        ) : (
          <div className="text-center font-semibold py-12 text-gray-600">
            Please select a location and pharmacy to manage racks
          </div>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Rack</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rack Name
                    </label>
                    <input
                      type="text"
                      value={formData.medicineName}
                      onChange={(e) => setFormData(prev => ({ ...prev, medicineName: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className={`w-full px-3 py-2 border rounded-lg ${STATUS_CONFIG[formData.status].color} text-white`}>
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRackApp;