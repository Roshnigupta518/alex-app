import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {
    location_title: 'Near me',
    location_type: 'nearme',
    location_coordinates: null,
    location_distance: 25,
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
