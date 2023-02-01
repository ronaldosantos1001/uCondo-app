export enum ChartAccountType {
  receita = 'receita',
  despesa = 'despesa',
}

export interface IChartAccount {
  id: string;
  parentId?: string;
  code: string;
  name: string;
  type: ChartAccountType;
  acceptRelease: boolean;
}
