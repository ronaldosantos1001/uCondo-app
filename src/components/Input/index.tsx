import React from 'react';
import { IInputProps } from 'native-base';
import { useController } from 'react-hook-form';

import Input from './style';
import Label from '../Label';

interface CustomInputProps extends IInputProps {
  name: string;
  label?: string;
}

export default function CustomInput({
  name,
  label,
  isRequired,
  onChangeText,
  ...props
}: CustomInputProps): JSX.Element {
  const { field } = useController({ name, rules: { required: isRequired } });
  const { value, onChange, onBlur } = field;

  return (
    <>
      {label && <Label>{label}</Label>}
      <Input
        {...props}
        value={value}
        onChangeText={(e) => {
          onChange(e);
          onChangeText?.(e);
        }}
        onBlur={onBlur}
      />
    </>
  );
}
