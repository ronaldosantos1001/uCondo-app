import styled from 'styled-components/native';
import { Input } from 'native-base';

const CustomInput = styled(Input)`
  height: 50px;
  border-radius: 10px;
  background: ${({ theme: { colors } }) => colors.custom.white};
  padding: 10px;
`;

export default CustomInput;
