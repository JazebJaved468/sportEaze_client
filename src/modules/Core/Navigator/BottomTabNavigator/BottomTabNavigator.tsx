import {StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';

import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {appColors} from '../../../../constants/colors';
import PostFeed from '../../PostFeed';
import ChatListing from '../../Chat/ChatListing';
import CreatePost from '../../../Player/CreatePost';
import {useColorModeValue} from 'native-base';
import {
  CreateIcon,
  ExploreIcon,
  HomeIcon,
  MessageIcon,
  ProfileIcon,
} from '../../../../assets/icons';
import {useCardColor} from '../../../../utils/customHooks/colorHooks';
import Menu from '../../Menu';
import PlayerProfile from '../../../Player/PlayerProfile';
import FanExplore from '../../../Fan/FanExplore';

const TAB_ICONS_SIZE = 20;

const Tab = createBottomTabNavigator();

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: {
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: 8,
    // paddingTop: 8,
    borderTopWidth: 0,
    borderTopColor: '#E0E0E0',
    // borderTopColor: '#fff',
    elevation: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarHideOnKeyboard: true,
  // tabBarLabelStyle: {
  //   fontSize: 12,
  //   fontWeight: '500',
  // },
};

const BottomTabNames = {
  Feed: 'Feed',
  Profile: 'Profile',
  Create: 'Create',
  Messages: 'Messages',
  Menu: 'Menu',
  Explore: 'Explore',
};

const TabBarItem = ({
  focused,
  color,
  icon,
  label,
}: {
  focused: boolean;
  color: string;
  icon: ReactNode;
  label: string;
}) => {
  return (
    <>
      {icon}
      {focused && (
        <Text
          style={{
            fontSize: 10,
            color: color,
            marginTop: 4,
            fontWeight: '500',
          }}>
          {label}
        </Text>
      )}
    </>
  );
};

export const FanBottomTabNavigator = () => {
  const backgroundColor = useCardColor();
  const tabBarItemActiveColor = useColorModeValue(
    appColors.black,
    appColors.white,
  );
  const tabBarItemInActiveColor = useColorModeValue(
    `${appColors.gray}90`,
    appColors.white,
  );
  const tabBarItemOverlayColor = useColorModeValue(
    `${appColors.warmRed}30`,
    `${appColors.warmRed}`,
  );

  const colorMode = useColorModeValue('light', 'dark');

  return (
    <Tab.Navigator
      // initialRouteName='Events'
      // backBehavior={'initialRoute'}
      screenOptions={({route}) => {
        return {
          ...screenOptions,
          tabBarStyle: {
            ...(screenOptions.tabBarStyle as object),
            backgroundColor,
            // borderTopWidth: colorMode === 'dark' ? 0.5 : 0,
          },
          tabBarActiveTintColor: tabBarItemActiveColor,
          tabBarInactiveTintColor: tabBarItemInActiveColor,

          tabBarIcon: props => {
            const {color, focused} = props;

            return (
              <View
                style={[
                  styles.iconContainer,
                  focused && {backgroundColor: tabBarItemOverlayColor},
                ]}>
                {route.name === BottomTabNames.Feed && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <HomeIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Explore && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <ExploreIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Messages && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <MessageIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Profile && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <ProfileIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}
              </View>
            );
          },
        };
      }}>
      <Tab.Screen name={BottomTabNames.Feed} component={PostFeed} />
      <Tab.Screen name={BottomTabNames.Explore} component={FanExplore} />
      <Tab.Screen name={BottomTabNames.Messages} component={ChatListing} />
      {/* <Tab.Screen name={BottomTabNames.Profile} component={FanMenu} /> */}
      <Tab.Screen name={BottomTabNames.Profile} component={Menu} />
    </Tab.Navigator>
  );
};

export const PlayerBottomTabNavigator = () => {
  const backgroundColor = useCardColor();
  const tabBarItemActiveColor = useColorModeValue(
    appColors.black,
    appColors.white,
  );
  const tabBarItemInActiveColor = useColorModeValue(
    `${appColors.gray}90`,
    appColors.white,
  );
  const tabBarItemOverlayColor = useColorModeValue(
    `${appColors.warmRed}30`,
    `${appColors.warmRed}`,
  );
  const colorMode = useColorModeValue('light', 'dark');
  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        return {
          ...screenOptions,
          tabBarStyle: {
            ...(screenOptions.tabBarStyle as object),
            backgroundColor,
            // borderTopWidth: colorMode === 'dark' ? 0.5 : 0,
          },
          tabBarActiveTintColor: tabBarItemActiveColor,
          tabBarInactiveTintColor: tabBarItemInActiveColor,

          tabBarIcon: props => {
            const {color, focused} = props;

            return (
              <View
                style={[
                  styles.iconContainer,
                  focused && {backgroundColor: tabBarItemOverlayColor},
                ]}>
                {route.name === BottomTabNames.Feed && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <HomeIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Explore && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <ExploreIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Create && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <CreateIcon
                        color={color}
                        width={
                          focused ? TAB_ICONS_SIZE + 10 : TAB_ICONS_SIZE + 24
                        }
                        height={
                          focused ? TAB_ICONS_SIZE + 10 : TAB_ICONS_SIZE + 24
                        }
                        strokeWidth={focused ? 1.1 : 0.7}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Messages && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <MessageIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Profile && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <ProfileIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}
              </View>
            );
          },
        };
      }}>
      <Tab.Screen name={BottomTabNames.Feed} component={PostFeed} />
      <Tab.Screen name={BottomTabNames.Explore} component={FanExplore} />
      <Tab.Screen name={BottomTabNames.Create} component={CreatePost} />
      <Tab.Screen name={BottomTabNames.Messages} component={ChatListing} />
      <Tab.Screen name={BottomTabNames.Profile} component={Menu} />
    </Tab.Navigator>
  );
};

export const PatronBottomTabNavigator = () => {
  const backgroundColor = useCardColor();
  const tabBarItemActiveColor = useColorModeValue(
    appColors.black,
    appColors.white,
  );
  const tabBarItemInActiveColor = useColorModeValue(
    `${appColors.gray}90`,
    appColors.white,
  );
  const tabBarItemOverlayColor = useColorModeValue(
    `${appColors.warmRed}30`,
    `${appColors.warmRed}`,
  );
  const colorMode = useColorModeValue('light', 'dark');
  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        return {
          ...screenOptions,
          tabBarStyle: {
            ...(screenOptions.tabBarStyle as object),
            backgroundColor,
            // borderTopWidth: colorMode === 'dark' ? 0.5 : 0,
          },
          tabBarActiveTintColor: tabBarItemActiveColor,
          tabBarInactiveTintColor: tabBarItemInActiveColor,

          tabBarIcon: props => {
            const {color, focused} = props;

            return (
              <View
                style={[
                  styles.iconContainer,
                  focused && {backgroundColor: tabBarItemOverlayColor},
                ]}>
                {route.name === BottomTabNames.Feed && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <HomeIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Explore && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <ExploreIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Create && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <CreateIcon
                        color={color}
                        width={
                          focused ? TAB_ICONS_SIZE + 10 : TAB_ICONS_SIZE + 24
                        }
                        height={
                          focused ? TAB_ICONS_SIZE + 10 : TAB_ICONS_SIZE + 24
                        }
                        strokeWidth={focused ? 1.1 : 0.7}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Messages && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <MessageIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Profile && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <ProfileIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}
              </View>
            );
          },
        };
      }}>
      <Tab.Screen name={BottomTabNames.Feed} component={PostFeed} />
      <Tab.Screen name={BottomTabNames.Explore} component={FanExplore} />
      <Tab.Screen name={BottomTabNames.Create} component={CreatePost} />
      <Tab.Screen name={BottomTabNames.Messages} component={ChatListing} />
      <Tab.Screen name={BottomTabNames.Profile} component={Menu} />
    </Tab.Navigator>
  );
};

export const MentorBottomTabNavigator = () => {
  const backgroundColor = useCardColor();
  const tabBarItemActiveColor = useColorModeValue(
    appColors.black,
    appColors.white,
  );
  const tabBarItemInActiveColor = useColorModeValue(
    `${appColors.gray}90`,
    appColors.white,
  );
  const tabBarItemOverlayColor = useColorModeValue(
    `${appColors.warmRed}30`,
    `${appColors.warmRed}`,
  );
  const colorMode = useColorModeValue('light', 'dark');
  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        return {
          ...screenOptions,
          tabBarStyle: {
            ...(screenOptions.tabBarStyle as object),
            backgroundColor,
            // borderTopWidth: colorMode === 'dark' ? 0.5 : 0,
          },
          tabBarActiveTintColor: tabBarItemActiveColor,
          tabBarInactiveTintColor: tabBarItemInActiveColor,

          tabBarIcon: props => {
            const {color, focused} = props;

            return (
              <View
                style={[
                  styles.iconContainer,
                  focused && {backgroundColor: tabBarItemOverlayColor},
                ]}>
                {route.name === BottomTabNames.Feed && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <HomeIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Explore && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <ExploreIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Create && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <CreateIcon
                        color={color}
                        width={
                          focused ? TAB_ICONS_SIZE + 10 : TAB_ICONS_SIZE + 24
                        }
                        height={
                          focused ? TAB_ICONS_SIZE + 10 : TAB_ICONS_SIZE + 24
                        }
                        strokeWidth={focused ? 1.1 : 0.7}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Messages && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <MessageIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}

                {route.name === BottomTabNames.Profile && (
                  <TabBarItem
                    color={color}
                    focused={focused}
                    icon={
                      <ProfileIcon
                        color={color}
                        width={TAB_ICONS_SIZE}
                        height={TAB_ICONS_SIZE}
                      />
                    }
                    label={route.name}
                  />
                )}
              </View>
            );
          },
        };
      }}>
      <Tab.Screen name={BottomTabNames.Feed} component={PostFeed} />
      <Tab.Screen name={BottomTabNames.Explore} component={FanExplore} />
      <Tab.Screen name={BottomTabNames.Create} component={CreatePost} />
      <Tab.Screen name={BottomTabNames.Messages} component={PlayerProfile} />
      <Tab.Screen name={BottomTabNames.Profile} component={Menu} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 12,
    // paddingHorizontal: 16,
    height: 62,
    width: 68,
    borderRadius: 18,
  },
});
