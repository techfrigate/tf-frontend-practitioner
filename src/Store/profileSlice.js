// Redux/Slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const initialState = {
    profileData: null,
    loading: false,
    error: null,
  }
  
// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async ({ userId, accessToken, tenantId }, {rejectWithValue}) => {
    console.log(userId, accessToken, tenantId );
    try {
      const response = await axios.get(`http://localhost:3000/profiles/user-profile/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          usertype: "provider",
          tenantId
        },
      });
      console.log("response of admin",response.data);
      Cookies.set("Token", response.data.access_token);
      Cookies.set("TenantId", tenantId);
      Cookies.set("UserId", userId);
      return response.data.profile;
    } catch (error) {
        console.log("aadmin error ", error);
      return rejectWithValue(error.response.data);
    }
  }
);

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
      });
  },
});

export default profileSlice.reducer;
