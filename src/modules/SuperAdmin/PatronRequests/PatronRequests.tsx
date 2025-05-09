import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {Loader} from '../../../components/Loader';
import {useGetPatronRequestsQuery} from '../../../store/superAdmin/superAdmin.service';
import {PatronAccountStatus, USER_TYPE} from '../../../constants/enums';
import {
  EditProfileIcon,
  UserApprovedIcon,
  UserPendingIcon,
  UserPlaceholderIcon,
  UserRejectedIcon,
} from '../../../assets/icons';
import {appColors} from '../../../constants/colors';
import {Button} from 'native-base';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {
  useCardColor,
  usePageBackgroundColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';

const PatronRequests = () => {
  const {data, isLoading} = useGetPatronRequestsQuery();

  const textColor = useTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  return (
    <PageContainer>
      <GeneralHeader title='Patron Requests' showRightElement={false} />

      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          ListHeaderComponent={
            <View
              style={[
                {
                  backgroundColor: cardColor,
                },
                styles.cardContainer,
                containerShadow,
              ]}>
              <Text style={fontBold(14, textColor)}>
                Number Of Requests :
                <Text style={fontBold(14, appColors.warmRed)}>
                  {` ${data?.length}`}
                </Text>
              </Text>
            </View>
          }
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          keyExtractor={(item, index) => item.username}
          data={[
            {
              name: 'Jazeb Javed',
              username: 'jazebjaved',
              userType: USER_TYPE.PLAYER,
              followersCount: 123,
              sportInterest: 'Cricket',
              profilePicUrl:
                'https://res.cloudinary.com/dpe70dvug/image/upload/v1742500736/xr3pge1bh380dkesvwpw.jpg',
            },
            {
              name: 'Zohaib Ali',
              username: 'jazebjaved1',
              userType: USER_TYPE.PLAYER,
              followersCount: 123,
              sportInterest: 'Cricket',
              profilePicUrl:
                'https://res.cloudinary.com/dpe70dvug/image/upload/v1742500736/xr3pge1bh380dkesvwpw.jpg',
            },
            {
              name: 'Jazeb Javed',
              username: 'jazebjaved2',
              userType: USER_TYPE.PLAYER,
              followersCount: 123,
              sportInterest: 'Cricket',
              profilePicUrl:
                'https://res.cloudinary.com/dpe70dvug/image/upload/v1742500736/xr3pge1bh380dkesvwpw.jpg',
            },
            {
              name: 'Zohaib Ali',
              username: 'jazebjaved3',
              userType: USER_TYPE.PLAYER,
              followersCount: 123,
              sportInterest: 'Cricket',
              profilePicUrl:
                'https://res.cloudinary.com/dpe70dvug/image/upload/v1742500736/xr3pge1bh380dkesvwpw.jpg',
            },
          ]}
          renderItem={({item}) => (
            <View style={{marginVertical: 12, marginHorizontal: 12}}>
              <PatronCard
                username={item.username}
                name={item.name}
                profilePicUrl={item.profilePicUrl}
              />
            </View>
          )}
        />
      )}
    </PageContainer>
  );
};

type PatronCardProps = {
  name: string;
  username: string;
  profilePicUrl: string;
};

const {width: screenWidth} = Dimensions.get('window');

const PatronCard: React.FC<PatronCardProps> = ({
  profilePicUrl,
  username,
  name,
}) => {
  const containerShadow = useContainerShadow();
  const backgroundColor = useCardColor();
  const textColor = useTextColor();
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      style={[{backgroundColor, borderRadius: 14}, containerShadow]}
      //   onPress={() => navigation.navigate('PatronRequestDetails')}
      activeOpacity={0.8}>
      <View
        style={[
          {
            minWidth: screenWidth / 2 - 36,
            alignSelf: 'flex-start',
            paddingHorizontal: 16,
            paddingVertical: customHeight(18),
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: appColors.whisperGray,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            overflow: 'hidden',
            marginBottom: customHeight(14),
          }}>
          {profilePicUrl ? (
            <Image
              source={{uri: profilePicUrl}}
              style={{
                width: 80,
                height: 80,
                objectFit: 'contain',
                borderRadius: 9,
              }}
            />
          ) : (
            <UserPlaceholderIcon width={22} height={22} color={textColor} />
          )}
        </View>

        <Text
          style={[fontBold(14, textColor), {marginBottom: customHeight(4)}]}>
          {name}
        </Text>
        <Text
          style={[
            fontRegular(12, `${textColor}90`),
            {marginBottom: customHeight(12)},
          ]}>
          {username}
        </Text>
        <PatronAccountStatusBadge status={PatronAccountStatus.PENDING} />
      </View>
    </TouchableOpacity>
  );
};

const PatronAccountStatusBadge = ({status}: {status: number}) => {
  const {userType, user} = useAppSelector(state => state.auth);

  const isAccountPending = status === PatronAccountStatus.PENDING;
  const isAccountRejected = status === PatronAccountStatus.REJECTED;
  const isAccountApproved = status === PatronAccountStatus.APPROVED;
  const isAccountModificationRequired =
    status === PatronAccountStatus.MODIFICATION_REQUIRED;

  const getColor = () => {
    if (isAccountPending) {
      return `${appColors.gold}40`;
    } else if (isAccountApproved) {
      return `${appColors.success}40`;
    } else if (isAccountModificationRequired) {
      return `${appColors.masculineBlue}30`;
    } else if (isAccountRejected) {
      return `${appColors.error}40`;
    }
  };

  const getBorderColor = () => {
    if (isAccountPending) {
      return `${appColors.gold}`;
    } else if (isAccountApproved) {
      return `${appColors.success}`;
    } else if (isAccountModificationRequired) {
      return `${appColors.masculineBlue}`;
    } else if (isAccountRejected) {
      return `${appColors.error}`;
    }
  };

  const getMessage = () => {
    if (isAccountPending) {
      return 'Pending';
    } else if (isAccountApproved) {
      return 'Approved';
    } else if (isAccountModificationRequired) {
      return 'Modification';
    } else if (isAccountRejected) {
      return 'Rejected';
    }
  };

  const getIcon = () => {
    if (isAccountPending) {
      return (
        <UserPendingIcon
          width={customWidth(10)}
          height={customHeight(10)}
          color={appColors.black}
        />
      );
    } else if (isAccountApproved) {
      return (
        <UserApprovedIcon
          width={customWidth(10)}
          height={customHeight(10)}
          color={appColors.black}
        />
      );
    } else if (isAccountModificationRequired) {
      return (
        <EditProfileIcon
          width={customWidth(10)}
          height={customHeight(10)}
          color={appColors.black}
        />
      );
    } else if (isAccountRejected) {
      return (
        <UserRejectedIcon
          width={customWidth(10)}
          height={customHeight(10)}
          color={appColors.black}
        />
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: getColor(),
        borderWidth: 1,
        borderColor: getBorderColor(),
        borderRadius: 6,
        borderStyle: 'dashed',
        paddingVertical: customHeight(5),
        paddingHorizontal: customWidth(8),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: customWidth(5),
        }}>
        {getIcon()}
        <Text style={[fontRegular(10, appColors.black)]}>{getMessage()}</Text>
      </View>
      {user?.patron?.adminReviewComment ? (
        <Text
          style={[
            fontRegular(14, appColors.black),
            {marginTop: customHeight(12)},
          ]}>
          Admin Feedback : {user?.patron?.adminReviewComment}
        </Text>
      ) : null}
    </View>
  );
};

export default PatronRequests;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: 12,
    marginVertical: customHeight(10),
  },
});
