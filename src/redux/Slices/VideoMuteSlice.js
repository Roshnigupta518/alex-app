import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isMute: true,
};

export const VideoMuteSlice = createSlice({
  name: 'VideoMute',
  initialState,
  reducers: {
    ChangeMuteAction: (state, action) => {
      state.isMute = action?.payload;
    },
  },
});

export const {ChangeMuteAction} = VideoMuteSlice.actions;

export default VideoMuteSlice.reducer;
