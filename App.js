// import React, { useRef } from 'react';
// import { View, StatusBar, Platform } from 'react-native';
// import InstagramStories from '@birdwingo/react-native-instagram-stories';

// const App = () => {
//   const storyref = useRef(null);

//   return (
//     <View style={{ flex: 1, backgroundColor: 'black' }}>
//       <StatusBar
//         translucent
//         backgroundColor="transparent"
//         barStyle="light-content"
//       />

//       <InstagramStories
//         ref={storyref}
//         stories={stories}
//         onStoryPress={(story) => storyref.current?.open(story.id)}
//         animationDuration={5000}
//         videoAnimationMaxDuration={30000}
//         saveProgress={false}
//         avatarSize={60}
//         storyContainerStyle={{
//           marginTop: 0,
//           paddingTop: 0,
//            backgroundColor: 'red'
//         }}
//         progressBarStyle={{
//           marginTop: 0,
//           paddingTop: 0,
//           backgroundColor: 'blue'
//         }}
//         containerStyle={{
//           marginTop: 0,
//           backgroundColor: 'green',
//           paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//         }}
//       />
//     </View>
//   );
// };

// export default App;

// const stories = [
//   {
//     id: 'user1',
//     name: 'Rakhi',
//     avatarSource: {
//       uri: 'https://randomuser.me/api/portraits/women/1.jpg',
//     },
//     stories: [
//       {
//         id: 'story1',
//         source: { uri: 'https://randomuser.me/api/portraits/women/1.jpg' },
//         mediaType: 'image',
//         duration: 5,
//       },
//       {
//         id: 'story2',
//         source: { uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
//         mediaType: 'video',
//         duration: 30,
//       },
//     ],
//   },
// ];


import React, { useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import {StoryView} from 'react-native-preview-story';

const StoryContainer = () => {
  const [visible, setVisible] = useState(false);
  const [selectedUserStories, setSelectedUserStories] = useState([]);

  const onUserPress = (user) => {
    setSelectedUserStories(user.stories);
    setVisible(true);
  };

  return (
    <View>
      {/* Avatars Row */}
      <FlatList
        horizontal
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onUserPress(item)} style={{ margin: 10 }}>
            <Image
              source={{ uri: item.avatar }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
          </TouchableOpacity>
        )}
      />

      {/* Story Modal */}
      <StoryView
        visible={visible}
        stories={selectedUserStories}
        onClose={() => setVisible(false)}
        startIndex={0}
        renderHeaderComponent={() => (
            <CustomHeader title="My Custom Header" />
          )}
          onComplete={() => {
            setVisible(false);
            console.log('close');
          }}
          noControls
      />
    </View>
  );
};
 export default StoryContainer

 const users = [
    {
      id: 'user1',
      name: 'Rakhi',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      stories: [
        {
          id: 'u1s1',
          type: 'image',
          source: 'https://placekitten.com/800/1200',
          duration: 5000,
        },
        {
          id: 'u1s2',
          type: 'video',
          source: 'https://www.w3schools.com/html/mov_bbb.mp4',
          duration: 30000,
        },
        {
          id: 'u1s3',
          type: 'image',
          source: 'https://placekitten.com/800/800',
          duration: 5000,
        },
      ],
    },
    {
      id: 'user2',
      name: 'Arya',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      stories: [
        {
          id: 'u2s1',
          type: 'image',
          source: 'https://placekitten.com/700/700',
          duration: 5000,
        },
      ],
    },
  ];
  