import React, { useState } from 'react';
import { Stack, FlatList, Box, Text, useTheme } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { gql, useQuery } from '@apollo/client';
import { useForm, FormProvider } from 'react-hook-form';
import { IChartAccount } from '../../../core/graphQL/cache/chartOfAccounts/types';
import useDebounce from '../../../core/hooks/debounce';
import { SearchInput } from './styles';
import ChartAccountsItem from './ChartAccountsItem';

export default function ChartAccountsList(): JSX.Element {
  const debouncer = useDebounce();
  const [search, setSearch] = useState('');
  const theme = useTheme();
  const { data, loading, refetch } = useQuery<{
    chartAccounts: IChartAccount[];
  }>(
    gql`
      query Q($search: String) {
        chartAccounts(search: $search) @client {
          id
          name
          code
          type
        }
      }
    `,
    {
      variables: {
        search,
      },
    },
  );
  const methods = useForm({ defaultValues: { search: '' } });

  return (
    <Stack flex={1}>
      <FormProvider {...methods}>
        <Box
          bg={theme.colors.custom.primary}
          p={5}
          border={0}
          paddingBottom={20}
        >
          <Box
            bg={theme.colors.custom.white}
            border={0}
            borderRadius={100}
            overflow="hidden"
          >
            <SearchInput
              name="search"
              placeholder="Pesquisar conta"
              InputLeftElement={
                <Feather
                  name="search"
                  size={26}
                  style={{
                    backgroundColor: theme.colors.custom.white,
                    padding: 20,
                    color: theme.colors.custom.muted,
                  }}
                />
              }
              onChangeText={(e) => debouncer(() => setSearch(e))}
            />
          </Box>
        </Box>
      </FormProvider>
      <Box
        borderTopRadius={30}
        marginTop={-10}
        bg={theme.colors.custom.secondary}
        flex={1}
      >
        <FlatList
          data={data?.chartAccounts}
          refreshing={loading}
          onRefresh={refetch}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChartAccountsItem
              item={item}
              onRemoveCompleted={() => refetch()}
            />
          )}
          ListHeaderComponent={() => (
            <Stack p={5} direction="row" justifyContent="space-between">
              <Text fontSize={'lg'}>Listagem</Text>
              <Text color={theme.colors.custom.muted}>
                {data?.chartAccounts.length} registro(s)
              </Text>
            </Stack>
          )}
          ListEmptyComponent={() => (
            <Box p={5}>
              <Text color={theme.colors.custom.muted}>Sem itens</Text>
            </Box>
          )}
        />
      </Box>
    </Stack>
  );
}
