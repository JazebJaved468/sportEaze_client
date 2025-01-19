import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from 'native-base';
import {useRegisterFanMutation} from '../../../../store/auth/auth.service';
import {useAppDispatch} from '../../../../utils/customHooks/storeHooks';

export const Register = () => {
  const [registerFan, {isLoading, isError, error}] = useRegisterFanMutation();
  const dispatch = useAppDispatch();
  console.log('isLoading', isLoading);
  console.log('isError', JSON.stringify(error));
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: 'jazeb.player@gmail.com',
      password: 'Click123!',
    },
  });
  const onSubmit = async (data: {email: string; password: string}) => {
    try {
      await registerFan({
        email: data.email,
        password: data.password,
      }).unwrap();
    } catch (e) {
      console.log(
        '-------xxxxxx----------Error while registering Fan : Register.tsx',
        e,
      );
    }
  };

  console.log(errors);
  return (
    <View>
      <Text>Register</Text>

      <Text style={styles.label}>First name</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name='email'
        rules={{required: true}}
      />

      <Text style={styles.label}>Last name</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name='password'
        rules={{
          required: {
            value: true,
            message: 'This is required',
          },
        }}
      />

      <Button onPress={handleSubmit(onSubmit)}>Register</Button>
    </View>
  );
};

const styles = StyleSheet.create({
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
