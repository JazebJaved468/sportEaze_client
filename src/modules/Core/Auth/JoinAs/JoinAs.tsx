import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode, useState} from 'react';
import PageContainer from '../../../../components/PageContainer';
import GeneralHeader from '../../../../components/GeneralHeader';
import {useTextColor} from '../../../../utils/customHooks/colorHooks';
import {appColors} from '../../../../constants/colors';
import {AthleteIcon, TickIcon} from '../../../../assets/icons';
import {id} from 'date-fns/locale';
import {Button, Icon} from 'native-base';
import {SvgProps} from 'react-native-svg';
import {useAppNavigation} from '../../../../utils/customHooks/navigator';
import {FanRegistrationDetailsPage} from '../../../Fan/FanRegistrationDetails';
import {BUTTON_BORDER_RADIUS} from '../../../../constants/styles';

type OptionCardProps = {
  id: number;
  title: string;
  description: string;
  icon: (props: SvgProps) => React.JSX.Element;
  onPress: () => void;
  selectedOption: number;
  isFirstItem: boolean;
};

const joiningOptions = [
  {
    id: 0,
    title: 'Fan',
    description: 'Stay connected with your favorite teams and athletes',
    icon: AthleteIcon,
  },
  // {
  //   id: 1,
  //   title: 'Player',
  //   description: 'Showcase your skills and grow your sports career',
  //   icon: AthleteIcon,
  // },
  // {
  //   id: 2,
  //   title: 'Patron',
  //   description: 'Support and invest in the future of sports',
  //   icon: AthleteIcon,
  // },
  // {
  //   id: 3,
  //   title: 'Mentor',
  //   description: 'Guide and inspire the next generation of athletes',
  //   icon: AthleteIcon,
  // },
];

const OptionCard = ({
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
        <Icon color={appColors.warmRed} />
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
};

export const JoinAs = () => {
  const navigation = useAppNavigation();
  const textColor = useTextColor();

  const [selectedOption, setSelectedOption] = useState<number>(0);
  return (
    <PageContainer applyGradient>
      <GeneralHeader title='Join As' showRightElement={true} />
      <View style={styles.container}>
        <Text style={{color: textColor, marginTop: 24, marginHorizontal: 16}}>
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
          onPress={() => {
            navigation.navigate(FanRegistrationDetailsPage);
          }}>
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
