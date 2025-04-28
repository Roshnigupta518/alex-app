import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {
    location_title: 'Global',
    location_type: 'global',
    location_coordinates: null,
    location_distance: null,
    city: null,
  },
};

export const NearBySlice = createSlice({
  name: 'NearBy',
  initialState,
  reducers: {
    nearByAction: (state, action) => {
      state.data = action?.payload;
    },
  },
});

export const {nearByAction} = NearBySlice.actions;

export default NearBySlice.reducer;
