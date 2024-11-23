import {StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import {appColors} from '../../constants/colors';
import {
  CommentIcon,
  HeartIcon,
  UserPlaceholderIcon,
  ShareIcon,
  ImagePlaceholderIcon,
} from '../../assets/icons';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomBottomSheet from '../CustomBottomSheet';
import {useColorMode, useColorModeValue} from 'native-base';

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
  const textColor = useColorModeValue(appColors.black, appColors.white);
  return (
    <View style={styles.postHeader}>
      <View style={styles.photoAndNameWrapper}>
        <View style={styles.profilePhoto}>
          <UserPlaceholderIcon />
        </View>
        <Text style={{color: textColor}}>Username</Text>
      </View>
    </View>
  );
};
const PostContent = () => {
  const imagePlaceholderColor = useColorModeValue(
    appColors.white,
    appColors.black,
  );

  const contentBackgroundColor = useColorModeValue(
    appColors.black,
    appColors.gray,
  );

  return (
    <View
      style={[styles.postContent, {backgroundColor: contentBackgroundColor}]}>
      <ImagePlaceholderIcon
        color={`${imagePlaceholderColor}80`}
        width={200}
        height={200}
        strokeWidth={0.6}
      />
    </View>
  );
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

  const iconColor = useColorModeValue(appColors.black, appColors.white);
  const textColor = useColorModeValue(appColors.black, appColors.white);
  return (
    <>
      <View style={styles.postFooter}>
        <View style={styles.footerActionsWrapper}>
          <HeartIcon color={iconColor} />
          <Text style={{color: textColor}}>5267</Text>
        </View>

        <TouchableOpacity onPress={openBottomSheet}>
          <View style={styles.footerActionsWrapper}>
            <CommentIcon color={iconColor} />
            <Text style={{color: textColor}}>160</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footerActionsWrapper}>
          <ShareIcon color={iconColor} />
          <Text style={{color: textColor}}>2567</Text>
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
    backgroundColor: appColors.black,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: appColors.black,
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
