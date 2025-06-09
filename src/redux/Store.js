import {configureStore} from '@reduxjs/toolkit';
import UserInfoSlice from './Slices/UserInfoSlice';
import VideoMuteSlice from './Slices/VideoMuteSlice';
import NearBySlice from './Slices/NearBySlice';
import SelectedCitySlice from './Slices/SelectedCitySlice';
import TagPeopleSlice from './Slices/TagPeopleSlice';
import TagBusinessSlice from './Slices/TagBusinessSlice';
import ChatListSlice from './Slices/ChatListSlice';
import OnlineUserSlice from './Slices/OnlineUserSlice';
import NotificationCountSlice from './Slices/NotificationCount';
import ReelIndexSlice from './Slices/ReelIndexSlice';
import AddAddressSlice from './Slices/AddAddressSlice';
import ChatReadSlice from './Slices/ChatReadSlice';

const Store = configureStore({
  reducer: {
    UserInfoSlice,
    VideoMuteSlice,
    NearBySlice,
    SelectedCitySlice,
    TagPeopleSlice,
    TagBusinessSlice,
    ChatListSlice,
    OnlineUserSlice,
    NotificationCountSlice,
    ReelIndexSlice,
    AddAddressSlice,
    ChatReadSlice
  },
});

export default Store;
