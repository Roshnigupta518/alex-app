import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const ProfileRedirect = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Replace current screen with ProfileDetail
    navigation.replace('ProfileDetail');
  }, []);

  return null;
};

export default ProfileRedirect;
