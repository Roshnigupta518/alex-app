import database from '@react-native-firebase/database';

// To create chat id and return id...
const GetChatId = async (self_user, reciever_user) => {
  let modified_self_user = {...self_user};
  Object.assign(modified_self_user, {_id: self_user?.id});

  return await new Promise((resolve, reject) => {
    let chatObj = {
      [`${modified_self_user?._id}_${reciever_user?._id}`]: {
        isRead: true,
        timestamp: null,
        last_msg: '',
        sender: modified_self_user,
        reciever: reciever_user,
        [modified_self_user?._id]: true,
        [reciever_user?._id]: true,
      },
    };

    let chatPromise = database().ref('/recent_chat').push(chatObj);

    chatPromise
      .then(snapshot => {
        const childId = snapshot.key;
        resolve({[childId]: chatObj});
      })
      .catch(error => {
        console.error('Error pushing data:', error);
        reject(error);
      });
  });
};

// To verify chat already exists or not, if not then will create and send.
const verifyUserChatList = async (self_user, reciever_user, chat_list) => {
  return await new Promise((resolve, reject) => {
    if (JSON.parse(chat_list) != null && JSON.parse(chat_list) != undefined) {
      let chats = JSON.parse(chat_list);
      let chat_rooms_array = Object.keys(chats);

      let normal_chat_key = `${self_user?.id}_${reciever_user?._id}`;
      let swapped_chat_key = `${reciever_user?._id}_${self_user?.id}`;
      let isChatExists = chat_rooms_array.findIndex(
        item =>
          Object.keys(chats[item])?.includes(swapped_chat_key) ||
          Object.keys(chats[item])?.includes(normal_chat_key),
      );

      if (isChatExists > -1) {
        resolve({
          [chat_rooms_array[isChatExists]]:
            chats[chat_rooms_array[isChatExists]],
        });
      } else {
        GetChatId(self_user, reciever_user)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      }
    } else {
      GetChatId(self_user, reciever_user)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};

export default verifyUserChatList;
