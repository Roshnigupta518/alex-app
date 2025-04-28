import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {
    city: 'Tampa',
  },
};

export const SelectedCitySlice = createSlice({
  name: 'SelectedCity',
  initialState,
  reducers: {
    setCityAction: (state, action) => {
        console.log('update city', action.payload);
        state.data.city = action?.payload?.city;
      },
  },
});

export const {setCityAction} = SelectedCitySlice.actions;

export default SelectedCitySlice.reducer;
