import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {
  usePageBackgroundColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {
  fontBold,
  fontExtraBold,
  fontLight,
  fontRegular,
} from '../../../styles/fonts';
import {appColors} from '../../../constants/colors';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {
  ConnectionNetworkIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import {Button, FlatList} from 'native-base';
import {USER_TYPE} from '../../../constants/enums';
import {BUTTON_BORDER_RADIUS} from '../../../constants/styles';
import {PulseEffect} from '../../../components/PulseEffect';
import {FanRootPage} from '../Root';

const Recommendations = () => {
  const navigation = useAppNavigation();
  const textColor = useTextColor();
  return (
    <PageContainer>
      <GeneralHeader title='Recommendations' showLeftElement={false} />

      <ScrollView contentContainerStyle={styles.container}>
        <ConnectionNetworkIcon
          width={100}
          height={100}
          color={appColors.warmRed}
          style={{alignSelf: 'center'}}
        />
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <Text
            style={[
              fontRegular(14, textColor),
              {marginTop: 20, marginBottom: 40},
            ]}>
            Great Choice! Here’s Who You Should Follow And connect based on your
            interests
          </Text>
          {/* <Text style={[fontLight(14, textColor), {marginBottom: 40}]}>
            Based on your interests, we’ve found some amazing players, mentors,
            and fans you might want to connect with. Start building your sports
            community!
          </Text> */}
        </View>

        {/* Recommended Players */}

        <Text
          style={[
            fontExtraBold(18, appColors.warmRed),
            {textAlign: 'left', paddingHorizontal: 16},
          ]}>
          Recommended Players
        </Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 16,
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
              name: 'Muazzam Khan',
              username: 'jazebjaved2',
              userType: USER_TYPE.PLAYER,
              followersCount: 123,
              sportInterest: 'Cricket',
              profilePicUrl:
                'https://res.cloudinary.com/dpe70dvug/image/upload/v1742500736/xr3pge1bh380dkesvwpw.jpg',
            },
          ]}
          renderItem={({item}) => (
            <View style={{marginVertical: 20}}>
              <RecommendedUserCard
                userType={item.userType}
                name={item.name}
                followersCount={item.followersCount}
                sportInterest={item.sportInterest}
                profilePicUrl={item.profilePicUrl}
              />
            </View>
          )}
        />

        {/* Recommended Mentors */}

        <Text
          style={[
            fontExtraBold(18, appColors.warmRed),
            {textAlign: 'left', paddingHorizontal: 16, marginTop: 30},
          ]}>
          Recommended Mentors
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 16,
          }}
          keyExtractor={(item, index) => item.username}
          data={[
            {
              name: 'Jazeb Javed',
              userType: USER_TYPE.MENTOR,
              username: 'jazebjaved',
              followersCount: 123,
              sportInterest: 'Cricket',
              profilePicUrl:
                'https://res.cloudinary.com/dpe70dvug/image/upload/v1742500736/xr3pge1bh380dkesvwpw.jpg',
            },
            {
              name: 'Zohaib Ali',
              username: 'jazebjaved1',
              userType: USER_TYPE.MENTOR,
              followersCount: 123,
              sportInterest: 'Cricket',
              profilePicUrl:
                'https://res.cloudinary.com/dpe70dvug/image/upload/v1742500736/xr3pge1bh380dkesvwpw.jpg',
            },
            {
              name: 'Muazzam Khan',
              username: 'jazebjaved2',
              userType: USER_TYPE.MENTOR,
              followersCount: 123,
              sportInterest: 'Cricket',
              profilePicUrl:
                'https://res.cloudinary.com/dpe70dvug/image/upload/v1742500736/xr3pge1bh380dkesvwpw.jpg',
            },
          ]}
          renderItem={({item}) => (
            <View style={{marginVertical: 20}}>
              <RecommendedUserCard
                userType={item.userType}
                name={item.name}
                followersCount={item.followersCount}
                sportInterest={item.sportInterest}
                profilePicUrl={item.profilePicUrl}
              />
            </View>
          )}
        />

        <PulseEffect onPress={() => navigation.navigate(FanRootPage)}>
          <Button
            style={{
              marginHorizontal: 16,
              height: 48,
              borderRadius: BUTTON_BORDER_RADIUS,
              marginTop: 40,
            }}>
            <Text style={fontRegular(16, appColors.white)}>Continue</Text>
          </Button>
        </PulseEffect>
      </ScrollView>
    </PageContainer>
  );
};

type RecommendedUserCardProps = {
  name: string;
  profilePicUrl: string;
  followersCount: number;
  sportInterest: string;
  userType: number;
};

const RecommendedUserCard: React.FC<RecommendedUserCardProps> = ({
  followersCount,
  profilePicUrl,
  sportInterest,
  name,
  userType = USER_TYPE.PLAYER,
}) => {
  const containerShadow = useContainerShadow();
  const backgroundColor = usePageBackgroundColor();
  const textColor = useTextColor();
  const navigation = useAppNavigation();

  const handleAction = () => {
    console.log('Action');
  };
  return (
    <View
      style={[
        {
          backgroundColor: backgroundColor,
          minWidth: 150,
          alignSelf: 'flex-start',
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderRadius: 14,
          justifyContent: 'center',
          alignItems: 'center',
        },
        containerShadow,
      ]}>
      <View
        style={{
          width: 70,
          height: 70,
          backgroundColor: appColors.whisperGray,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 100,
          overflow: 'hidden',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('LoginPage')}>
          {profilePicUrl ? (
            <Image
              source={{uri: profilePicUrl}}
              style={{
                width: 70,
                height: 70,
                objectFit: 'contain',
                borderRadius: 9,
              }}
            />
          ) : (
            <UserPlaceholderIcon width={22} height={22} color={textColor} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={[fontBold(14, textColor), {marginBottom: 4}]}>{name}</Text>
      <Text
        style={[
          fontRegular(12, `${textColor}90`),
          {marginBottom: 10},
        ]}>{`${followersCount} ${userType === USER_TYPE.PLAYER ? 'Followers' : 'Connections'}`}</Text>

      <Button style={{borderRadius: 12}} onPress={handleAction}>
        <Text
          style={[
            fontRegular(12, appColors.white),
            {
              paddingHorizontal: 16,
              paddingVertical: 6,
            },
          ]}>
          {userType === USER_TYPE.PLAYER ? 'Follow' : 'Connect'}
        </Text>
      </Button>
    </View>
  );
};

export default Recommendations;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    marginTop: 20,
    paddingBottom: 40,
  },
});
