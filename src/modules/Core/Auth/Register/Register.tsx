import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button, ScrollView} from 'native-base';
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from '../../../../store/auth/auth.service';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../utils/customHooks/storeHooks';
import {CustomTextInputField} from '../../../../components/CustomInputField';
import {
  validEmailRegex,
  validPasswordRegex,
} from '../../../../utils/helpers/patterns';
import {
  CloseEyeIcon,
  OpenEyeIcon,
  SportEazeLogo,
} from '../../../../assets/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTextColor} from '../../../../utils/customHooks/colorHooks';
import {appColors} from '../../../../constants/colors';
import PageContainer from '../../../../components/PageContainer';
import GeneralHeader from '../../../../components/GeneralHeader';
import {useAppNavigation} from '../../../../utils/customHooks/navigator';
import {JoinAsPage} from '../JoinAs';
import {BUTTON_BORDER_RADIUS} from '../../../../constants/styles';
import {LoginPage} from '../Login';
import {RootStackParamList} from '../../Navigator/AppNavigator/AppNavigator';
import {RouteProp, useRoute} from '@react-navigation/native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export const Register = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  const {isLoggedIn, user} = useAppSelector(state => state.auth);

  const [registerUser, {isLoading: registerUserCIP, isError, error}] =
    useRegisterUserMutation();
  const [loginUser, {isLoading: loginUserCIP}] = useLoginUserMutation();

  const [isLogin, setIsLogin] = useState(true);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const textColor = useTextColor();

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: 'jazeb.player.back@gmail.com',
      password: 'SecurePassword!123',
    },
  });
  const onSubmit = async (data: {email: string; password: string}) => {
    try {
      if (isLogin) {
        const res = await loginUser({
          email: data.email,
          password: data.password,
        }).unwrap();

        console.log('res - after login ', user);
      } else {
        await registerUser({
          email: data.email,
          password: data.password,
        }).unwrap();

        navigation.reset({
          index: 0,
          routes: [{name: JoinAsPage}],
        });
      }
    } catch (e) {
      console.log(
        '-------xxxxxx----------Error while registering/Loggin-in User : Register.tsx',
        e,
      );
    }
  };
  return (
    <PageContainer applyGradient>
      <GeneralHeader
        title={isLogin ? 'Login' : 'Register'}
        showRightElement={false}
      />

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps='handled'>
        <View style={styles.container}>
          <View style={{alignItems: 'center', marginTop: 32}}>
            <SportEazeLogo color={textColor} width={150} height={150} />
          </View>

          <Text
            style={{
              color: appColors.warmRed,
              fontSize: 20,
              marginTop: 32,
              textDecorationLine: 'underline',
              marginBottom: 32,
              textAlign: 'center',
            }}>
            {isLogin ? 'Welcome Back' : 'Create new account'}
          </Text>

          {/* Email Wrapper */}
          <View style={{marginBottom: 26}}>
            <Controller
              name='email'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Email is required',
                },
                pattern: {
                  value: validEmailRegex,
                  message: 'Enter a valid email address',
                },
                maxLength: {
                  value: 100,
                  message: 'Email cannot exceed 100 characters',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  label='Email Address'
                  placeholder='Enter your email'
                  value={value}
                  onChangeText={val => {
                    onChange(val.trim());
                  }}
                  isValid={errors.email ? false : true}
                  errorMessage={errors.email ? errors.email.message : ''}
                  autoCapitalize='none'
                />
              )}
            />
          </View>

          {/* Password Wrapper */}
          <View style={{marginBottom: 40}}>
            <Controller
              name='password'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Password is required',
                },
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
                pattern: {
                  value: validPasswordRegex,
                  message:
                    'Password must contain at least one uppercase letter and one special character.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  label='Password'
                  placeholder='Enter your password'
                  value={value}
                  onChangeText={onChange}
                  isValid={errors.password ? false : true}
                  errorMessage={errors.password ? errors.password.message : ''}
                  autoCapitalize='none'
                  isSecure={!isPasswordVisible}
                  rightElement={
                    <TouchableOpacity
                      hitSlop={20}
                      activeOpacity={0.5}
                      style={{paddingHorizontal: 16}}
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                      {isPasswordVisible ? (
                        <OpenEyeIcon color={textColor} />
                      ) : (
                        <CloseEyeIcon color={textColor} />
                      )}
                    </TouchableOpacity>
                  }
                />
              )}
            />
          </View>

          <Button
            style={{
              height: 48,
              borderRadius: BUTTON_BORDER_RADIUS,
              marginBottom: 20,
            }}
            onPress={handleSubmit(onSubmit)}
            isLoading={registerUserCIP || loginUserCIP}>
            {isLogin ? 'Login' : 'Register'}
          </Button>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              marginTop: 'auto',
              justifyContent: 'center',
              marginBottom: 12,
            }}>
            <Text style={{color: textColor}}>
              {isLogin ? 'Dont have an account ?' : 'Already have an account ?'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                backgroundColor: appColors.warmRed,
                borderRadius: 10,
                paddingVertical: 4,
                paddingHorizontal: 16,
              }}
              onPress={() => {
                setIsLogin(!isLogin);
              }}>
              <Text
                style={{
                  color: appColors.white,
                  // textDecorationLine: 'underline',
                  fontSize: 14,
                }}>
                {isLogin ? 'Register' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
  label: {
    color: 'white',
    margin: 20,
    marginLeft: 0,
  },
});
