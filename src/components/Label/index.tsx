import React from 'react';
import { IFormControlLabelProps, FormControl, useTheme } from 'native-base';

export default function Label(props: IFormControlLabelProps): JSX.Element {
  const theme = useTheme();
  return (
    <FormControl.Label
      _text={{ color: theme.colors.custom.label }}
      {...props}
    />
  );
}
