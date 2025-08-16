import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BirthScreen from '../screens/AuthScreens/BirthScreen';
import InterestScreen from '../screens/AuthScreens/InterestScreen';
import SocialLoginScreen from '../screens/AuthScreens/SocialLoginScreen';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import ForgetPasswordScreen from '../screens/AuthScreens/ForgetPasswordScreen';
import OTPScreen from '../screens/AuthScreens/OTPScreen';
import CreatePasswordScreen from '../screens/AuthScreens/CreatePasswordScreen';
import SetupProfileScreen from '../screens/AuthScreens/SetupProfileScreen';
import BottomTabStack from './BottomTabStack';
import MediaReviewScreen from '../screens/AppScreens/PostMediaScreen/MediaReviewScreen';
import ProfileDetail from '../screens/AppScreens/ProfileScreen/ProfileDetail';
import ReelViewer from '../screens/AppScreens/ProfileScreen/ReelViewer';
import NotificationScreen from '../screens/AppScreens/NotificationScreen';
import NearByScreen from '../screens/AppScreens/HomeScreen/NearByScreen';
import TagPeopleScreen from '../screens/AppScreens/PostMediaScreen/TagPeopleScreen';
import TagBusinessScreen from '../screens/AppScreens/PostMediaScreen/TagBusinessScreen';
import SubBusinessCategory from '../screens/AppScreens/BusinessScreen/SubBusinessCategory';
import SelectedBusinessListingScreen from '../screens/AppScreens/BusinessScreen/SelectedBusinessListingScreen';
import BusinessDetailScreen from '../screens/AppScreens/BusinessScreen/BusinessDetailScreen';
import PopularCategoryScreen from '../screens/AppScreens/ExploreScreen/PopularCategoryScreen';
import ExploreDetailScreen from '../screens/AppScreens/ExploreScreen/ExploreDetailScreen';
import UserProfileDetail from '../screens/AppScreens/ProfileScreen/UserProfileDetail';
import MessageScreen from '../screens/AppScreens/ChatScreen/MessageScreen';
import FollowUsers from '../screens/AppScreens/ProfileScreen/FollowUsers';
import SearchScreen from '../screens/AppScreens/SearchScreen';
import EditProfileScreen from '../screens/AppScreens/ProfileScreen/EditProfile';
import FavouriteScreen from '../screens/AppScreens/ProfileScreen/FavirouteScreen';
import ChangePasswordScreen from '../screens/AppScreens/ProfileScreen/ChangePasswordScreen';
import BlockListScreen from '../screens/AppScreens/ProfileScreen/BlockListScreen';
import AboutUsScreen from '../screens/AppScreens/ProfileScreen/AboutUsScreen';
import PrivacyPolicyScreen from '../screens/AppScreens/ProfileScreen/PrivacyPolicyScreen';
import AddEventScreen from '../screens/BusinessUserScreen/EventListing/AddEventScreen';
import BusinessScreen from '../screens/AppScreens/BusinessScreen';
import AddBusinessScreen from '../screens/BusinessUserScreen/BusinessListing/AddBusinessScreen';
import EventDetailScreen from '../screens/BusinessUserScreen/EventListing/EventDetailScreen';
import SavedPostScreen from '../screens/AppScreens/ProfileScreen/SavedPostScreen';
import HelpScreen from '../screens/AppScreens/ProfileScreen/HelpScreen';
import ClaimBusinessScreen from '../screens/AppScreens/ClaimBusinessScreen';
import GetAddress from '../screens/AppScreens/PostMediaScreen/GetAddress';
import BusinessChildScreen from '../screens/AppScreens/BusinessScreen/BusinessChildScreen';
import BusinessListWithChild from '../screens/AppScreens/BusinessScreen/BusinessListWithChild';
import Setting from  '../screens/AppScreens/ProfileScreen/Setting'
import UserPlaces from '../screens/AppScreens/ProfileScreen/Places';
import PostByPlaces from '../screens/AppScreens/ProfileScreen/PostByPlaces';
import FollowBusiness from '../screens/AppScreens/ClaimBusinessScreen/followBusiness';
import PostDetailScreen from '../screens/AppScreens/HomeScreen/PostDetailScreen';
import AddStory from '../screens/AppScreens/ClaimBusinessScreen/Addstory';
import StoryPreview from '../screens/AppScreens/ClaimBusinessScreen/StoryPreview';
import TrimScreen from '../screens/AppScreens/ClaimBusinessScreen/TrimScreen';
import StoryViewers from '../screens/AppScreens/ClaimBusinessScreen/StoryViewers';
const Stack = createStackNavigator();

function AppStack({isLoggedIn = false}) {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={isLoggedIn ? 'HomeScreen' : 'SocialLoginScreen'}>
      <Stack.Screen name="SocialLoginScreen" component={SocialLoginScreen} />
      <Stack.Screen name="BirthScreen" component={BirthScreen} />
      <Stack.Screen name="InterestScreen" component={InterestScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="CreatePasswordScreen"
        component={CreatePasswordScreen}
      />
      <Stack.Screen
        name="ForgetPasswordScreen"
        component={ForgetPasswordScreen}
      />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="SetupProfileScreen" component={SetupProfileScreen} />
      {/* App Screens */}
      <Stack.Screen name="HomeScreen" component={BottomTabStack} />
      <Stack.Screen name="MediaReviewScreen" component={MediaReviewScreen} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetail} />
      <Stack.Screen name="UserProfileDetail" component={UserProfileDetail} />
      <Stack.Screen name="ReelViewer" component={ReelViewer} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="NearByScreen" component={NearByScreen} />
      <Stack.Screen name="TagPeopleScreen" component={TagPeopleScreen} />
      <Stack.Screen name="TagBusinessScreen" component={TagBusinessScreen} />
      <Stack.Screen
        name="SubBusinessCategory"
        component={SubBusinessCategory}
      />
      <Stack.Screen
        name="SelectedBusinessListingScreen"
        component={SelectedBusinessListingScreen}
      />
      <Stack.Screen
        name="BusinessDetailScreen"
        component={BusinessDetailScreen}
      />
      <Stack.Screen
        name="PopularCategoryScreen"
        component={PopularCategoryScreen}
      />
      <Stack.Screen
        name="ExploreDetailScreen"
        component={ExploreDetailScreen}
      />
      <Stack.Screen name="MessageScreen" component={MessageScreen} />
      <Stack.Screen name="FollowUsers" component={FollowUsers} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen name="BlockListScreen" component={BlockListScreen} />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen name="AddEventScreen" component={AddEventScreen} />
      <Stack.Screen name="BusinessCategoryScreen" component={BusinessScreen} />
      <Stack.Screen name="AddBusinessScreen" component={AddBusinessScreen} />
      <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />
      <Stack.Screen name="SavedPostScreen" component={SavedPostScreen} />
      <Stack.Screen name="HelpScreen" component={HelpScreen} />
      <Stack.Screen
        name="ClaimBusinessScreen"
        component={ClaimBusinessScreen}
      />
      <Stack.Screen
        name="BusinessChildScreen"
        component={BusinessChildScreen}
      />
      <Stack.Screen
        name="BusinessListWithChild"
        component={BusinessListWithChild}
      />
      <Stack.Screen name="GetAddress" component={GetAddress} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="UserPlaces" component={UserPlaces} />
      <Stack.Screen name="PostByPlaces" component={PostByPlaces} />
      <Stack.Screen name="FollowBusiness" component={FollowBusiness} />
      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
      <Stack.Screen name="AddStory" component={AddStory} />
      <Stack.Screen name="StoryPreview" component={StoryPreview} />
      <Stack.Screen name="TrimScreen" component={TrimScreen} />
      <Stack.Screen name="StoryViewers" component={StoryViewers} />
      {/*  */}
    </Stack.Navigator>
  );
}

export default AppStack;
