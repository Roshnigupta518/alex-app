import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/AppScreens/HomeScreen';
import ChatScreen from '../screens/AppScreens/ChatScreen';
import PostMediaScreen from '../screens/AppScreens/PostMediaScreen';
import ExploreScreen from '../screens/AppScreens/ExploreScreen';
import BusinessScreen from '../screens/AppScreens/BusinessScreen';
import ProfileRedirect from '../screens/AppScreens/ProfileScreen/ProfileRedirect';
import CustomBottomTab from './CustomBottomTab';
import BusinessUserListingScreen from '../screens/BusinessUserScreen/BusinessListing';
import EventUserListingScreen from '../screens/BusinessUserScreen/EventListing';

const Tab = createBottomTabNavigator();

function BottomTabStack() {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      screenOptions={{headerShown: false}}
      tabBar={props => <CustomBottomTab {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ChatScreen" component={ChatScreen} />
      <Tab.Screen name="PostMediaScreen" component={PostMediaScreen} />
      <Tab.Screen name="ExploreScreen" component={ExploreScreen} />
      <Tab.Screen name="BusinessScreen" component={BusinessScreen} />
      <Tab.Screen
        name="BusinessUserListingScreen"
        component={BusinessUserListingScreen}
      />
      <Tab.Screen
        name="EventUserListingScreen"
        component={EventUserListingScreen}
      />

      <Tab.Screen name="ProfileScreen" component={ProfileRedirect}/>
    
    </Tab.Navigator>
  );
}
export default BottomTabStack;
