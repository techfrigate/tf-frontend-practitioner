// Redux/Slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const initialState = {
  profileData: null,
  locationProfiles: null,
  loading: false,
  error: null,
  }
  const ACCOUNTS_URL  = process.env.REACT_APP_ACCOUNTS_URL
const ADMIN_URL =  process.env.REACT_APP_ADMIN_URL


// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async ({ userId, accessToken, tenantId }, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${ACCOUNTS_URL}/profiles/user-profile/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            usertype: "practitioner",
          tenantId
          },
      });
      Cookies.set("Token", response.data.access_token);
      Cookies.set("TenantId", tenantId);
      Cookies.set("UserId", userId);

      localStorage.setItem(
        "admin_profile",
        JSON.stringify(response.data.profile)
      );
      return response.data.profile;
    } catch (error) {
      console.log("practitioner error", error);
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchLocationProfiles = createAsyncThunk(
  'profile/fetchLocationProfiles',
  async ({ tenantId, locationId, userType, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        tenantid: tenantId,
        locationid: locationId,
      };

      if (userType) {
        headers.usertype = userType;
      }

      const response = await axios.get(`${ACCOUNTS_URL}/profiles/location-profile`, { headers });

      Cookies.set('TenantId', tenantId);
      Cookies.set('LocationId', locationId);
      if (userType) {
        Cookies.set('UserType', userType);
      }

      localStorage.setItem('location_profiles', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error fetching location profiles:', error);
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const updateLastApp =
  ({ userId, body }) =>
  async () => {
    try {
      const response = await axios.patch(
        `${ACCOUNTS_URL}/lastapp/${userId}`,
        body
      );
      return response;
    } catch (error) {
      return error.response;
    }
  };

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileData = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLocationProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationProfiles.fulfilled, (state, action) => {
        state.locationProfiles = action.payload;
        state.loading = false;
      })
      .addCase(fetchLocationProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
