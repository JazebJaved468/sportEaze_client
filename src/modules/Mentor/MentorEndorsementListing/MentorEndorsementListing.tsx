import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Loader} from '../../../components/Loader';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {RouteProp, useRoute} from '@react-navigation/native';
import {EndorsementIcon, UserPlaceholderIcon} from '../../../assets/icons';
import GeneralHeader from '../../../components/GeneralHeader';
import PageContainer from '../../../components/PageContainer';
import PullToRefresh from '../../../components/PullToRefresh';
import {appColors} from '../../../constants/colors';
import {
  useGetMentorEndorsementsQuery,
  useGetPlayerEndorsementsQuery,
} from '../../../store/patron/patron.service';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {Endorsement} from '../../../types/patron/patron.type';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {navigateToProfilePage} from '../../../utils/helpers/navigation';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';

export type MentorEndorsementListingPageRouteProp = RouteProp<
  RootStackParamList,
  'MentorEndorsementListingPage'
>;
const MentorEndorsementListing = () => {
  const {params} = useRoute<MentorEndorsementListingPageRouteProp>();

  const {
    data: endorsements,
    isLoading: endorsementsCIP,
    isFetching: endorsementsFIP,
    refetch: refetchEndorsements,
  } = useGetMentorEndorsementsQuery({mentorId: params.mentorId});

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
                    {endorsements[0].player.fullName} has given
                    <Text style={fontBold(14, appColors.warmRed)}>
                      {`  ${endorsements.length}  `}
                    </Text>
                    endorsements(s) to Players
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
            userId: data.player.id,
            userType: data.player.userType,
          });
        }}>
        <View style={styles.picAndName}>
          <View style={styles.profilePicContainer}>
            {data.player.profilePicUrl ? (
              <Image
                source={{uri: data.player.profilePicUrl}}
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

          <View>
            <Text style={fontRegular(13, textColor)}>
              {data.player.fullName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={fontRegular(13, textColor)}>{data.review}</Text>
    </View>
  );
};

export default MentorEndorsementListing;

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
