import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {
    locationType: 'current',
  },
};

export const SelectedCitySlice = createSlice({
  name: 'SelectedCity',
  initialState,
  reducers: {
    setCityAction: (state, action) => {
        console.log('update city', action.payload);
        state.data.locationType = action?.payload?.locationType;
      },
  },
});

export const {setCityAction} = SelectedCitySlice.actions;

export default SelectedCitySlice.reducer;
