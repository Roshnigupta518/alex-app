import axios from 'axios';
import {BASE_URL} from './WebConstants';
import Storage from '../constants/Storage';

const HttpRequests = {
  getAPI: async (url, data = null, token = '') => {
     
    const temp_token = await Storage.get('userdata');
    // console.log('******',url, data, temp_token?.token );

    const headers = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + temp_token?.token,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      Object.assign(headers, {
        params: data,
      });
    }

    return axios.get(BASE_URL + url, headers);
  },

  postAPI: async (url, data, token = '', header) => {
    const temp_token = await Storage.get('userdata');
    const headers = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + temp_token?.token,
        'Content-Type': 'application/json',
        ...header,
      },
    };

    return axios.post(BASE_URL + url, data, headers);
  },

  postMediaFile: async (url, data, token = '') => {
    const temp_token = await Storage.get('userdata');

    let customHeader = new Headers();
    customHeader.append('Authorization', 'Bearer ' + temp_token?.token);
    customHeader.append('Content-Type', 'multipart/form-data');

    new Promise((resolve, reject) => {
      fetch(BASE_URL + url, {
        method: 'POST',
        body: data,
        headers: customHeader,
      })
        .then(response => response.json())
        .then(responseData => {
          resolve(responseData);
        })
        .catch(error => {
          console.log('error new: ', error);
          reject(error);
        });
    });
  },

  postUploadFileAPI: async (url, data, token = '') => {
    const temp_token = await Storage.get('userdata');

    const headers = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + temp_token?.token,
        'Content-Type': 'multipart/form-data',
      },
    };

    return axios.post(BASE_URL + url, data, headers);
  },

  putAPI: async (url, data, token = '', header) => {
    const temp_token = await Storage.get('userdata');
    const headers = {
      headers: {
        Authorization: 'Bearer ' + temp_token?.token,
        'Content-Type': 'application/json',
        ...header,
      },
    };

    return axios.put(BASE_URL + url, data, headers);
  },

  deleteAPI: async (url, data, token = '') => {
    const temp_token = await Storage.get('userdata');

    const headers = {
      headers: {
        Authorization: 'Bearer ' + temp_token?.token,
        'Content-Type': 'application/json',
      },
    };
    return axios.delete(BASE_URL + url, headers);
  },
};

export default HttpRequests;
