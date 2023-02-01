import React from 'react';
import {
  Stack,
  FormControl,
  ScrollView,
  IconButton,
  useToast,
  useTheme,
  Box,
} from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { gql, useQuery } from '@apollo/client';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import Label from '../../../components/Label';
import {
  IChartAccount,
  ChartAccountType,
} from '../../../core/graphQL/cache/chartOfAccounts/types';
import {
  add,
  ChartAccount,
  chartAccounts,
} from '../../../core/graphQL/cache/chartOfAccounts';
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = RouteProp<
  { 'ChartAccounts.put': { id?: string } },
  'ChartAccounts.put'
>;

export default function ChartAccountsPut(): JSX.Element {
  const navigation = useNavigation();
  const toast = useToast();
  const route = useRoute<ProfileScreenNavigationProp>();
  const theme = useTheme();
  const methods = useForm<IChartAccount>({
    shouldUnregister: false,
    defaultValues: {
      type: ChartAccountType.receita,
      acceptRelease: true,
      parentId: '',
      code: '',
      name: '',
    },
  });
  const { handleSubmit, formState, setValue, reset } = methods;
  const { errors } = formState;
  const isInputDisabled = !!route.params?.id;

  const { data } = useQuery<{
    chartAccounts: IChartAccount[];
    chartAccount?: IChartAccount;
  }>(
    gql`
      query Q($acceptRelease: Boolean, $id: ID, $isEdit: Boolean!) {
        chartAccounts(acceptRelease: $acceptRelease) @client {
          id
          code
          name
        }
        chartAccount(id: $id) @client @include(if: $isEdit) {
          name
          code
          parentId
          type
          acceptRelease
        }
      }
    `,
    {
      variables: {
        acceptRelease: false,
        id: route.params?.id,
        isEdit: !!route.params?.id,
      },
      onCompleted: ({ chartAccount }) => {
        if (chartAccount) {
          reset(chartAccount);
        }
      },
    },
  );

  const submit = handleSubmit(
    async ({ name, parentId, code, acceptRelease, type }) => {
      try {
        await add({
          name,
          parentId,
          code,
          type,
          acceptRelease: `${acceptRelease}` === 'true',
        });
        toast.show({
          status: 'success',
          title: 'Plano de Conta cadastrado com sucesso',
          duration: 2000,
        });
        navigation.navigate('ChartAccounts.list');
      } catch (e) {
        toast.show({
          status: 'error',
          title: e.message,
          duration: 2000,
        });
      }
    },
  );

  const onChangeParent = (parentId: string) => {
    try {
      const nextCode = ChartAccount.nextValidCode(parentId);
      reset({
        ...methods.getValues(),
        code: nextCode,
      });
    } catch (e) {
      const parent = chartAccounts().find((x) => x.id === parentId);

      if (!parent?.parentId) {
        return;
      }

      const grandParent = chartAccounts().find((x) => x.id === parent.parentId);
      if (!grandParent) {
        return;
      }

      setValue('parentId', grandParent?.id);
      onChangeParent(grandParent?.id);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight() {
        return (
          <IconButton
            mr={2}
            onPress={submit}
            isDisabled={isInputDisabled}
            icon={
              <Feather
                name="check"
                size={26}
                color={theme.colors.custom.white}
              />
            }
          />
        );
      },
    });
  }, [navigation, isInputDisabled]);

  return (
    <>
      <Box h={10} bgColor={theme.colors.custom.primary} />
      <ScrollView
        bgColor={theme.colors.custom.secondary}
        marginTop={-10}
        borderRadius={30}
      >
        <Stack p={10} borderRadius={10}>
          <FormProvider {...methods}>
            <Stack space={2}>
              <FormControl isDisabled={isInputDisabled}>
                <Select
                  label="Conta pai"
                  name="parentId"
                  onValueChange={onChangeParent}
                  placeholder="Selecione a conta pai"
                  options={
                    data?.chartAccounts.map((x) => ({
                      label: `${x.code} - ${x.name}`,
                      value: x.id,
                    })) ?? []
                  }
                />
              </FormControl>
              <FormControl
                isDisabled={isInputDisabled}
                isInvalid={'code' in errors}
              >
                <Input
                  isRequired
                  label="Código"
                  name="code"
                  keyboardType="numbers-and-punctuation"
                  placeholder="Digite o código"
                />
              </FormControl>
              <FormControl
                isDisabled={isInputDisabled}
                isInvalid={'name' in errors}
              >
                <Input
                  isRequired
                  name="name"
                  label="Nome"
                  placeholder="Digite o nome"
                />
              </FormControl>
              <FormControl
                isDisabled={isInputDisabled}
                isInvalid={'type' in errors}
              >
                <Select
                  isRequired
                  name="type"
                  label="Tipo"
                  options={[
                    { label: 'Receita', value: ChartAccountType.receita },
                    { label: 'Despesa', value: ChartAccountType.despesa },
                  ]}
                />
              </FormControl>
              <FormControl isDisabled={isInputDisabled}>
                <Select
                  name="acceptRelease"
                  label="Aceita lançamentos"
                  options={[
                    { label: 'Sim', value: true },
                    { label: 'Não', value: false },
                  ]}
                />
              </FormControl>
            </Stack>
          </FormProvider>
        </Stack>
      </ScrollView>
    </>
  );
}
