import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useEffect} from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {Controller, useForm, useWatch} from 'react-hook-form';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {
  useCardColor,
  useLightTextColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {
  OpenEyeIcon,
  CloseEyeIcon,
  ExploreIcon,
  UserPlaceholderIcon,
  CrossIcon,
} from '../../../assets/icons';
import {View} from 'native-base';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {useAppDispatch} from '../../../utils/customHooks/storeHooks';
import {PlayerProfilePage} from '../../Player/PlayerProfile';
import {appColors} from '../../../constants/colors';
import {useLazyGetSearchedUsersQuery} from '../../../store/core/core.service';
import {USER_TYPE} from '../../../constants/enums';

const FanExplore = () => {
  const textColor = useTextColor();

  const [
    getSearchedUsers,
    {
      data: searchedUsers,
      error: searchedUsersError,
      isLoading: searchUsersCIP,
      isFetching: searchUsersFIP,
    },
  ] = useLazyGetSearchedUsersQuery();

  const {
    handleSubmit,
    control,
    formState: {errors},
    setValue,
    getValues,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      search_query: '',
    },
  });

  console.log('searchedUsers: CIP', searchUsersCIP, 'FIP:', searchUsersFIP);

  const searchQuery = useWatch({
    control,
    name: 'search_query',
  });

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length > 0) {
        // fetchSearchResults(query);
        try {
          const res = await getSearchedUsers(searchQuery, true).unwrap();
          console.log('res:', res);
        } catch (error) {
          console.log('error while searching users:', error);
        }
        // console.log('Call api with - Search Query:', '**', searchQuery);
      }
    }, 500); // 500ms delay before calling API

    return () => clearTimeout(delayDebounce); // Cleanup timeout on each key press
  }, [searchQuery]);

  console.log('searchQuery:', searchQuery);

  return (
    <PageContainer>
      <GeneralHeader title='Explore' />

      <View style={{marginBottom: 20, marginHorizontal: 16}}>
        <Controller
          name='search_query'
          control={control}
          rules={{}}
          render={({field: {onChange, onBlur, value}}) => (
            <CustomTextInputField
              height={46}
              borderRadius={14}
              placeholder='Search for players, fans, patrons, mentors'
              value={value}
              onChangeText={val => {
                onChange(val.trim());
              }}
              maxLength={50}
              isValid={true}
              autoCapitalize='none'
              rightElement={
                <View>
                  {searchQuery.length === 0 ? (
                    <View style={{paddingHorizontal: 8}}>
                      <ExploreIcon width={18} height={18} color={textColor} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => {
                        setValue('search_query', '');
                      }}
                      style={styles.cross}>
                      <CrossIcon
                        width={12}
                        height={12}
                        strokeWidth={1.7}
                        color={textColor}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              }
              customTextInputStyles={{
                ...fontRegular(13, textColor),
              }}
            />
          )}
        />
      </View>

      {searchQuery.length > 0 ? (
        // Search Results
        searchUsersCIP || searchUsersFIP ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}>
            <ActivityIndicator color={textColor} />
            <Text style={fontRegular(16, textColor)}>Searching...</Text>
          </View>
        ) : searchedUsers?.length === 0 &&
          !(searchUsersCIP || searchUsersFIP) ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={fontRegular(16, textColor)}>
              Sorry, No Users found
            </Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{paddingHorizontal: 16, flexGrow: 1}}
            data={searchedUsers ?? []}
            renderItem={({item, index}) => (
              <UserWindow
                fullName={item.fullName}
                profilePicUrl={item.profilePicUrl}
                userId={item.id}
                userType={item.userType}
                username={item.username}
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        )
      ) : (
        // If Not search results

        <View style={{marginHorizontal: 16}}>
          <Text style={fontBold(18, textColor)}>Trending</Text>
        </View>
      )}

      {/* {searchQuery.length > 0 && (searchUsersCIP || searchUsersFIP) ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}>
          <ActivityIndicator color={textColor} />
          <Text style={fontRegular(16, textColor)}>Searching...</Text>
        </View>
      ) : searchQuery.length > 0 && searchedUsers?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={fontRegular(16, textColor)}>Sorry, No Users found</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{paddingHorizontal: 16, flexGrow: 1}}
          data={searchedUsers ?? []}
          renderItem={({item, index}) => (
            <UserWindow
              fullName={item.fullName}
              profilePicUrl={item.profilePicUrl}
              userId={item.id}
              userType={item.userType}
              username={item.username}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      )} */}

      {/* <UserWindow
        fullName='John Doe'
        profilePicUrl=''
        userId='1'
        userType={4}
        username='johndoe'
      /> */}
    </PageContainer>
  );
};

type UserWindowProps = {
  userId: string;
  fullName: string;
  username: string;
  profilePicUrl: string;
  userType: number;
};

const UserWindow: React.FC<UserWindowProps> = memo(
  ({fullName, profilePicUrl, userId, userType, username}) => {
    const textColor = useTextColor();
    const lightTextColor = useLightTextColor();
    const navigation = useAppNavigation();

    const getBadge = (userType: number) => {
      switch (userType) {
        case USER_TYPE.PLAYER:
          return (
            <Text
              style={[
                fontRegular(12, appColors.white),
                styles.badge,
                {
                  backgroundColor: `${appColors.warmRed}90`,
                },
              ]}>
              Player
            </Text>
          );
        case USER_TYPE.FAN:
          return (
            <Text
              style={[
                fontRegular(12, appColors.white),
                styles.badge,
                {
                  backgroundColor: `${appColors.success}90`,
                },
              ]}>
              Fan
            </Text>
          );
        case USER_TYPE.PATRON:
          return (
            <Text
              style={[
                fontRegular(12, appColors.white),
                styles.badge,
                {
                  backgroundColor: `${appColors.gold}90`,
                },
              ]}>
              Patron
            </Text>
          );
        case USER_TYPE.MENTOR:
          return (
            <Text
              style={[
                fontRegular(12, appColors.white),
                styles.badge,
                {
                  backgroundColor: `${appColors.teal}90`,
                },
              ]}>
              Mentor
            </Text>
          );
        default:
          return (
            <Text
              style={[
                fontRegular(12, appColors.white),
                styles.badge,
                {
                  backgroundColor: `${appColors.success}90`,
                },
              ]}>
              Fan
            </Text>
          );
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          if (userType === USER_TYPE.PLAYER) {
            navigation.navigate(PlayerProfilePage, {
              userId: userId,
            });
          }
        }}>
        <View style={styles.picAndName}>
          <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <View style={styles.profilePicContainer}>
              {profilePicUrl ? (
                <Image
                  source={{uri: profilePicUrl}}
                  style={{
                    width: 46,
                    height: 46,
                    objectFit: 'contain',
                    borderRadius: 9,
                  }}
                />
              ) : (
                <UserPlaceholderIcon width={28} height={28} color={textColor} />
              )}
            </View>
            <View style={{gap: 2}}>
              <Text style={fontRegular(16, textColor)}>{fullName}</Text>
              <Text style={fontRegular(12, lightTextColor)}>{username}</Text>
            </View>
          </View>
          {getBadge(userType)}
        </View>
      </TouchableOpacity>
    );
  },
);
export default FanExplore;

const styles = StyleSheet.create({
  picAndName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    // marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  profilePicContainer: {
    width: 46,
    height: 46,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
  cross: {
    width: 30,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingVertical: 4,
    borderRadius: 6,
    width: 60,
    textAlign: 'center',
  },
});
