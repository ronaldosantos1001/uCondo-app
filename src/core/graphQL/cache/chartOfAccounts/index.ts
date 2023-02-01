import { FieldPolicy, makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 } from 'uuid';
import { IChartAccount, ChartAccountType } from './types';

const STORAGE_KEY = 'chartOfAccounts';

export const chartAccounts = makeVar<IChartAccount[]>([]);

export default {
  chartAccounts: {
    read: (_, { variables }) => {
      let values = chartAccounts();

      if (typeof variables?.acceptRelease !== 'undefined') {
        values = values.filter(
          (x) => x.acceptRelease === variables.acceptRelease,
        );
      }

      if (variables?.search?.length) {
        values = values.filter(
          (x) =>
            x.code.startsWith(variables.search) ||
            x.name.startsWith(variables.search),
        );
      }

      values.sort(sortByCode);

      return values;
    },
  },
  chartAccount: {
    read: (_, { variables }) => {
      return chartAccounts().find((x) => x.id === variables?.id);
    },
  },
} as {
  chartAccounts: FieldPolicy<IChartAccount[]>;
  chartAccount: FieldPolicy<IChartAccount>;
};

export class ChartAccount implements IChartAccount {
  id: string;
  parentId?: string;
  code: string;
  name: string;
  type: ChartAccountType;
  acceptRelease: boolean;
  __typename: string;

  constructor(data: IChartAccount) {
    this.id = data.id ?? v4();
    this.parentId = data.parentId;
    this.code = data.code;
    this.name = data.name;
    this.type = data.type;
    this.acceptRelease = data.acceptRelease;
    this.__typename = ChartAccount.name;
    this.validate();
  }

  validate() {

    const code = this.code.substring(this.code.lastIndexOf('.') + 1);
    if (Number(code) > 999) {
      throw new Error('Código inválido');
    }

    const stored = chartAccounts();
    if (stored.some((x) => x.code === this.code)) {
      throw new Error('Código já cadastrado');
    }

    if (this.parentId) {
      const parent = stored.find((x) => x.id === this.parentId);

      if (parent?.acceptRelease) {
        throw new Error('A conta que aceita lançamentos não pode ter filhas');
      }

      if (parent?.type !== this.type) {
        throw new Error('Tipo de conta divergente da conta Pai');
      }
    }
  }

  static nextValidCode(parentId: string) {
    const stored = chartAccounts()
      .filter((x) => x.parentId === parentId)
      .sort(sortByCode);

    if (stored.length) {
      const lastCode = stored[stored.length - 1].code;
      const splitted = lastCode.split('.');
      const lastPart = Number(splitted[splitted.length - 1]);

      if (lastPart >= 999) {
        throw new Error('Código indisponível para a conta pai informada');
      }

      splitted[splitted.length - 1] = `${lastPart + 1}`;
      return splitted.join('.');
    }
    const parent = chartAccounts().find((x) => x.id === parentId);
    return `${parent?.code}.1`;
  }
}

const flush = () =>
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chartAccounts()));

export const add = async (value: Partial<IChartAccount>) => {
  const newValue = [
    ...chartAccounts(),
    new ChartAccount(value as IChartAccount),
  ];
  chartAccounts(newValue);
  await flush();
  return newValue;
};

const _delete = (id: string) => {
  const storedIndex = chartAccounts().findIndex((x) => x.id === id);

  if (storedIndex < 0) {
    return;
  }
  const list = chartAccounts();

  const [removed] = list.splice(storedIndex, 1);
  chartAccounts(list);

  const children = list.filter((x) => x.parentId === removed.id);

  children.forEach((child) => _delete(child.id));
};

export const remove = async (id: string) => {
  _delete(id);
  await flush();
};

const sortByCode = (a: IChartAccount, b: IChartAccount) => {
  if (a.code < b.code) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  return 0;
};

(async () => {

  const stored = await AsyncStorage.getItem(STORAGE_KEY);

  if (!stored?.length) {
    return;
  }

  chartAccounts(JSON.parse(stored));
})();
