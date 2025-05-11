import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../Core/Navigator/AppNavigator/AppNavigator';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {CustomTextInputField} from '../../../components/CustomInputField';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {PulseEffect} from '../../../components/PulseEffect';
import {Button, Divider} from 'native-base';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {appColors} from '../../../constants/colors';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {ArrowRightIcon, MilestoneIcon} from '../../../assets/icons';
import {
  useCreateContractMutation,
  useGetContractByIdQuery,
  useUpdateContractMutation,
} from '../../../store/patron/patron.service';
import {CreateContractParams} from '../../../types/patron/patron.params';
import {ContractStatus} from '../../../constants/enums';
import {useAppDispatch} from '../../../utils/customHooks/storeHooks';
import {updateToast} from '../../../store/core/core.slice';
import {divideAmountIntoThreeMilestones} from '../../../utils/helpers/contract.utils';
import {ContractMilestone} from '../../../types/patron/patron.type';

export type CreateContractPageRouteProp = RouteProp<
  RootStackParamList,
  'CreateContractPage'
>;

const CreateContract = () => {
  const {params} = useRoute<CreateContractPageRouteProp>();
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const [createContract, {isLoading: createContractCIP}] =
    useCreateContractMutation();
  const [updateContract, {isLoading: updateContractCIP}] =
    useUpdateContractMutation();

  const {data: contractData} = useGetContractByIdQuery(
    {
      contractId: params.contractId ?? '',
    },
    {skip: !params.contractId},
  );

  const {
    handleSubmit,
    control,
    formState: {errors},
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      contract_description: contractData?.description ?? '',
      contract_amount: contractData?.totalAmount.toString() ?? '',
      milestones: [
        {
          description: contractData?.milestones[0]?.description ?? '',
          amount: contractData?.milestones[0]?.amount.toString() ?? '',
        },
        {
          description: contractData?.milestones[1]?.description ?? '',
          amount: contractData?.milestones[1]?.amount.toString() ?? '',
        },
        {
          description: contractData?.milestones[2]?.description ?? '',
          amount: contractData?.milestones[2]?.amount.toString() ?? '',
        },
      ],
    },
  });

  const {fields, append, prepend, remove, swap, move, insert, replace} =
    useFieldArray({
      control,
      name: 'milestones',
    });

  const onSubmit = async (data: any) => {
    console.log('data', data);

    if (Number(data.contract_amount) <= 0) {
      dispatch(
        updateToast({
          message: 'Kindly enter valid contract amount',
          isVisible: true,
        }),
      );
      return;
    }

    if (
      Number(data.milestones[0].amount) +
        Number(data.milestones[1].amount) +
        Number(data.milestones[2].amount) !==
      Number(data.contract_amount)
    ) {
      dispatch(
        updateToast({
          message:
            'Total amount of all milestones should be equal to contract amount',
          isVisible: true,
        }),
      );
      return;
    }

    try {
      if (params.isEditing && params.contractId) {
        const apiData: CreateContractParams = {
          description: data.contract_description,
          totalAmount: Number(data.contract_amount),
          endDate: '2027-05-11',
          status: ContractStatus.PENDING,
          playerId: params.playerId,
          milestones: data.milestones.map(
            (milestone: ContractMilestone, index: number) => ({
              id: contractData?.milestones[index].id,
              description: milestone.description,
              amount: Number(milestone.amount),
            }),
          ),
        };

        console.log('apiData', apiData);
        await updateContract({
          contractId: params.contractId,
          ...apiData,
        }).unwrap();
      } else {
        const apiData: CreateContractParams = {
          description: data.contract_description,
          totalAmount: Number(data.contract_amount),
          endDate: '2027-05-11',
          status: ContractStatus.PENDING,
          playerId: params.playerId,
          milestones: data.milestones.map((milestone: any) => ({
            description: milestone.description,
            amount: Number(milestone.amount),
          })),
        };
        await createContract(apiData).unwrap();
      }

      navigation.goBack();
    } catch (err) {
      console.log('Error while creating contract', err);
    }
  };

  return (
    <PageContainer>
      <GeneralHeader
        title={params.isEditing ? 'Updating Contract' : 'New Contract'}
        showRightElement
        rightElement={
          <View>
            <PulseEffect>
              <Button
                isLoading={createContractCIP || updateContractCIP}
                onPress={() => {
                  handleSubmit(onSubmit)();
                }}
                style={{
                  backgroundColor: appColors.warmRed,
                  borderRadius: 12,
                  width: customWidth(params.isEditing ? 104 : 74),
                  height: customHeight(30),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: customWidth(6),
                  }}>
                  <Text style={[fontRegular(13, appColors.white)]}>
                    {params.isEditing ? 'Save & Send' : 'Send'}
                  </Text>
                  <ArrowRightIcon
                    width={12}
                    height={12}
                    color={appColors.white}
                  />
                </View>
              </Button>
            </PulseEffect>
          </View>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.container}>
        {/* details */}
        <View style={{marginBottom: 26}}>
          <Controller
            name='contract_description'
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Kindly enter contract details',
              },
              maxLength: {
                value: 500,
                message: 'Contract cannot exceed 2000 characters',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomTextInputField
                label='Contract Details'
                placeholder='Enter about contract'
                value={value}
                maxLength={2001}
                numberOfLines={5}
                onChangeText={onChange}
                autoCapitalize='sentences'
                height={'auto'}
                textAlignVertical='top'
                isValid={errors.contract_description ? false : true}
                errorMessage={
                  errors.contract_description
                    ? errors.contract_description.message
                    : ''
                }
              />
            )}
          />
        </View>

        {/* amount */}
        <View style={{marginBottom: 26}}>
          <Controller
            name='contract_amount'
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Kindly enter contract amount',
              },
              maxLength: {
                value: 6,
                message: 'Amount cannot exceed 6 digits',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomTextInputField
                label='Contract Amount (Rs.)'
                placeholder='Enter contract amount'
                value={value}
                maxLength={6}
                keyboardType='numeric'
                onChangeText={text => {
                  const numericValue = text.replace(/[^0-9]/g, '');
                  onChange(numericValue);

                  const [milestone1, milestone2, milestone3] =
                    divideAmountIntoThreeMilestones(Number(numericValue));
                  setValue('milestones.0.amount', milestone1.toString());
                  setValue('milestones.1.amount', milestone2.toString());
                  setValue('milestones.2.amount', milestone3.toString());
                }}
                isValid={errors.contract_amount ? false : true}
                errorMessage={
                  errors.contract_amount ? errors.contract_amount.message : ''
                }
              />
            )}
          />
        </View>

        <MileStoneMarker order='1st' />

        {/* milestone */}
        <View style={{marginBottom: 26, marginHorizontal: 10}}>
          <View style={{marginBottom: 20}}>
            <Controller
              name='milestones.0.description'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Kindly enter milestone details',
                },
                maxLength: {
                  value: 800,
                  message: 'It cannot exceed 800 characters',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  label='Details'
                  placeholder='Enter about Milestone you want player to achieve'
                  value={value}
                  maxLength={801}
                  onChangeText={onChange}
                  isValid={
                    errors.milestones?.[0]?.description?.message ? false : true
                  }
                  errorMessage={
                    errors.milestones?.[0]?.description?.message
                      ? errors.milestones?.[0]?.description?.message
                      : ''
                  }
                />
              )}
            />
          </View>

          <View>
            <Controller
              name='milestones.0.amount'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Kindly enter milestone amount',
                },
                maxLength: {
                  value: 6,
                  message: 'Amount cannot exceed 6 digits',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  label='Amount (Rs.)'
                  placeholder='Amount'
                  value={value}
                  maxLength={6}
                  keyboardType='numeric'
                  onChangeText={text => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    onChange(numericValue);
                  }}
                  isValid={
                    errors.milestones?.[0]?.amount?.message ? false : true
                  }
                  errorMessage={
                    errors.milestones?.[0]?.amount?.message
                      ? errors.milestones?.[0]?.amount?.message
                      : ''
                  }
                />
              )}
            />
          </View>
        </View>

        {/* 2nd milestone */}

        <MileStoneMarker order='2nd' />

        {/* milestone */}
        <View style={{marginBottom: 26, marginHorizontal: 10}}>
          <View style={{marginBottom: 20}}>
            <Controller
              name='milestones.1.description'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Kindly enter milestone details',
                },
                maxLength: {
                  value: 800,
                  message: 'It cannot exceed 800 characters',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  label='Details'
                  placeholder='Enter about Milestone you want player to achieve'
                  value={value}
                  maxLength={801}
                  onChangeText={onChange}
                  isValid={
                    errors.milestones?.[1]?.description?.message ? false : true
                  }
                  errorMessage={
                    errors.milestones?.[1]?.description?.message
                      ? errors.milestones?.[1]?.description?.message
                      : ''
                  }
                />
              )}
            />
          </View>

          <View>
            <Controller
              name='milestones.1.amount'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Kindly enter milestone amount',
                },
                maxLength: {
                  value: 6,
                  message: 'Amount cannot exceed 6 digits',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  label='Amount (Rs.)'
                  placeholder='Amount'
                  value={value}
                  maxLength={6}
                  keyboardType='numeric'
                  onChangeText={text => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    onChange(numericValue);
                  }}
                  isValid={
                    errors.milestones?.[1]?.amount?.message ? false : true
                  }
                  errorMessage={
                    errors.milestones?.[1]?.amount?.message
                      ? errors.milestones?.[1]?.amount?.message
                      : ''
                  }
                />
              )}
            />
          </View>
        </View>

        {/* 3rd milestone */}

        <MileStoneMarker order='3rd' />

        {/* milestone */}
        <View style={{marginBottom: 26, marginHorizontal: 10}}>
          <View style={{marginBottom: 20}}>
            <Controller
              name='milestones.2.description'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Kindly enter milestone details',
                },
                maxLength: {
                  value: 800,
                  message: 'It cannot exceed 800 characters',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  label='Details'
                  placeholder='Enter about Milestone you want player to achieve'
                  value={value}
                  maxLength={801}
                  onChangeText={onChange}
                  isValid={
                    errors.milestones?.[2]?.description?.message ? false : true
                  }
                  errorMessage={
                    errors.milestones?.[2]?.description?.message
                      ? errors.milestones?.[2]?.description?.message
                      : ''
                  }
                />
              )}
            />
          </View>

          <View>
            <Controller
              name='milestones.2.amount'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Kindly enter milestone amount',
                },
                maxLength: {
                  value: 6,
                  message: 'Amount cannot exceed 6 digits',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInputField
                  label='Amount (Rs.)'
                  placeholder='Amount'
                  value={value}
                  maxLength={6}
                  keyboardType='numeric'
                  onChangeText={text => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    onChange(numericValue);
                  }}
                  isValid={
                    errors.milestones?.[2]?.amount?.message ? false : true
                  }
                  errorMessage={
                    errors.milestones?.[2]?.amount?.message
                      ? errors.milestones?.[2]?.amount?.message
                      : ''
                  }
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const MileStoneMarker = ({order}: {order: string}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: customHeight(16),
      }}>
      <Text
        style={[
          [fontBold(13, appColors.warmRed), {marginRight: customWidth(8)}],
        ]}>
        {`${order} Milestone`}
      </Text>
      <View
        style={{
          borderTopWidth: 1,
          borderStyle: 'dashed',
          borderColor: appColors.warmRed,
          flex: 1,
        }}></View>
      <MilestoneIcon color={appColors.warmRed} />
    </View>
  );
};

export default CreateContract;

const styles = StyleSheet.create({
  container: {
    paddingVertical: customHeight(10),
    paddingHorizontal: customWidth(20),
  },
});
