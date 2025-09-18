// src/features/ward/wardSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setStatusFail } from '../Store/statusFailSlice';
import Cookies from 'js-cookie';

const API_BASE_URL = `${process.env.REACT_APP_ADMIN_URL}`

export const fetchBuildings = createAsyncThunk(
  'ward/fetchBuildings',
  async (locationid,{ rejectWithValue,dispatch }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/buildings`,{
          headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
            "Content-Type": "application/json",
            locationid
          }
        });
        return response.data.data || [];
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
             const route = "/status-failed"
             await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
           }
           return rejectWithValue(error.response.data?.error?.message || error.response?.data?.message || "Something went wrong");
    }
   
  }
);

export const fetchFloors = createAsyncThunk(
  'ward/fetchFloors',
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/buildings/${buildingId}/floors`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Token')}`,
        },
      });
      return { buildingId, data: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Something went wrong');
    }
  }
);

export const fetchWards = createAsyncThunk(
  'ward/fetchWards',
  async (floorId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/buildings/floors/${floorId}/wards`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('Token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return { floorId, data: response.data.data };
    } catch (error) {
      if (error.response?.data?.errorCode === 'STATUS_CHECK_TENANT_DENIED') {
        const route = '/status-failed';
        await dispatch(
          setStatusFail({ tenants: error.response.data.tenants, navigate: route })
        );
      }
      return rejectWithValue(
        error.response?.data?.error?.message || 'Something went wrong'
      );
    }
  }
);

export const fetchBeds = createAsyncThunk(
  "ward/fetchBeds",
  async ({ wardId, currentPage, itemsPerPage, sortBy, order }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/buildings/wards/${wardId}/beds`,
        {
          params: {
            page:currentPage,
            limit:itemsPerPage,
            sortBy,
            order,
          },
          headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
          },
        }
      );
      console.log("👉 Beds API response:", response.data);
      const { data, totalCount, totalPages, page, limit, sortBy: resSortBy, order: resOrder } = response.data.data;
      return {
        wardId,
        data,
        totalCount,
        totalPages,
        page,
        limit,
        sortBy: resSortBy,
        order: resOrder,
      };
    } catch (error) {
      if (error.response?.data?.errorCode === "STATUS_CHECK_TENANT_DENIED") {
        const route = "/status-failed";
        await dispatch(
          setStatusFail({ tenants: error.response.data.tenants, navigate: route })
        );
      }
      return rejectWithValue(
        error.response?.data?.error?.message || "Something went wrong while fetching beds."
      );
    }
  }
);

export const updateBed = createAsyncThunk(
  "ward/updateBed",
  async ({ bedId, updates }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/buildings/beds/${bedId}`,
        updates, 
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data; 
    } catch (error) {
      if (error.response?.data?.errorCode === "STATUS_CHECK_TENANT_DENIED") {
        const route = "/status-failed";
        await dispatch(
          setStatusFail({
            tenants: error.response.data.tenants,
            navigate: route,
          })
        );
      }
      return rejectWithValue(
        error.response?.data?.error?.message || "Something went wrong while updating bed."
      );
    }
  }
);

export const bookBed = createAsyncThunk(
  'ward/bookBed',
  async ({bedId, userData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
         `${API_BASE_URL}/booked-beds`,
        { bedId, ...userData },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data; 
    } catch (error) {
      if(error.response?.data?.errorCode === "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed";
        await dispatch(setStatusFail({ tenants: error.response.data.tenants, navigate: route }));
      }
      return rejectWithValue(error.response?.data?.error?.message || error.response?.data?.message || "Something went wrong");
    }
  }
);

export const updateBedStatus = createAsyncThunk(
  'ward/updateBedStatus',
  async ({ bedId, status },{ rejectWithValue,dispatch }) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/booked-beds/${bedId}`,
            { bedStatus: status },
            { headers: {
              Authorization: `Bearer ${Cookies.get("Token")}`,
              "Content-Type": "application/json"
            }}
          );
          return response.data.data;
    } catch (error) {
      if(error.response?.data?.errorCode == "STATUS_CHECK_TENANT_DENIED"){
        const route = "/status-failed"
        await dispatch(setStatusFail({tenants:error.response.data.tenants,navigate:route}))
      }
      return rejectWithValue(error.response.data?.error?.message || "Something went wrong");
    }
   
  }
);

export const fetchAllBookedBeds = createAsyncThunk(
  'bed/fetchAllBookedBeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/booked-beds/fetchAll`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Something went wrong while fetching booked beds.'
      );
    }
  }
);

const wardSlice = createSlice({
  name: 'ward',
  initialState: {
    buildings: [],
    selectedBuilding: null,
    selectedFloor: null,
    selectedWard: null,
    selectedBed: null,
    bookedBed: [],
    beds: {
      data: [],
      totalCount: 50,
      totalPages: 5,   
      currentPage: 1,  
      limit: 10,
      sortBy: "createdAt",
      order: "desc",
    },
    loading: false,
    error: null
  },
  reducers: {
    setSelectedBuilding: (state, action) => {
      state.selectedBuilding = action.payload;
      const building = action.payload ? state.buildings.find(b => b._id === action.payload):null;
      const floors = building?.floors || [];
      state.selectedFloor = floors.length > 0 ? floors[0].level : null;
      state.selectedWard =  null;
      state.selectedBed = null;
    },
    setSelectedFloor: (state, action) => {
      state.selectedFloor = action.payload;
      const building = state.buildings.find(b => b._id === state.selectedBuilding);
      const floor = action.payload && building
        ? (building.floors || []).find(f => f.level === action.payload)
        : null;
        const wards = floor?.wards || [];
      state.selectedWard = wards.length > 0 ? wards[0]._id : null;
      state.selectedBed = null;
    },
    setSelectedWard: (state, action) => {
      state.selectedWard = action.payload;
      state.selectedBed = null;
    },
    setSelectedBed: (state, action) => {
      state.selectedBed = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading = false;
         state.buildings = (action.payload || []).map(b => ({
          ...b,
          floors: (b.floors || []).map(f => ({
            ...f,
            wards: f.wards || [],
            beds: f.beds || []
          }))
        }));
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch buildings';
      })
      .addCase(fetchFloors.fulfilled, (state, action) => {
        const { buildingId, data } = action.payload;
        const building = state.buildings.find((b) => b._id === buildingId);
        if (building) {
          building.floors = (data || []).map(f => ({
            ...f,
            wards: f.wards || [],
            beds: f.beds || []
          }));
        }
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        const floor = state.buildings
        .flatMap((b) => b.floors || [])
        .find((f) => f._id === action.payload.floorId);

         if (floor) {
          floor.wards = (action.payload.data || []).map(w => ({
            ...w,
            _id: w._id || w.id, 
            beds: w.beds || []
          }));
        }
        state.loading = false;
      })
      .addCase(fetchBeds.fulfilled, (state, action) => {
        const { wardId, data, totalCount, totalPages, page, limit, sortBy, order } = action.payload;
        state.buildings.forEach((b) =>
          (b.floors || []).forEach(f =>
            (f.wards || []).forEach(w => {
              if (w._id === wardId) w.beds = data || [];
            })
          )
        );
        state.beds = {
          data: data || [],
          totalCount: totalCount || 0,
          totalPages: totalPages || 0,
          currentPage: page || 1,
          limit: limit || 10,
          sortBy: sortBy || "number",
          order: order || "asc",
        };
        state.loading = false;
      })
      .addCase(updateBed.fulfilled, (state, action) => {
        const updatedBed = action.payload;
        state.buildings.forEach((b) =>
          (b.floors || []).forEach(f =>
            (f.wards || []).forEach(w => {
              const index = (w.beds || []).findIndex(bd => bd._id === updatedBed._id);
              if (index !== -1) w.beds[index] = updatedBed;
            })
          )
        );
      })
      .addCase(updateBed.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(bookBed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookBed.fulfilled, (state, action) => {
        state.loading = false;
        const bookedBed = action.payload;
        state.buildings?.forEach((b) => {
          (b.floors || []).forEach((f) => {
            (f.wards || []).forEach((w) => {
              if (!w?.beds) return;
              const index = w.beds.findIndex((bd) => bd._id === bookedBed.bedId);
              if (index !== -1) w.beds[index].status = "booked";
            });
          });
        });
        state.selectedBed = null;
      })
      .addCase(bookBed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to book bed';
      })
      .addCase(updateBedStatus.fulfilled, (state, action) => {
        const updatedBed = action.payload;
        if (!updatedBed?._id) return;
        state.buildings.forEach((b) =>{
          if (!b?.floors) return;
          (b.floors || []).forEach(f =>{
            if (!f?.wards) return;
            (f.wards || []).forEach(w => {
              if (!w?.beds) return;
              const index = (w.beds || []).findIndex(bd => bd._id === updatedBed._id);
              if (index !== -1) w.beds[index] = updatedBed;
            })
        })
      });
        state.selectedBed = null;
      })
      .addCase(updateBedStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAllBookedBeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookedBeds.fulfilled, (state, action) => {
        state.loading = false;
        state.bookedBed = action.payload;
      })
      .addCase(fetchAllBookedBeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
  });

export const { 
  setSelectedBuilding,
  setSelectedFloor,
  setSelectedWard,
  setSelectedBed,
  clearError
} = wardSlice.actions;

export default wardSlice.reducer;