import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import React, {ReactNode} from 'react';
import {border} from 'native-base/lib/typescript/theme/styled-system';
import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';

type CustomTextInputFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  height?: number;
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
  errorMessage,
  label,
  customLabelStyles,
  autoCapitalize = 'sentences',
  height = 50,
  numberOfLines = 1,
  borderRadius = 12,
  borderWidth = 1,
  onFocus,
  maxLength,
}: CustomTextInputFieldProps) => {
  const inputborderColor = useColorModeValue(appColors.gray, appColors.gray);
  const textColor = useColorModeValue(appColors.black, appColors.white);

  return (
    <View>
      {label ? (
        <View>
          <Text
            style={[
              {
                fontSize: 14,
                color: !isValid ? appColors.error : textColor,
                marginBottom: 8,
                fontWeight: 'bold',
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
          height: height,
          borderWidth: borderWidth,
          paddingHorizontal: 6,
          borderColor: !isValid
            ? appColors.error
            : (borderColor ?? inputborderColor),
          borderRadius: borderRadius,
          backgroundColor: backgroundColor ?? appColors.transparent,
        }}>
        <TextInput
          onFocus={onFocus}
          style={{
            flex: 1,
            color: textColor,
            textAlignVertical: 'center',
          }}
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
        />

        <View
          style={{
            height: height - 1,

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {rightElement}
        </View>
      </View>

      {!isValid ? (
        <Text
          style={{paddingVertical: 4, fontSize: 10, color: appColors.error}}>
          {errorMessage}
        </Text>
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
