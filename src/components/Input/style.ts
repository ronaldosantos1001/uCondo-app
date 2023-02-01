import styled from 'styled-components/native';
import { Input } from 'native-base';

export default styled(Input)`
  height: 50px;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.custom.white};
  padding: 10px;
`;
