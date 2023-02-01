import React, { useState } from 'react';
import {
  Stack,
  IconButton,
  Text,
  useTheme,
  Pressable,
  Center,
  useToast,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  ChartAccountType,
  IChartAccount,
} from '../../../core/graphQL/cache/chartOfAccounts/types';
import { remove } from '../../../core/graphQL/cache/chartOfAccounts';
import Alert from '../../../components/Alert';

interface ChartAccountsItemProps {
  item: IChartAccount;
  onRemoveCompleted: () => void;
}

export default function ChartAccountsItem({
  item,
  onRemoveCompleted,
}: ChartAccountsItemProps): JSX.Element {
  const navigation = useNavigation();
  const theme = useTheme();
  const [isRemoving, setRemoving] = useState(false);
  const [isConfirmationOpened, setConfirmationOpened] = useState(false);
  const toast = useToast();
  const onRemove = async () => {
    if (isRemoving) {
      return;
    }
    setRemoving(true);
    try {
      await remove(item.id);
      toast.show({
        status: 'success',
        title: 'Item removido com sucesso',
        duration: 2000,
      });
    } catch (e) {
      toast.show({
        status: 'error',
        title: 'Problemas ao remover o item',
        duration: 2000,
      });
    } finally {
      setRemoving(false);
      onRemoveCompleted();
      setConfirmationOpened(false);
    }
  };

  const toggleConfirmation = (val?: boolean) =>
    setConfirmationOpened((x) => (typeof val !== 'undefined' ? val : !x));

  return (
    <>
      {isConfirmationOpened && (
        <Alert
          onConfirmation={onRemove}
          isOpen={isConfirmationOpened}
          toggle={toggleConfirmation}
          title={
            <Center>
              <Feather
                size={36}
                name="trash"
                color={theme.colors.custom.danger}
              />
            </Center>
          }
          message={
            <Center>
              <Text>
                Deseja excluir a conta{' '}
                <Text bold>{`${item.code} - ${item.name}`}</Text>?
              </Text>
            </Center>
          }
        />
      )}
      <Pressable
        px={5}
        onPress={() => navigation.navigate('ChartAccounts.put', { id: item.id })}
      >
        <Stack
          direction="row"
          p={4}
          mb={3}
          alignItems="center"
          justifyContent="space-between"
          bg={theme.colors.custom.white}
          borderRadius={16}
        >
          <Text
            color={
              item.type === ChartAccountType.receita
                ? theme.colors.custom.success
                : theme.colors.custom.warning
            }
          >{`${item.code} - ${item.name}`}</Text>
          <IconButton
            variant="ghost"
            onPress={() => toggleConfirmation(true)}
            icon={
              <Feather
                size={20}
                color={theme.colors.custom.muted}
                name="trash"
              />
            }
          />
        </Stack>
      </Pressable>
    </>
  );
}
