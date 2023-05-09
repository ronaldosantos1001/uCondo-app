import React from 'react';
import { FormControl, IFormControlLabelProps, useTheme } from 'native-base';

interface LabelProps extends IFormControlLabelProps {}

export default function Label(props: LabelProps): JSX.Element {
  const { colors } = useTheme();
  const { children, ...rest } = props;
  return (
    <FormControl.Label _text={{ color: colors.custom.label }} {...rest}>
      {children}
    </FormControl.Label>
  );
}
