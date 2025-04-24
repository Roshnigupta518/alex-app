import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {
    isBusiness: false,
    address: null,
    lat: null,
    lng: null,
    placeId: null,
  },
};

export const AddAddressSlice = createSlice({
  name: 'AddAddress',
  initialState,
  reducers: {
    AddAddressAction: (state, action) => {
      state.data = action?.payload;
    },
  },
});

export const {AddAddressAction} = AddAddressSlice.actions;

export default AddAddressSlice.reducer;
