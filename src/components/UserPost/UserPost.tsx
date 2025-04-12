import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {appColors} from '../../constants/colors';
import {
  CommentIcon,
  HeartIcon,
  UserPlaceholderIcon,
  ShareIcon,
  SaveAddIcon,
  MultipleMediaIcon,
  MessageSendIcon,
} from '../../assets/icons';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import CustomBottomSheet from '../CustomBottomSheet';
import {Button, useColorModeValue, View} from 'native-base';
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
import {CustomTextInputField} from '../CustomInputField';
import {Controller, useForm} from 'react-hook-form';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {
  useCreateCommentMutation,
  useCreateLikeOrUnLikeMutation,
  useLazyGetCommentsByPostIdServiceQuery,
  useLazyGetLikesByPostIdServiceQuery,
} from '../../store/player/player.service';
import {Loader} from '../Loader';
import {navigateToProfilePage} from '../../utils/helpers/navigation';

const UserPost = ({post}: {post: Post}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  return (
    <View
      // contentContainerStyle={{
      //   flexGrow: 1,
      // }}
      style={styles.postContainer}>
      <PostHeader post={post} />
      <PostContent
        post={post}
        setIsLiked={setIsLiked}
        setLikeCount={setLikeCount}
        isLiked={isLiked}
      />
      <PostFooter
        post={post}
        setIsLiked={setIsLiked}
        setLikeCount={setLikeCount}
        isLiked={isLiked}
        likeCount={likeCount}
      />
    </View>
  );
};

const PostHeader = ({post}: {post: Post}) => {
  const navigation = useAppNavigation();

  const textColor = useTextColor();
  const lightTextColor = useLightTextColor();

  const handleSavePost = () => {
    console.log('Save Post : POST ID -->', post.id);
  };

  return (
    <View style={styles.postHeader}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigateToProfilePage({
            userId: post.user.id,
            userType: post.user.userType,
          });
        }}>
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
      </TouchableOpacity>

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

const TextWithMediaContent = ({
  post,
  isLiked,
  setLikeCount,
  setIsLiked,
}: {
  post: Post;
  isLiked: boolean;
  setLikeCount: React.Dispatch<React.SetStateAction<number>>;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [createLikeOrUnlike] = useCreateLikeOrUnLikeMutation();

  const textColor = useTextColor();
  const postBackgroundColor = usePostBackgroundColor();

  const lastPress = useRef(0);

  const handleDoublePress = () => {
    const timeNow = Date.now();
    if (timeNow - lastPress.current < 300) {
      // 300ms threshold for double press
      handlelikeOrUnlikePost();
    }
    lastPress.current = timeNow;
  };

  const handlelikeOrUnlikePost = async () => {
    try {
      setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
      setIsLiked(prev => !prev);
      await createLikeOrUnlike({
        unLike: isLiked ?? true,
        postId: post.id,
      });
    } catch (error) {
      console.log('Error While Commenting', error);
    }
  };

  const renderItem = ({item}: {item: Media}) => {
    return (
      <TouchableOpacity
        onPress={handleDoublePress}
        activeOpacity={1}
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
      </TouchableOpacity>
    );
  };

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

const PostContent = ({
  post,
  isLiked,
  setLikeCount,
  setIsLiked,
}: {
  post: Post;

  isLiked: boolean;
  setLikeCount: React.Dispatch<React.SetStateAction<number>>;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const imagePlaceholderColor = useColorModeValue(
    appColors.white,
    appColors.black,
  );

  const contentBackgroundColor = useColorModeValue(
    appColors.black,
    appColors.gray,
  );

  const postBackgroundColor = usePostBackgroundColor();

  const cardColor = useCardColor();

  const isTextPost = post.media.length === 0;

  return (
    <View
      style={{
        backgroundColor: postBackgroundColor,
        marginHorizontal: 16,
        borderRadius: 10,
      }}>
      {isTextPost ? (
        <TextOnlyContent content={post.textContent} />
      ) : (
        <TextWithMediaContent
          post={post}
          setIsLiked={setIsLiked}
          setLikeCount={setLikeCount}
          isLiked={isLiked}
        />
      )}
      {/* <PostFooter post={post} /> */}
    </View>
  );

  // return isTextPost ? (
  //   <TextOnlyContent content={post.textContent} />
  // ) : (
  //   <TextWithMediaContent post={post} />
  // );
};

const FOOTER_HORIZONTAL_PADDING = 30;
const FOOTER_VERTICAL_PADDING = 14;
const FOOTER_ACTIONS_BUTTON_GAP = 12;

const PostFooter = ({
  post,
  isLiked,
  likeCount,
  setLikeCount,
  setIsLiked,
}: {
  post: Post;

  isLiked: boolean;
  likeCount: number;
  setLikeCount: React.Dispatch<React.SetStateAction<number>>;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [
    getCommentsOnPost,
    {
      data: commentsData,
      isLoading: commentsDataCIP,
      isFetching: commentsDataFIP,
    },
  ] = useLazyGetCommentsByPostIdServiceQuery();

  const [
    getLikesOnPost,
    {data: likesData, isLoading: likesDataCIP, isFetching: likesDataFIP},
  ] = useLazyGetLikesByPostIdServiceQuery();

  const [createComment, {isLoading: createCommentCIP}] =
    useCreateCommentMutation();
  const [createLikeOrUnlike] = useCreateLikeOrUnLikeMutation();

  const commentsBottomSheetRef = useRef<BottomSheetModal>(null);
  const likesBottomSheetRef = useRef<BottomSheetModal>(null);
  const isBottomSheetOpen = useRef(false);

  const iconColor = useColorModeValue(appColors.black, appColors.white);
  const textColor = useColorModeValue(appColors.black, appColors.white);
  const heartColor = appColors.warmRed;
  const lightTextColor = useLightTextColor();

  const {
    handleSubmit,
    control,
    formState: {errors},
    setValue,
    getValues,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      new_comment: '',
    },
  });

  const openCommentsBottomSheet = () => {
    if (commentsBottomSheetRef.current) {
      commentsBottomSheetRef.current.present();
      isBottomSheetOpen.current = true;
    }
  };
  const closeCommentsBottomSheet = () => {
    if (commentsBottomSheetRef.current) {
      commentsBottomSheetRef.current.close();
      isBottomSheetOpen.current = false;
    }
  };

  const openLikesBottomSheet = () => {
    if (likesBottomSheetRef.current) {
      likesBottomSheetRef.current.present();
      isBottomSheetOpen.current = true;
    }
  };
  const closeLikesBottomSheet = () => {
    if (likesBottomSheetRef.current) {
      likesBottomSheetRef.current.close();
      isBottomSheetOpen.current = false;
    }
  };

  // Handle hardware back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isBottomSheetOpen.current) {
          closeCommentsBottomSheet();
          closeLikesBottomSheet();
          return true;
        }

        return false; // return true to prevent default behavior
      },
    );

    return () => backHandler.remove();
  }, []);

  const addComment = async () => {
    // console.log('Comment Data : ', data.new_comment);

    try {
      await createComment({
        content: getValues('new_comment'),
        parentCommentId: null,
        postId: post.id,
      });
      // Call your API to add the comment here
      // After successful submission, you can reset the input field
      await getCommentsOnPost({
        postId: post.id,
      });
      setValue('new_comment', '');
    } catch (error) {
      console.log('Error While Commenting', error);
    }
  };

  const handlelikeOrUnlikePost = async () => {
    try {
      setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
      setIsLiked(prev => !prev);
      await createLikeOrUnlike({
        unLike: isLiked ?? true,
        postId: post.id,
      });
    } catch (error) {
      console.log('Error While Commenting', error);
    }
  };

  useEffect(() => {
    setLikeCount(post.likeCount ?? 0);
  }, [post.likeCount]);

  return (
    <>
      <View
        style={[
          styles.postFooter,
          {
            marginBottom: 4,
          },
        ]}>
        <View style={styles.likesWrapper}>
          <TouchableOpacity
            style={styles.heart}
            activeOpacity={0.4}
            onPress={() => {
              handlelikeOrUnlikePost();
            }}>
            <HeartIcon
              width={20}
              height={20}
              fill={isLiked ? heartColor : 'none'}
              color={isLiked ? heartColor : iconColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.likeCount}
            activeOpacity={0.4}
            onPress={() => {
              getLikesOnPost({
                postId: post.id,
              });
              openLikesBottomSheet();
              // console.log('Open Like bottom sheet : POST ID -->', post.id);
            }}>
            <Text style={fontRegular(14, textColor)}>{likeCount}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            getCommentsOnPost({
              postId: post.id,
            });
            openCommentsBottomSheet();
          }}
          activeOpacity={0.4}>
          <View style={styles.footerActionsWrapper}>
            <CommentIcon width={22} height={22} color={iconColor} />
            <Text style={fontRegular(14, textColor)}>
              {commentsData?.commentCount ?? post.commentCount}
            </Text>
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
            <Text style={fontRegular(14, textColor)}>{post.shareCount}</Text>
          </TouchableOpacity>
        </View>

        {/*  */}
      </View>

      {/* like sheet */}
      {/* comment bottom sheet */}
      <CustomBottomSheet
        bottomSheetRef={likesBottomSheetRef}
        customSnapPoints={['50%']}>
        <View
          style={{
            marginTop: 16,
            marginBottom: 20,
            marginHorizontal: 16,
          }}>
          <Text style={[fontBold(18, textColor)]}>
            Post Likes ({likesData?.likeCount ?? post.likeCount})
          </Text>
        </View>

        {likesDataCIP || !likesData ? (
          <Loader />
        ) : (
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingBottom: 40,
            }}>
            {likesData?.users?.map((user, index) => (
              <View style={styles.commentContainer} key={user.id}>
                <View style={styles.commentHeader}>
                  <View style={[styles.picName]}>
                    <View style={styles.commentProfilePicContainer}>
                      {user.profilePicUrl ? (
                        <Image
                          source={{uri: user.profilePicUrl}}
                          style={{
                            width: 36,
                            height: 36,
                            objectFit: 'contain',
                            borderRadius: 200,
                          }}
                        />
                      ) : (
                        <UserPlaceholderIcon
                          width={36}
                          height={36}
                          color={textColor}
                        />
                      )}
                    </View>
                    <View style={{gap: 2}}>
                      <Text style={fontRegular(14, textColor)}>
                        {user.fullName}
                      </Text>

                      <Text style={fontRegular(10, lightTextColor)}>
                        {user.username}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </BottomSheetScrollView>
        )}
      </CustomBottomSheet>

      {/*  */}

      {/* comment bottom sheet */}
      <CustomBottomSheet
        bottomSheetRef={commentsBottomSheetRef}
        customSnapPoints={['80%']}>
        <View
          style={{
            marginTop: 16,
            marginHorizontal: 16,
          }}>
          <Text style={[fontBold(18, textColor)]}>
            Post Comments ({commentsData?.commentCount ?? post.commentCount})
          </Text>
        </View>

        <View
          style={{
            marginVertical: 20,
            marginHorizontal: 16,
          }}>
          <Controller
            name='new_comment'
            control={control}
            rules={{}}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomTextInputField
                height={46}
                borderRadius={14}
                placeholder='Write a comment...'
                placeholderTextColor={appColors.whisperGray}
                value={value}
                onChangeText={onChange}
                maxLength={500}
                autoCapitalize='none'
                rightElement={
                  <Button
                    style={styles.commentSend}
                    isDisabled={getValues('new_comment').trim().length === 0}
                    isLoading={
                      (createCommentCIP || commentsDataFIP) && !commentsDataCIP
                    }
                    _spinner={{
                      color: appColors.warmRed,
                    }}
                    onPress={addComment}>
                    <MessageSendIcon
                      width={26}
                      height={26}
                      color={appColors.warmRed}
                    />
                  </Button>
                }
                customTextInputStyles={{
                  ...fontRegular(13, textColor),
                }}
              />
            )}
          />
        </View>

        {commentsDataCIP || !commentsData ? (
          <Loader />
        ) : (
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingBottom: 40,
            }}>
            {commentsData?.comments.map((comment, index) => (
              <View style={styles.commentContainer} key={comment.id}>
                <View style={styles.commentHeader}>
                  <View style={[styles.picName]}>
                    <View style={styles.commentProfilePicContainer}>
                      {comment.user.profilePicUrl ? (
                        <Image
                          source={{uri: comment.user.profilePicUrl}}
                          style={{
                            width: 36,
                            height: 36,
                            objectFit: 'contain',
                            borderRadius: 200,
                          }}
                        />
                      ) : (
                        <UserPlaceholderIcon
                          width={36}
                          height={36}
                          color={textColor}
                        />
                      )}
                    </View>
                    <View style={{gap: 2}}>
                      <Text style={fontRegular(14, textColor)}>
                        {comment.user.fullName}
                      </Text>

                      <Text style={fontRegular(10, lightTextColor)}>
                        {comment.user.username}
                      </Text>
                    </View>
                  </View>
                  <Text style={fontRegular(10, lightTextColor)}>
                    {format(comment.createdAt, 'MMM d')}
                  </Text>
                </View>
                <Text
                  style={[
                    fontRegular(12, textColor),
                    {
                      marginVertical: 6,
                      marginLeft: 52,
                    },
                  ]}>
                  {comment.content}
                </Text>
              </View>
            ))}
          </BottomSheetScrollView>
        )}
      </CustomBottomSheet>
    </>
  );
};

export default UserPost;

const styles = StyleSheet.create({
  postContainer: {
    width: '100%',
    marginBottom: 24,
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
  commentProfilePicContainer: {
    width: 36,
    height: 36,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentContainer: {
    paddingVertical: 14,
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: appColors.whisperGray,
  },
  commentSend: {
    width: 40,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
});

const mockComments = [
  {
    id: 1,
    username: 'JohnDoe',
    avatar: 'https://example.com/avatar1.jpg',
    comment: 'This is an amazing post! Thanks for sharing.',
    timestamp: '2025-03-30T12:34:56Z',
    likes: 15,
    replies: [
      {
        id: 101,
        username: 'JaneSmith',
        avatar: 'https://example.com/avatar2.jpg',
        comment: 'I agree! Really insightful.',
        timestamp: '2025-03-30T13:00:00Z',
        likes: 5,
      },
    ],
  },
  {
    id: 2,
    username: 'AliceW',
    avatar: 'https://example.com/avatar3.jpg',
    comment: 'I have a different perspective on this topic.',
    timestamp: '2025-03-30T14:10:30Z',
    likes: 8,
    replies: [],
  },
  {
    id: 3,
    username: 'CharlieP',
    avatar: 'https://example.com/avatar4.jpg',
    comment: 'Does anyone have more resources on this?',
    timestamp: '2025-03-30T15:20:45Z',
    likes: 3,
    replies: [
      {
        id: 102,
        username: 'SamG',
        avatar: 'https://example.com/avatar5.jpg',
        comment: 'Check out this article: https://example.com/resource',
        timestamp: '2025-03-30T16:00:00Z',
        likes: 7,
      },
    ],
  },
];
