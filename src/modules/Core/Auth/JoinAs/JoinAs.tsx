import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback, useMemo, useState} from 'react';
import PageContainer from '../../../../components/PageContainer';
import GeneralHeader from '../../../../components/GeneralHeader';
import {useTextColor} from '../../../../utils/customHooks/colorHooks';
import {appColors} from '../../../../constants/colors';
import {
  JoinAsFanIcon,
  JoinAsMentorIcon,
  JoinAsPatronIcon,
  JoinAsPlayerIcon,
  LogoutIcon,
  TickIcon,
} from '../../../../assets/icons';
import {Button} from 'native-base';
import {SvgProps} from 'react-native-svg';
import {useAppNavigation} from '../../../../utils/customHooks/navigator';
import {FanRegistrationDetailsPage} from '../../../Fan/FanRegistrationDetails';
import {BUTTON_BORDER_RADIUS} from '../../../../constants/styles';
import {fontBold} from '../../../../styles/fonts';
import {RecommendationsPage} from '../../../Fan/Recommendations';
import {PlayerRegistrationDetailsPage} from '../../../Player/PlayerRegistrationDetails';
import {MentorRegistrationDetailsPage} from '../../../Mentor/MentorRegistrationDetails.tsx';
import {onLogout} from '../../../../utils/helpers/auth.ts';

type OptionCardProps = {
  id: number;
  title: string;
  description: string;
  icon: (props: SvgProps) => React.JSX.Element;
  onPress: () => void;
  selectedOption: number;
  isFirstItem: boolean;
};

const OptionCard = memo(
  ({
    id,
    title,
    description,
    icon: Icon,
    onPress,
    selectedOption,
    isFirstItem = false,
  }: OptionCardProps) => {
    const textColor = useTextColor();
    const isSelected = selectedOption === id;
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={[
          styles.optionCard,
          {
            borderColor: isSelected ? appColors.warmRed : appColors.whisperGray,
            marginTop: isFirstItem ? 30 : 0,
          },
        ]}>
        {isSelected ? (
          <View
            style={{
              position: 'absolute',
              width: 20,
              height: 20,
              backgroundColor: appColors.warmRed,
              borderRadius: 100,
              right: -6,
              top: -6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TickIcon color={appColors.white} width={10} />
          </View>
        ) : null}

        <View
          style={{
            width: 46,
            height: 46,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          <Icon width={46} height={46} color={appColors.warmRed} />
        </View>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: textColor,
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 10,
            }}>
            {title}
          </Text>
          <Text style={{color: textColor}}>{description}</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

export const JoinAs = () => {
  const navigation = useAppNavigation();
  const textColor = useTextColor();

  const navigateToFanRegistration = useCallback(() => {
    navigation.navigate(FanRegistrationDetailsPage, {isEditProfile: false});
  }, [navigation]);

  const navigateToPlayerRegistration = useCallback(() => {
    navigation.navigate(PlayerRegistrationDetailsPage);
  }, [navigation]);

  const navigateToMentorRegistration = useCallback(() => {
    navigation.navigate(MentorRegistrationDetailsPage);
  }, [navigation]);

  const joiningOptions = useMemo(
    () => [
      {
        id: 0,
        title: 'Fan',
        description: 'Stay connected with your favorite teams and athletes',
        icon: JoinAsFanIcon,
        onPress: navigateToFanRegistration,
      },
      {
        id: 1,
        title: 'Player',
        description: 'Showcase your skills and grow your sports career',
        icon: JoinAsPlayerIcon,
        onPress: navigateToPlayerRegistration,
      },
      {
        id: 2,
        title: 'Patron',
        description: 'Support and invest in the future of sports',
        icon: JoinAsPatronIcon,
        onPress: navigateToPlayerRegistration,
      },
      {
        id: 3,
        title: 'Mentor',
        description: 'Guide and inspire the next generation of athletes',
        icon: JoinAsMentorIcon,
        onPress: navigateToMentorRegistration,
      },
    ],
    [
      navigateToFanRegistration,
      navigateToPlayerRegistration,
      navigateToMentorRegistration,
    ],
  );

  const [selectedOption, setSelectedOption] = useState<number>(
    joiningOptions[0].id,
  );

  return (
    <PageContainer applyGradient>
      <GeneralHeader
        showLeftElement={false}
        title='Join As'
        showRightElement={true}
        rightElement={
          <TouchableOpacity
            activeOpacity={0.5}
            hitSlop={20}
            onPress={onLogout}
            style={{marginRight: -10}}>
            <View style={{padding: 10}}>
              <LogoutIcon
                strokeWidth={1.5}
                width={24}
                height={24}
                color={textColor}
              />
            </View>
          </TouchableOpacity>
        }
      />
      <View style={styles.container}>
        <Text
          style={[
            fontBold(18, textColor),
            {color: textColor, marginTop: 24, marginHorizontal: 16},
          ]}>
          Please select any one option
        </Text>

        <FlatList
          data={joiningOptions}
          renderItem={({item, index}) => (
            <OptionCard
              isFirstItem={index === 0}
              id={item.id}
              selectedOption={selectedOption}
              title={item.title}
              description={item.description}
              onPress={() => {
                setSelectedOption(item.id);
              }}
              icon={item.icon}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />

        <Button
          style={{
            height: 48,
            borderRadius: BUTTON_BORDER_RADIUS,
            marginBottom: 20,
            marginHorizontal: 16,
          }}
          onPress={joiningOptions[selectedOption]?.onPress}>
          Next
        </Button>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 16,
    flex: 1,
  },
  optionCard: {
    backgroundColor: appColors.transparent,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    marginHorizontal: 16,
  },
});
