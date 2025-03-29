import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {appColors} from '../../constants/colors';
import {
  CommentIcon,
  HeartIcon,
  UserPlaceholderIcon,
  ShareIcon,
  SaveAddIcon,
  MultipleMediaIcon,
} from '../../assets/icons';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomBottomSheet from '../CustomBottomSheet';
import {useColorModeValue, View} from 'native-base';
import {
  useCardColor,
  useLightTextColor,
  usePostBackgroundColor,
  useTextColor,
} from '../../utils/customHooks/colorHooks';
import {Media, Post} from '../../types/player/player.type';
import {fontBold, fontRegular} from '../../styles/fonts';
import {format} from 'date-fns';
import {FallBackPostImage} from '../FallBackPostImage';
import {MediaType} from '../../constants/enums';
import VideoPlayer from '../VideoPlayer';

const UserPost = ({post}: {post: Post}) => {
  return (
    <ScrollView
      // contentContainerStyle={{
      //   flexGrow: 1,
      // }}
      style={styles.postContainer}>
      <PostHeader post={post} />
      <PostContent post={post} />
      <PostFooter post={post} />
    </ScrollView>
  );
};

const PostHeader = ({post}: {post: Post}) => {
  const textColor = useTextColor();

  const lightTextColor = useLightTextColor();

  const handleSavePost = () => {
    console.log('Save Post : POST ID -->', post.id);
  };

  return (
    <View style={styles.postHeader}>
      <View style={styles.picName}>
        <View style={styles.profilePicContainer}>
          {post.user.profilePicUrl ? (
            <Image
              source={{uri: post.user.profilePicUrl}}
              style={{
                width: 50,
                height: 50,
                objectFit: 'contain',
                borderRadius: 200,
              }}
            />
          ) : (
            <UserPlaceholderIcon width={40} height={40} color={textColor} />
          )}
        </View>
        <View style={{gap: 4}}>
          <Text style={fontBold(14, textColor)}>{post.user.fullName}</Text>
          <Text style={fontRegular(10, lightTextColor)}>
            {format(post.createdAt, 'MMM d h:mm aaa')}
          </Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.4} onPress={handleSavePost}>
        {/* <SaveTickIcon width={20} height={20} style={{marginLeft: 'auto'}} /> */}
        <SaveAddIcon width={20} height={20} color={textColor} />
      </TouchableOpacity>
    </View>
  );
};

const TextOnlyContent = ({content}: {content: string}) => {
  const textColor = useTextColor();
  const postBackgroundColor = usePostBackgroundColor();

  return (
    <View
      style={[
        styles.contentView,
        {
          backgroundColor: postBackgroundColor,
        },
      ]}>
      <Text
        style={[
          fontRegular(14, textColor),
          {
            lineHeight: 20,
          },
        ]}>
        {content}
      </Text>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const TextWithMediaContent = ({post}: {post: Post}) => {
  const textColor = useTextColor();
  const postBackgroundColor = usePostBackgroundColor();

  const renderItem = ({item}: {item: Media}) => {
    return (
      <View
        style={{
          width: screenWidth - 64,
          height: 600,
          // borderRadius: 10,
          overflow: 'hidden',
          // marginRight: 10,
          backgroundColor: 'pink',
          // justifyContent: 'center',
          // alignItems: 'center',
          aspectRatio: 1,
        }}>
        <FallBackPostImage />
        {item.mediaType === MediaType.IMAGE && (
          <Image
            source={{uri: item.mediaLink}}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 10,
            }}
          />
        )}

        {item.mediaType === MediaType.VIDEO && (
          <VideoPlayer
            backgroundColor={appColors.erieBlack}
            url={item.mediaLink}
            showLoader={false}
            id={1}
          />
        )}
      </View>
    );
  };

  console.log('Post Media : ', post.media.length);

  return (
    <View
      style={[
        styles.contentView,
        {
          backgroundColor: postBackgroundColor,
        },
      ]}>
      <Text style={[fontRegular(14, textColor)]}>{post.textContent}</Text>

      <View style={[styles.postContent, {marginTop: 16}]}>
        {post.media.length > 1 ? (
          <View style={styles.multipleMediaIconWrapper}>
            <MultipleMediaIcon width={20} height={20} />
          </View>
        ) : null}

        <FlatList
          data={post.media}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          scrollEventThrottle={16}
          keyExtractor={item => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => renderItem({item})}
        />
      </View>
    </View>
  );
};

const PostContent = ({post}: {post: Post}) => {
  const imagePlaceholderColor = useColorModeValue(
    appColors.white,
    appColors.black,
  );

  const contentBackgroundColor = useColorModeValue(
    appColors.black,
    appColors.gray,
  );

  const cardColor = useCardColor();

  const isTextPost = post.media.length === 0;

  return isTextPost ? (
    <TextOnlyContent content={post.textContent} />
  ) : (
    <TextWithMediaContent post={post} />
  );
};

const FOOTER_HORIZONTAL_PADDING = 30;
const FOOTER_VERTICAL_PADDING = 14;
const FOOTER_ACTIONS_BUTTON_GAP = 12;

const PostFooter = ({post}: {post: Post}) => {
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
  const heartColor = appColors.warmRed;

  // favorite state will be handled through dispatch and making update in api data
  const [isFavourite, setIsFavourite] = useState(false);
  return (
    <>
      <View style={styles.postFooter}>
        <View style={styles.likesWrapper}>
          <TouchableOpacity
            style={styles.heart}
            activeOpacity={0.4}
            onPress={() => {
              setIsFavourite(prev => !prev);
            }}>
            <HeartIcon
              width={20}
              height={20}
              fill={isFavourite ? heartColor : 'none'}
              color={isFavourite ? heartColor : iconColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.likeCount}
            activeOpacity={0.4}
            onPress={() => {
              console.log('Open Like bottom sheet : POST ID -->', post.id);
            }}>
            <Text style={fontRegular(14, textColor)}>{post.likeCount}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={openBottomSheet} activeOpacity={0.4}>
          <View style={styles.footerActionsWrapper}>
            <CommentIcon width={22} height={22} color={iconColor} />
            <Text style={fontRegular(14, textColor)}>{post.commentCount}</Text>
          </View>
        </TouchableOpacity>

        {/* Share Wrapper */}
        <View style={styles.sharesWrapper}>
          <TouchableOpacity
            style={styles.share}
            activeOpacity={0.4}
            onPress={() => {
              console.log('Share Post : POST ID -->', post.id);
            }}>
            <ShareIcon width={20} height={20} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareCount}
            activeOpacity={0.4}
            onPress={() => {
              console.log('Open Share bottom sheet : POST ID -->', post.id);
            }}>
            <Text style={fontRegular(14, textColor)}>{post.likeCount}</Text>
          </TouchableOpacity>
        </View>

        {/*  */}
      </View>

      <CustomBottomSheet
        bottomSheetRef={bottomSheetRef}
        customSnapPoints={['75%', '100%']}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 30, color: textColor}}>Comment Section</Text>
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
    paddingVertical: FOOTER_VERTICAL_PADDING,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postContent: {
    // width: '100%',
    // height: 350,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'red',
  },
  postFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 26,
    alignItems: 'center',
    // backgroundColor: 'red',
    // paddingVertical: 10,
  },
  profilePhoto: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoAndNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerActionsWrapper: {
    width: 100,
    flexDirection: 'row',
    gap: FOOTER_ACTIONS_BUTTON_GAP,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: FOOTER_VERTICAL_PADDING,
  },
  picName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profilePicContainer: {
    width: 50,
    height: 50,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
  likesWrapper: {flexDirection: 'row', width: 100, alignItems: 'center'},
  heart: {
    paddingVertical: FOOTER_VERTICAL_PADDING,
    paddingLeft: FOOTER_HORIZONTAL_PADDING,
    paddingRight: FOOTER_ACTIONS_BUTTON_GAP,
  },
  likeCount: {
    paddingVertical: FOOTER_VERTICAL_PADDING,
    width: 50,
    justifyContent: 'center',
  },
  sharesWrapper: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  share: {
    paddingVertical: FOOTER_VERTICAL_PADDING,
    paddingLeft: 26,
    paddingRight: FOOTER_ACTIONS_BUTTON_GAP,
  },
  shareCount: {
    paddingVertical: FOOTER_VERTICAL_PADDING,
    paddingRight: FOOTER_HORIZONTAL_PADDING,
  },
  contentView: {
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  multipleMediaIconWrapper: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: 6,
    right: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${appColors.black}80`,
    borderRadius: 10,
    zIndex: 1,
  },
});
