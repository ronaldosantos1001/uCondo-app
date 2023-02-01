import { InMemoryCache } from '@apollo/client';
import chartAccounts from './chartOfAccounts';
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        ...chartAccounts,
      },
    },
  },
});

export default cache;
