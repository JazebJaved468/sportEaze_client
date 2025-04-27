import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import React, {ReactNode} from 'react';
import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';
import {fontBold, fontRegular} from '../../styles/fonts';
import {ErrorMessage} from '../ErrorMessage';

type CustomTextInputFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  height?: number | 'auto';
  width?: number;
  placeholder?: string;

  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  style?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  autoFocus?: boolean;
  placeholderTextColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'right' | 'center';
  textAlignVertical?: 'top' | 'center' | 'bottom';
  isSecure?: boolean;
  isReadOnly?: boolean;
  rightElement?: ReactNode;
  isValid?: boolean;
  errorMessage?: string;
  label?: string;
  customLabelStyles?: StyleProp<TextStyle>;
  onFocus?: () => void;
  customTextInputStyles?: StyleProp<TextStyle>;
};

export const CustomTextInputField = ({
  onChangeText,
  value,
  borderColor,
  backgroundColor,
  placeholder = 'Enter text',
  placeholderTextColor,
  isSecure = false,
  isReadOnly = false,
  rightElement,
  isValid = true,
  errorMessage = '',
  label,
  customLabelStyles,
  autoCapitalize = 'sentences',
  height = 50,
  numberOfLines = 1,
  borderRadius = 12,
  borderWidth = 0.5,
  onFocus,
  maxLength,
  textAlignVertical = 'center',
  customTextInputStyles = {},
}: CustomTextInputFieldProps) => {
  const inputborderColor = useColorModeValue(appColors.gray, appColors.gray);
  const textColor = useColorModeValue(appColors.black, appColors.white);

  return (
    <View>
      {label ? (
        <View>
          <Text
            style={[
              fontBold(14, textColor),
              {
                marginBottom: 8,
              },
              customLabelStyles,
            ]}>
            {label}
          </Text>
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          ...(height === 'auto' ? {} : {height: height}),
          // height: height === 'auto' ? undefined : height,
          borderWidth: borderWidth,
          paddingHorizontal: 6,
          borderColor: !isValid
            ? appColors.error
            : (borderColor ?? inputborderColor),
          borderRadius: borderRadius,
          backgroundColor: isReadOnly
            ? `${textColor}10`
            : (backgroundColor ?? appColors.transparent),
        }}>
        <TextInput
          onFocus={onFocus}
          style={[
            {
              flex: 1,
              ...fontRegular(14, isReadOnly ? `${textColor}70` : textColor),
              textAlignVertical: 'center',
              // padding: 0,
            },
            customTextInputStyles,
          ]}
          onChangeText={onChangeText}
          value={value}
          numberOfLines={numberOfLines}
          multiline={numberOfLines > 1}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor ?? appColors.placeHolder}
          secureTextEntry={isSecure}
          readOnly={isReadOnly}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          textAlignVertical={textAlignVertical}
        />

        <View
          style={{
            // height: height - 1,
            paddingTop: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {rightElement}
        </View>
      </View>

      {!isValid && errorMessage ? (
        <ErrorMessage message={errorMessage} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 0,
  },
});
