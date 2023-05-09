import styled, { useTheme } from 'styled-components/native';
import { Select } from 'native-base';

export default styled(Select)`
  height: 50px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.custom.white};
  padding: 10px;
`;
