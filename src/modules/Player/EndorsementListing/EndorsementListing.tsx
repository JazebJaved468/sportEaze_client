import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import {GiveEndorsementPageRouteProp} from '../../Mentor/GiveEndorsement/GiveEndorsement';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {useGetPlayerEndorsementsQuery} from '../../../store/patron/patron.service';
import {Loader} from '../../../components/Loader';
import {
  EndorsementIcon,
  FollowingsIcon,
  UserPlaceholderIcon,
} from '../../../assets/icons';
import PullToRefresh from '../../../components/PullToRefresh';
import {appColors} from '../../../constants/colors';
import {fontRegular, fontBold} from '../../../styles/fonts';
import {
  useTextColor,
  useCardColor,
  useLightTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {Endorsement} from '../../../types/patron/patron.type';
import {navigateToProfilePage} from '../../../utils/helpers/navigation';
import {format} from 'date-fns';

export type EndorsementListingPageRouteProp = RouteProp<
  RootStackParamList,
  'EndorsementListingPage'
>;

const EndorsementListing = () => {
  const {params} = useRoute<EndorsementListingPageRouteProp>();

  const {
    data: endorsements,
    isLoading: endorsementsCIP,
    isFetching: endorsementsFIP,
    refetch: refetchEndorsements,
  } = useGetPlayerEndorsementsQuery({playerId: params.playerId});

  const textColor = useTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const onRefresh = async () => {
    await refetchEndorsements();
  };

  console.log('endorsements', endorsements);
  return (
    <PageContainer>
      <GeneralHeader title='Endorsements' showRightElement={false} />

      {endorsementsCIP || !endorsements ? (
        <Loader />
      ) : (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={[
              {
                paddingHorizontal: 20,
                flexGrow: 1,
                gap: 16,
                paddingBottom: 50,
              },
            ]}
            data={endorsements}
            ListHeaderComponent={
              endorsements.length === 0 ? null : (
                <View
                  style={[
                    {
                      marginTop: 16,
                      marginBottom: 4,
                      backgroundColor: cardColor,
                      // padding: 16,
                      borderRadius: 16,
                    },
                    // containerShadow,
                  ]}>
                  <Text style={[fontBold(14, textColor)]}>
                    {endorsements[0].player.fullName} has
                    <Text style={fontBold(14, appColors.warmRed)}>
                      {`  ${endorsements.length}  `}
                    </Text>
                    endorsements(s) by Mentors
                  </Text>
                </View>
              )
            }
            refreshControl={<PullToRefresh onRefresh={onRefresh} />}
            renderItem={({item, index}) => <EndorsementCard data={item} />}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <EndorsementIcon
                  width={90}
                  height={90}
                  color={textColor}
                  strokeWidth={0.8}
                />
                <Text
                  style={[
                    fontBold(16, textColor),
                    {marginTop: 16, width: '80%', textAlign: 'center'},
                  ]}>
                  {`No endorsements yet!`}
                </Text>
              </View>
            }
          />
        </>
      )}
    </PageContainer>
  );
};

const EndorsementCard = ({data}: {data: Endorsement}) => {
  const textColor = useTextColor();
  const lightTextColor = useLightTextColor();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  return (
    <View
      style={[
        {
          // marginTop: 16,
          // marginBottom: 4,
          backgroundColor: cardColor,
          padding: 16,
          borderRadius: 16,
        },
        containerShadow,
      ]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigateToProfilePage({
            userId: data.mentor.id,
            userType: data.mentor.userType,
          });
        }}>
        <View style={styles.picAndName}>
          <View style={styles.profilePicContainer}>
            {data.mentor.profilePicUrl ? (
              <Image
                source={{uri: data.mentor.profilePicUrl}}
                style={{
                  width: 45,
                  height: 45,
                  objectFit: 'contain',
                  borderRadius: 9,
                }}
              />
            ) : (
              <UserPlaceholderIcon width={28} height={28} color={textColor} />
            )}
          </View>

          <Text style={fontRegular(13, textColor)}>{data.mentor.fullName}</Text>
          <Text style={[fontRegular(11, lightTextColor), {marginLeft: 'auto'}]}>
            {format(data.createdAt, 'dd MMM yyyy')}
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={fontRegular(13, textColor)}>{data.review}</Text>
    </View>
  );
};

export default EndorsementListing;

const styles = StyleSheet.create({
  picAndName: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePicContainer: {
    width: 45,
    height: 45,
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    overflow: 'hidden',
  },
});
