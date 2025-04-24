import Toast from '../../../constants/Toast';
import checkValidation from '../../../validation';

const EventValidation = (
  logo = null,
  eventName = '',
  phone = '',
  desc = '',
  date = null,
  time = null,
  eventPhoto = null,
  fee = '',
  location = '',
  lat = null,
  lng = null,
) => {
  var eventNameErr = checkValidation('fullname', eventName);
  var phoneErr = checkValidation('mobileno', phone);

  if (logo == null) {
    Toast.error('Event', 'Please upload your organization image');
  } else if (eventName?.length == 0) {
    Toast.error('Event', 'Please enter event name');
  } else if (eventNameErr?.length > 0) {
    Toast.error('Event', eventNameErr);
  } else if (phoneErr?.length > 0) {
    Toast.error('Event', phoneErr);
    return false;
  } else if (location?.length == 0) {
    Toast.error('Event', 'Please enter your event location');
    return false;
  } else if (lat == null || lng == null) {
    Toast.error('Event', 'Please enter your event location');
    return false;
  } else if (desc?.length == 0) {
    Toast.error('Event', 'Please provide description');
    return false;
  } else if (date == null) {
    Toast.error('Event', 'Please enter event date');
    return false;
  } else if (time == null) {
    Toast.error('Event', 'Please enter event time');
    return false;
  } else if (eventPhoto == null) {
    Toast.error('Event', 'Please upload event image');
    return false;
  } else if (fee?.length == 0) {
    Toast.error('Event', 'Please enter fee amount');
    return false;
  } else if (isNaN(Number(fee))) {
    Toast.error('Event', 'Please enter valid fee amount');
    return false;
  } else if (Number(fee) < 1) {
    Toast.error('Event', 'Please enter valid fee amount');
    return false;
  } else return true;
};

export default EventValidation;
