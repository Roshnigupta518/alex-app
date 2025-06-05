import axios from 'axios';
import HttpRequests from './HttpRequests';
import {api, BASE_URL} from './WebConstants';

export const GetCategoriesRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getCategories)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetChildBusinessRequest = async id => {
  return new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.childBusiness + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetAllChildBusiness = async id => {
  return new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getChildBusinesses + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const CreateUserProfileRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.setupProfile, data, '', {
        'Content-Type': 'multipart/form-data',
      })
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const CreateBusinessRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.createBusiness, data, '', {
        'Content-Type': 'multipart/form-data',
      })
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const UpdateBusinessRequest = async (id, data) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.putAPI(api.updateBusiness + id, data, '', {
        'Content-Type': 'multipart/form-data',
      })
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const OTPVerificationRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.verifyOtp, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const LoginUserRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.login, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const ForgetPasswordRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.forgetPassword, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};
export const ResendOTPRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.otpresend, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const SocialLoginRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.socialLogin, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetAllPostsRequest = async (data = null) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllPost, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
          if (err.response.status == 401) {
            logoutUserFromStack();
          }
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const UploadPostMediaRequest = async (data, token) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postMediaFile(api.addPost, data)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          console.log('inner error: ', JSON.stringify(err), '\nError:', {
            message: err?.response?.data?.message,
            status: err?.response?.status,
            header: err?.response?.headers,
          });

          reject(err?.response?.data);
        });
    } catch (error) {
      console.log('err2', error);
      reject(error);
    }
  });
};

export const claimBusinessRequest = async (id, data, token) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.claimBusiness + id, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const LikeDisLikeRequest = async (data, token) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.likeDislikePost, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const SavePostRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.savePost + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetMyEventListRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getMyEventList)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetUserProfileRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getUserProfile + data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetMyProfileRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getMyProfile)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetUserPostsRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getUsersPosts + data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetAllCommentRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.commentList + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetAllNotificationRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllNotification)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetTrendingCitiesRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getTrendingCities)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetNotificationCountRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.notificationCount)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetSavedPostRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getSavedPost)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const ReadNotificationRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.putAPI(api.notificationRead + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const PostCommentRequest = async (id, data) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.postComment + id, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const DeleteCommentRequest = async (id, data) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.deleteAPI(api.deleteComment + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const DeleteNotifcationRequest = async (id, data) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.deleteAPI(api.deleteNotifcation + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetBusinessByPlaceId = async (id, data) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.deleteBusiness + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const DeleteBusinessRequest = async (id, data) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.deleteAPI(api.deleteBusiness + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetBusinessDetailById = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.deleteBusiness + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const DeleteEventRequest = async (id, data) => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.deleteAPI(api.deleteEvent + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const CreatePasswordRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.createPassword, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const reportPostRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.reportPost, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const reportUserRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.reportUser, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const blockUserRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.blockUser, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const MakeFollowedUserRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.makeFollowUser, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const AddQueryRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.submitQuery, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllUsersRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllUsers)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getQuestionAnswerRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.questionAnswerHelp)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllBusinessListRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllBusinessList)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          console.log('err', err);
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllBusinessCategoryRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllBusinessCategory)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getSubBusinessCategoryRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getSubCategory + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getExploreCategoriesRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.exploreCategories, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getFavirouteExploreRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getFavouriteExplore)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getSubExploreCategoryRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.exploreSubCategory + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getBusinessListingByIdRequest = async sub_cat_id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getBusinessListingById + sub_cat_id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllFollowingRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllFollowing + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllFollowerRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllFollowers + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getBlockListRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getBlockList)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const OurMissionRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.ourMission)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const PrivacyPolicyRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.privacyPolicy)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const ourVisionRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.ourVision)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getMyBusinessListRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getMyBusiness)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateProfileRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.putAPI(api.updateProfile, data, '', {
        'Content-Type': 'multipart/form-data',
      })
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const SwitchUserRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.putAPI(api.switchUser)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getGoogleBusinessesRequest = async (lat, lng, search) => {
  return await new Promise((resolve, reject) => {
    try {
      axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat}%2C${lng}&query=${search}&key=AIzaSyAbFHI5aGGL3YVP0KvD9nDiFKsi_cX3bS0`,
      })
        .then(res => {
          resolve(res?.data);
        })
        .catch(err => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getCityDataRequest = async (lat, lng) => {
  return await new Promise((resolve, reject) => {
    try {
      axios({
        method: 'GET',
        url: `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${Number(
          lat,
        )}&lon=${Number(lng)}`,
      })
        .then(res => {
          resolve(res?.data);
        })
        .catch(err => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getGooglePlaceByPlaceIdRequest = async place_id => {
  return await new Promise((resolve, reject) => {
    try {
      axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=AIzaSyAbFHI5aGGL3YVP0KvD9nDiFKsi_cX3bS0`,
      })
        .then(res => {
          resolve(res?.data);
        })
        .catch(err => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const AddToFavExploreRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.addFavExplore, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const CreateEventRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.postAPI(api.createEvent, data, '', {
        'Content-Type': 'multipart/form-data',
      })
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const ChangePasswordRequest = async data => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.putAPI(api.changePassword, data)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const DeleteAccountRequest = async () => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.deleteAPI(api.deleteAccount)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllPlacesRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllPlaces + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllCountryRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllCountry + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllCitiesRequest = async id => {
  return await new Promise((resolve, reject) => {
    try {
      HttpRequests.getAPI(api.getAllCities + id)
        .then(res => {
          if (res?.data) resolve(res?.data);
          else reject(res?.data);
        })
        .catch(err => {
          reject(err?.response?.data);
        });
    } catch (error) {
      reject(error);
    }
  });
};
