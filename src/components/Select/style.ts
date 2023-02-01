import styled from 'styled-components/native';
import { Select } from 'native-base';

export default styled(Select)`
  height: 50px;
  border-radius: 10px;
  border-width: 0;
  background: ${(props) => props.theme.colors.custom.white};
  padding: 10px;
`;
