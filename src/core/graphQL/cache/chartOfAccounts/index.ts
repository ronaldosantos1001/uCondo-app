
import { FieldPolicy, makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 } from 'uuid';
import { IChartAccount, ChartAccountType } from './types';

const STORAGE_KEY = 'chartOfAccounts';

export const chartAccounts = makeVar<IChartAccount[]>([]);

function filterChartAccounts(chartAccounts: IChartAccount[], variables: any) {
  let values = [...chartAccounts];

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
}

export default {
  chartAccounts: {
    read: (_, { variables }) => {
      const values = filterChartAccounts(chartAccounts(), variables);
      return values;
    },
  },
  chartAccount: {
    read: (_, { variables }) => {
      const chartAccount = chartAccounts().find((x) => x.id === variables?.id);
      return chartAccount;
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

  validate(): void {
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

  static nextValidCode(parentId: string): string {
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

const flush = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chartAccounts()));
  } catch (error) {
    throw new Error('Erro ao gravar contas');
  }
};

export const add = async (value: Partial<IChartAccount>) => {
  const newValue = new ChartAccount(value as IChartAccount);
  const stored = chartAccounts();
  
  if (stored.some((x) => x.code === newValue.code)) {
    throw new Error('Código já cadastrado');
  }

  stored.push(newValue);
  chartAccounts(stored);
  await flush();
  
  return stored;
};


const deleteChartAccount = (id: string, list: IChartAccount[]): void => {
  const accountIndex = list.findIndex((account) => account.id === id);
  if (accountIndex < 0) return;

  const [removed] = list.splice(accountIndex, 1);

  const children = list.filter((account) => account.parentId === removed.id);
  children.forEach((child) => deleteChartAccount(child.id, list));
};

export const remove = async (id: string): Promise<void> => {
  const list = chartAccounts();
  deleteChartAccount(id, list);
  chartAccounts(list);
  await flush();
};


const sortByCode = (a: IChartAccount, b: IChartAccount) => a.code.localeCompare(b.code);

(async () => {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    chartAccounts(JSON.parse(stored));
  }
})();
