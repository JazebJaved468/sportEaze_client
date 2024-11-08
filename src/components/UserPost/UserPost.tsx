import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {appcolors} from '../../constants/colors';
import {
  CommentIcon,
  HeartIcon,
  UserPlaceholderIcon,
  ShareIcon,
} from '../../assets/icons';

const UserPost = () => {
  return (
    <View style={styles.postContainer}>
      <PostHeader />
      <PostContent />
      <PostFooter />
    </View>
  );
};

const PostHeader = () => {
  return (
    <View style={styles.postHeader}>
      <View style={styles.photoAndNameWrapper}>
        <View style={styles.profilePhoto}>
          <UserPlaceholderIcon />
        </View>
        <Text>Username</Text>
      </View>
    </View>
  );
};
const PostContent = () => {
  return <View style={styles.postContent}></View>;
};
const PostFooter = () => {
  return (
    <View style={styles.postFooter}>
      <View style={styles.footerActionsWrapper}>
        <HeartIcon />
        <Text>5267</Text>
      </View>

      <View style={styles.footerActionsWrapper}>
        <CommentIcon />
        <Text>160</Text>
      </View>

      <View style={styles.footerActionsWrapper}>
        <ShareIcon />
        <Text>2567</Text>
      </View>
    </View>
  );
};

export default UserPost;

const styles = StyleSheet.create({
  postContainer: {
    width: '100%',
    // overflow: 'hidden',
  },
  postHeader: {
    width: '100%',
    paddingVertical: 10,
  },
  postContent: {
    width: '100%',
    height: 350,
    backgroundColor: appcolors.black,
  },
  postFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  profilePhoto: {
    width: 44,
    height: 44,
    borderRadius: 20,
    backgroundColor: appcolors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoAndNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerActionsWrapper: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
