export const RegexType = {
  email: {
    regex:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    emptyError: 'Please enter your email address',
    typeError: 'Please enter valid email address',
  },

  loginPassword: {
    regex: /^.{1,100}$/,
    emptyError: 'Please enter password',
    typeError: 'Please enter valid password displays.',
  },

  registerPassword: {
    regex: /^[A-Za-z0-9@$!%*?&]{6,18}$/,
    emptyError: 'Please enter password',
    typeError:
      'Password should be Between 8-16 characters long. And it should contain Atleast One Number, One Special Character, One Uppercase and One Lowercase.',
  },

  firstname: {
    regex: /^[A-Za-z\s]{3,100}$/,
    emptyError: 'Please enter your first name',
    typeError: 'Please enter valid name',
  },

  middlename: {
    regex: /^[A-Za-z\s]{3,100}$/,
    emptyError: 'Please enter your middle name',
    typeError: 'Please enter valid name',
  },

  lastname: {
    regex: /^[A-Za-z\s]{3,100}$/,
    emptyError: 'Please enter your last name',
    typeError: 'Please enter valid name',
  },

  fullname: {
    // regex: /^[A-Za-z\s]{3,150}$/,
    // emptyError: 'Please enter your name',
    // typeError: 'Please enter valid name',

    regex: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
    emptyError: 'Please enter your name',
    typeError: 'Name must only contain letters and a single space between words',
  },

  anonymous_name: {
    // regex: /^[A-Za-z\s]{3,150}$/,
    // emptyError: 'Please enter screen name',
    // typeError: 'Please enter valid screen name',
      regex: /^[A-Za-z]+(?: [A-Za-z]+)*$/, // One space between words, no leading/trailing/multiple spaces
      emptyError: 'Please enter screen name',
      typeError: 'Screen name must be 3-50 characters and only one space between words',
  },

  clinicalName: {
    regex: /^[A-Za-z\s]{3,200}$/,
    emptyError: 'Please enter Clinic name',
    typeError: 'Please enter valid name',
  },

  experience: {
    regex: /^[A-Za-z0-9\s.]{1,80}$/,
    emptyError: 'Please enter experience',
    typeError: 'Please enter valid experience',
  },

  mobileno: {
    // regex: /^[0-9]\d{5,15}$/,  
    regex: /^[0-9]{5,15}$/,
    emptyError: 'Please enter mobile number',
    typeError: 'Please enter mobile number should be between 5 to 15 digits',
  },

  accountNumber: {
    regex: /^\d{5,20}$/,
    emptyError: 'Please enter Account number',
    typeError: 'Please enter valid Account number',
  },

  ifscCode: {
    regex: /^[A-Z]{2,5}\d{2,6}$/,
    emptyError: 'Please enter IFSC code',
    typeError: 'Please enter valid IFSC code',
  },

  address: {
    regex: /^[A-Za-z0-9\s\.,#'-]+$/,
    emptyError: 'Please enter address',
    typeError: 'Please enter valid address',
  },

  amount: {
    regex: /^(0*(?:[1-9]\d{0,4}|100000)(\.\d+)?)$/,
    emptyError: 'Please enter amount',
    typeError: 'Please enter valid amount',
  },

  feedbackTxt: {
    regex: /^.{5,400}$/,
    emptyError: 'Please enter feedback',
    typeError:
      'Please enter valid feedback message and text length should be in between of 5 to 400.',
  },

  ibanNumber: {
    regex: /^[A-Za-z0-9\s\.,#'-]+$/,
    emptyError: 'Please enter IBAN number',
    typeError: 'Please enter valid IBAN number',
  },

  feedbackTxt: {
    regex: /^.{5,400}$/,
    emptyError: 'Please enter feedback',
    typeError:
      'Please enter valid feedback message and text length should be in between of 5 to 400.',
  },

  instagram:{
    regex: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._%-]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid instagram Url',
  },
  twitter:{
    regex: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid twitter Url',
  },
  youtube:{
    regex: /^https?:\/\/(www\.)?youtube\.com\/@[\w.-]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid youtube Url',
  },
  facebook:{
    regex: /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid facebook Url',
  },
  tiktok:{
    regex: /^https?:\/\/(www\.)?tiktok\.com\/@[\w._]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid tiktok Url',
  }
};
