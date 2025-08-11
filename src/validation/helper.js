import { Linking } from "react-native";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';

export const formatCount = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return num?.toString();
    }
  };

  export  const openSocialLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      console.log('canOpenURL:', supported);
      await Linking.openURL(url);
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };


  export const tabList = [
    { key: 'photo', title: 'Photos' },
    { key: 'video', title: 'Videos' },
  ];
  
export const handleShareFunction = async (data, place_id) => {
  try {
    const dynamicLink = await dynamicLinks().buildShortLink({
      link: `https://www.thealexapp.com/business/${place_id}`, 
      domainUriPrefix: 'https://alexsocial.page.link',
      android: {
        packageName: 'com.alexsocial',
      },
      ios: {
        bundleId: 'com.alexsocial',
        appStoreId: '6470377502',
      },
      social: {
        title: data?.name || 'Check out this business',
        descriptionText: data?.details || 'Explore this amazing place!',
        imageUrl:
          data?.banner ||
          data?.certificate ||
          'https://alexsocial.com/default_image.jpg',
      },
    });

    console.log('Generated dynamic link:', dynamicLink);

    Share.open({
      message: `Explore ${data?.name || 'this business'} on our app!`,
      url: dynamicLink,
    })
      .then(res => {
        console.log('Share success:', res);
      })
      .catch(err => {
        console.log('Share error:', JSON.stringify(err));
        // alert('This may not work on emulator.');
      });
  } catch (err) {
    console.log('Dynamic link error:', err);
    alert('Failed to create dynamic link');
  }
};

export const handleSharePostFunction = async (data) => {
  console.log({data})
  try {
    const dynamicLink = await dynamicLinks().buildShortLink({
      link: `https://www.thealexapp.com/post/${data.postData._id}`,  // <-- unique post link
      domainUriPrefix: 'https://alexsocial.page.link',
      android: {
        packageName: 'com.alexsocial',
      },
      ios: {
        bundleId: 'com.alexsocial',
        appStoreId: '6470377502',
      },
      social: {
        title: data?.postData?.caption || 'Check out this post',
        descriptionText: data?.postData?.location || `${data?.postData?.city || ''}${data?.postData?.country ? ', ' + data?.postData?.country : ''}` || "Shared from Alex App",
        imageUrl: data?.postData?.post?.data || data?.postData?.post_thumbnail || "https://alexsocial.com/default_post_image.jpg"
      },
    });

    console.log('Generated post dynamic link:', dynamicLink);

    Share.open({
      message: `Check out this post on Alex App!`,
      url: dynamicLink,
    })
    .then(res => {
      console.log('Post share success:', res);
    })
    .catch(err => {
      console.log('Post share error:', JSON.stringify(err));
    });

  } catch (err) {
    console.log('Post dynamic link error:', err);
    // alert('Failed to create post link');
  }
};

export const handleShareStoryFunction = async (data) => {
  console.log({data})
  try {
    const dynamicLink = await dynamicLinks().buildShortLink({
      link: `https://www.thealexapp.com/story/${data}`,  // <-- unique story link
      domainUriPrefix: 'https://alexsocial.page.link',
      android: {
        packageName: 'com.alexsocial',
      },
      ios: {
        bundleId: 'com.alexsocial',
        appStoreId: '6470377502',
      },
      social: {
        title: data?.postData?.caption || 'Check out this story',
        descriptionText: data?.postData?.location || `${data?.postData?.city || ''}${data?.postData?.country ? ', ' + data?.postData?.country : ''}` || "Shared from Alex App",
        imageUrl: data?.postData?.post?.data || data?.postData?.post_thumbnail || "https://alexsocial.com/default_post_image.jpg"
      },
    });

    console.log('Generated post dynamic link:', dynamicLink);

    Share.open({
      message: `Check out this post on Alex App!`,
      url: dynamicLink,
    })
    .then(res => {
      console.log('Post share success:', res);
    })
    .catch(err => {
      console.log('Post share error:', JSON.stringify(err));
    });

  } catch (err) {
    console.log('Post dynamic link error:', err);
    // alert('Failed to create post link');
  }
};


  