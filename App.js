import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import StoryView from 'react-native-story-view'; // ✅ default import

const userStories = [
  {
    user_id: '1',
    username: 'John Doe',
    profile: 'https://placekitten.com/100/100',
    stories: [
      {
        story_id: 'story1',
        url: 'https://placekitten.com/400/800',
        type: 'image',
        title: 'Cute Cat',
        link: 'https://example.com'
      }
    ]
  }
];

export default function HomeScreen() {
  return (
    <StoryView
      data={userStories}
      renderHeader={(item) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <Image
            source={{ uri: item.profile }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <View>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.username}</Text>
            <Text style={{ color: '#ccc', fontSize: 12 }}>{item.stories[0].title}</Text>
          </View>
        </View>
      )}
      renderFooter={(story) => (
        <View style={{ padding: 10 }}>
          <TouchableOpacity onPress={() => console.log('Footer link clicked:', story.link)}>
            <Text style={{ color: '#fff' }}>Open Link</Text>
          </TouchableOpacity>
        </View>
      )}
      onStoryStart={(userId, storyId) => console.log('Story started:', userId, storyId)}
      onStoryEnd={(userId, storyId) => console.log('Story ended:', userId, storyId)}
      onAllStoriesEnd={() => console.log('All stories ended')}
    />
  );
}
