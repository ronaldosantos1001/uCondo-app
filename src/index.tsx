import React from 'react';
import { NativeBaseProvider, Flex } from 'native-base';
import { ApolloProvider } from '@apollo/client';

import Navigator from './screens';
import apollo from './core/graphQL';
import theme from './core/theme';

export default function Client() {
  return (
    <NativeBaseProvider theme={theme}>
      <ApolloProvider client={apollo}>
        <Navigator />
      </ApolloProvider>
    </NativeBaseProvider>
  );
}
