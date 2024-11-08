// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {};

// const formDataSlice = createSlice({
//   name: "formData",
//   initialState,
//   reducers: {
//     setFormData: (state, action) => {
//       const { category, data } = action.payload;
//       state[category] = data;
//     },
//   },
// });

// export const { setFormData } = formDataSlice.actions;
// export default formDataSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const formDataSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    addFormData: (state, action) => {
      const { category, data } = action.payload;
      // Initialize the category as an empty array if it doesn't exist
      if (!state[category]) {
        state[category] = [];
      }

      // Add the new data to the category array
      state[category].push(data);
    
    },
  },
});

export const { addFormData } = formDataSlice.actions;
export default formDataSlice.reducer;
