import {StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import {appcolors} from '../../constants/colors';
import {
  CommentIcon,
  HeartIcon,
  UserPlaceholderIcon,
  ShareIcon,
} from '../../assets/icons';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomBottomSheet from '../CustomBottomSheet';

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
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.present();
    }
  };
  const closeBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };
  return (
    <>
      <View style={styles.postFooter}>
        <View style={styles.footerActionsWrapper}>
          <HeartIcon />
          <Text>5267</Text>
        </View>

        <TouchableOpacity onPress={openBottomSheet}>
          <View style={styles.footerActionsWrapper}>
            <CommentIcon />
            <Text>160</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footerActionsWrapper}>
          <ShareIcon />
          <Text>2567</Text>
        </View>
      </View>

      <CustomBottomSheet bottomSheetRef={bottomSheetRef}>
        <View style={{height: 400, backgroundColor: 'red'}}>
          <Text>Sample Text</Text>
        </View>
      </CustomBottomSheet>
    </>
  );
};

export default UserPost;

const styles = StyleSheet.create({
  postContainer: {
    width: '100%',
    marginBottom: 20,
  },
  postHeader: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
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
    borderRadius: 100,
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
